/**
 * Agent-3: SQL Executor
 *
 * Read-only database executor that:
 * - Accepts already validated SQL from Agent-2
 * - Executes against MySQL database with read-only connection
 * - Returns raw database results
 * - Handles DB errors gracefully
 * - Never modifies database state
 *
 * Security: This agent assumes SQL has been validated by Agent-2.
 * It adds an additional safety layer by using read-only DB connections.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Create read-only connection pool
 * Uses separate user account with SELECT-only privileges
 */
function createReadOnlyPool() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_READONLY_USER || process.env.DB_USER,
    password: process.env.DB_READONLY_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'odop_marketplace',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
    timeout: 10000
  });

  return pool;
}

let connectionPool = null;

/**
 * Initialize the connection pool
 * Call this once at application startup
 */
async function initializePool() {
  if (!connectionPool) {
    connectionPool = createReadOnlyPool();
    console.log('✅ Database connection pool initialized (read-only)');
  }
  return connectionPool;
}

/**
 * Execute already-validated SQL
 *
 * @param {string} validatedSQL - SQL that has been validated by Agent-2
 * @param {object} options - Execution options
 * @param {number} options.timeout - Query timeout in ms (default 30000)
 * @param {number} options.maxRows - Max rows to return (default 10000)
 * @returns {Promise<{success: boolean, rows: Array, count: number, error: string}>}
 */
async function executeSQL(validatedSQL, options = {}) {
  const {
    timeout = 30000,
    maxRows = 10000
  } = options;

  // Initialize pool if needed
  if (!connectionPool) {
    await initializePool();
  }

  const startTime = Date.now();

  try {
    // ============================================
    // SAFETY CHECKS (Defense in Depth)
    // ============================================

    // Check 1: Ensure it's a SELECT query
    const trimmed = validatedSQL.trim().toUpperCase();
    if (!trimmed.startsWith('SELECT')) {
      return {
        success: false,
        rows: [],
        count: 0,
        error: 'Safety Check Failed: Query must be SELECT (Agent-3 safety layer)'
      };
    }

    // Check 2: Block dangerous keywords that shouldn't reach here
    const dangerousKeywords = [
      'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
      'ALTER', 'TRUNCATE', 'REPLACE', 'MERGE', 'EXEC',
      'EXECUTE', 'CALL', 'REVOKE', 'GRANT'
    ];

    for (const keyword of dangerousKeywords) {
      if (trimmed.includes(` ${keyword} `) || trimmed.includes(`\n${keyword} `)) {
        return {
          success: false,
          rows: [],
          count: 0,
          error: `Safety Check Failed: ${keyword} keyword detected (Agent-3 safety layer)`
        };
      }
    }

    // ============================================
    // EXECUTE QUERY
    // ============================================

    let connection;

    try {
      // Get connection from pool
      connection = await Promise.race([
        connectionPool.getConnection(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), timeout)
        )
      ]);

      console.log(`⏳ Executing query (timeout: ${timeout}ms)...`);

      // Execute with timeout
      const [rows] = await Promise.race([
        connection.query(validatedSQL),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Query timeout after ${timeout}ms`)), timeout)
        )
      ]);

      const executionTime = Date.now() - startTime;

      // Check result set size
      if (Array.isArray(rows)) {
        if (rows.length > maxRows) {
          console.warn(`⚠️ Result set limited: ${rows.length} rows returned, displaying first ${maxRows}`);
          rows.length = maxRows;
        }

        return {
          success: true,
          rows: rows,
          count: rows.length,
          executionTime: executionTime,
          error: null
        };
      } else {
        // Query returned metadata (INSERT, UPDATE, etc.)
        // This shouldn't happen with SELECT, but handle gracefully
        return {
          success: true,
          rows: [],
          count: 0,
          metadata: rows,
          executionTime: executionTime,
          error: null
        };
      }
    } finally {
      // Always release connection back to pool
      if (connection) {
        connection.release();
      }
    }
  } catch (error) {
    const executionTime = Date.now() - startTime;

    // Categorize and handle different error types
    let errorCategory = 'Database Error';
    let userMessage = 'An error occurred while executing the query';

    if (error.message.includes('timeout')) {
      errorCategory = 'Timeout Error';
      userMessage = `Query took longer than ${options.timeout}ms to execute`;
    } else if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      errorCategory = 'Database Permission Error';
      userMessage = 'Database access denied (read-only user permission issue)';
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorCategory = 'Invalid Column';
      userMessage = `Invalid column referenced in query`;
    } else if (error.code === 'ER_TABLE_NOT_FOUND') {
      errorCategory = 'Table Not Found';
      userMessage = `Referenced table does not exist`;
    } else if (error.code === 'ER_SYNTAX_ERROR') {
      errorCategory = 'SQL Syntax Error';
      userMessage = 'Invalid SQL syntax (should have been caught by Agent-2)';
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorCategory = 'Table Not Found';
      userMessage = 'Referenced table does not exist';
    }

    return {
      success: false,
      rows: [],
      count: 0,
      error: `${errorCategory}: ${userMessage}`,
      details: error.message,
      executionTime: executionTime,
      code: error.code
    };
  }
}

/**
 * Test database connection
 * Useful for verifying credentials and connectivity
 */
async function testConnection() {
  try {
    if (!connectionPool) {
      await initializePool();
    }

    const connection = await connectionPool.getConnection();
    const [rows] = await connection.query('SELECT 1 AS health_check');
    connection.release();

    return {
      success: true,
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: 'Database connection failed',
      error: error.message
    };
  }
}

/**
 * Get database info (table names, structure)
 * Useful for Agent-1 to know available schema
 */
async function getDatabaseInfo() {
  try {
    if (!connectionPool) {
      await initializePool();
    }

    const connection = await connectionPool.getConnection();

    // Get all tables
    const [tables] = await connection.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
      [process.env.DB_NAME || 'odop_marketplace']
    );

    const info = {};

    // Get structure for each table
    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      const [columns] = await connection.query(
        `DESCRIBE ${tableName}`
      );
      info[tableName] = columns.map(col => ({
        name: col.Field,
        type: col.Type,
        nullable: col.Null === 'YES'
      }));
    }

    connection.release();

    return {
      success: true,
      database: process.env.DB_NAME || 'odop_marketplace',
      tables: info
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Gracefully close connection pool
 * Call this on application shutdown
 */
async function closePool() {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = null;
    console.log('✅ Database connection pool closed');
  }
}

// Export functions
module.exports = {
  executeSQL,
  initializePool,
  testConnection,
  getDatabaseInfo,
  closePool
};
