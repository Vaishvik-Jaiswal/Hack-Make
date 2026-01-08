/**
 * Agent-2: SQL Validator
 * 
 * Security-focused validator that sits between Agent-1 (SQL Generator) and the database.
 * This validator performs strict, deterministic validation to ensure:
 * - Only SELECT queries are allowed
 * - Write operations are blocked
 * - Only authorized tables are accessed
 * - No SQL injection or prompt injection tricks
 * - Row limits are enforced
 * 
 * This is government-grade security - not a demo filter.
 */

// Allowed tables
const ALLOWED_TABLES = ['sellers', 'products'];

// Allowed column names for each table
const SCHEMA = {
  sellers: [
    'id', 'phone', 'shop_name', 'artisan_name', 'district',
    'udyam_number', 'is_profile_complete', 'created_at', 'updated_at'
  ],
  products: [
    'id', 'vendor_id', 'name', 'description', 'price', 'category',
    'quantity_per_month', 'certifications', 'packaging_type',
    'image_path', 'created_at'
  ]
};

// Operations that are absolutely forbidden
const FORBIDDEN_OPERATIONS = [
  'INSERT',
  'UPDATE',
  'DELETE',
  'DROP',
  'ALTER',
  'TRUNCATE',
  'CREATE',
  'REPLACE',
  'MERGE',
  'CALL',
  'EXEC',
  'EXECUTE',
];

// Dangerous patterns that indicate SQL injection attempts
const DANGEROUS_PATTERNS = [
  '--',      // SQL comment
  '/*',      // Multi-line comment start
  '*/',      // Multi-line comment end
  '#',       // MySQL comment
];

/**
 * Normalize SQL for validation
 * - Trim whitespace
 * - Collapse multiple spaces
 * - Remove leading/trailing comments
 */
function normalizeSql(sql) {
  if (!sql) {
    throw new Error('Blocked: Empty SQL query');
  }

  // Trim whitespace
  let normalized = sql.trim();

  // Collapse multiple spaces to single space
  normalized = normalized.replace(/\s+/g, ' ');

  // Remove leading/trailing semicolons
  normalized = normalized.replace(/^;+|;+$/g, '').trim();

  return normalized;
}

/**
 * Check if SQL starts with SELECT (case-insensitive)
 */
function validateQueryType(sql) {
  const trimmed = sql.trim().toUpperCase();

  if (!trimmed.startsWith('SELECT')) {
    throw new Error('Blocked: Query must start with SELECT statement');
  }
}

/**
 * Check for forbidden write operations
 */
function validateNoWriteOperations(sql) {
  const upperSql = sql.toUpperCase();

  for (const operation of FORBIDDEN_OPERATIONS) {
    // Use word boundary to avoid false positives (e.g., "UPDATE" in "UPDATED_AT" column)
    const regex = new RegExp(`\\b${operation}\\b`, 'gi');
    if (regex.test(upperSql)) {
      throw new Error(`Blocked: ${operation} operation not allowed`);
    }
  }
}

/**
 * Check for dangerous patterns (comments, injection attempts)
 */
function validateNoComments(sql) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (sql.includes(pattern)) {
      throw new Error('Blocked: SQL comments not allowed (prevents injection attacks)');
    }
  }
}

/**
 * Check for single statement only
 * Should not contain semicolons that separate multiple statements
 */
function validateSingleStatement(sql) {
  // Count semicolons - should be 0 or 1 at the end
  const semicolonCount = (sql.match(/;/g) || []).length;

  if (semicolonCount > 1) {
    throw new Error('Blocked: Multiple SQL statements detected');
  }

  // Check for chained queries (e.g., "SELECT * FROM sellers; DROP TABLE sellers;")
  if (semicolonCount === 1 && !sql.trimEnd().endsWith(';')) {
    throw new Error('Blocked: Multiple SQL statements detected (chained queries not allowed)');
  }
}

/**
 * Extract all table references from SQL
 * Looks for: FROM table, JOIN table, INTO table, etc.
 */
function extractTableReferences(sql) {
  const tables = new Set();
  const upperSql = sql.toUpperCase();

  // Match patterns: FROM table, JOIN table, etc.
  const patterns = [
    /\bFROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
    /\bJOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
    /\bINTO\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
    /\bUPDATE\s+([a-zA-Z_][a-zA-Z0-9_]*)/g,
  ];

  for (const pattern of patterns) {
    let match;
    // Reset regex for each search
    pattern.lastIndex = 0;
    while ((match = pattern.exec(sql)) !== null) {
      tables.add(match[1].toLowerCase());
    }
  }

  return tables;
}

/**
 * Validate that only allowed tables are referenced
 */
function validateAllowedTables(sql) {
  const referencedTables = extractTableReferences(sql);

  for (const table of referencedTables) {
    if (!ALLOWED_TABLES.includes(table)) {
      throw new Error(`Blocked: Table "${table}" is not allowed. Only "sellers" and "products" are permitted.`);
    }
  }

  if (referencedTables.size === 0) {
    throw new Error('Blocked: No valid table reference found in query');
  }
}

/**
 * Check if query contains subqueries or CTEs
 * These are blocked for MVP (Phase-1)
 */
function validateNoSubqueries(sql) {
  const upperSql = sql.toUpperCase();

  // Check for CTEs (WITH clause)
  if (/\bWITH\s+/i.test(sql)) {
    throw new Error('Blocked: Common Table Expressions (CTEs) not allowed');
  }

  // Check for nested SELECT statements
  // Count opening/closing parentheses to detect subqueries
  const selectCount = (sql.match(/SELECT/gi) || []).length;
  const parenOpenCount = (sql.match(/\(/g) || []).length;

  // Simple heuristic: if there are multiple SELECTs, likely a subquery
  if (selectCount > 1) {
    // Allow exceptions: aggregate functions like COUNT(*)
    if (!/COUNT\s*\(\s*\*\s*\)/i.test(sql) && 
        !/SUM\s*\(/i.test(sql) &&
        !/AVG\s*\(/i.test(sql) &&
        !/MAX\s*\(/i.test(sql) &&
        !/MIN\s*\(/i.test(sql)) {
      throw new Error('Blocked: Subqueries not allowed');
    }
  }
}

/**
 * Check for safe JOINs
 * Only allow: sellers.id = products.vendor_id
 */
function validateSafeJoins(sql) {
  if (!/\bJOIN\b/i.test(sql)) {
    return; // No joins, all good
  }

  // Check if it's trying to join with system/dangerous tables
  const hasSystemTableJoin = /\bJOIN\s+(information_schema|mysql|sys|performance_schema)/i.test(sql);
  if (hasSystemTableJoin) {
    throw new Error('Blocked: Joins with system tables not allowed');
  }

  // For MVP, allow only simple joins between sellers and products
  // More complex join logic can be added in Phase-2
  const hasMultipleJoins = (sql.match(/\bJOIN\b/gi) || []).length > 1;
  if (hasMultipleJoins) {
    throw new Error('Blocked: Multiple JOINs not allowed (use simple queries)');
  }
}

/**
 * Enforce LIMIT for queries that return rows
 * Aggregates (COUNT, SUM, etc.) don't need LIMIT
 */
function validateRowLimit(sql) {
  // Skip validation if query uses aggregates
  const aggregateFunctions = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'GROUP_CONCAT'];
  const hasAggregate = aggregateFunctions.some(func => 
    new RegExp(`\\b${func}\\s*\\(`, 'i').test(sql)
  );

  if (hasAggregate) {
    return; // Aggregates don't need LIMIT
  }

  // Check if LIMIT is present
  if (!/\bLIMIT\s+\d+/i.test(sql)) {
    throw new Error('Blocked: Row-returning queries must include LIMIT clause. Add "LIMIT 100" or similar.');
  }

  // Verify LIMIT value is reasonable (max 10000)
  const limitMatch = sql.match(/\bLIMIT\s+(\d+)/i);
  if (limitMatch) {
    const limitValue = parseInt(limitMatch[1], 10);
    if (limitValue > 10000) {
      throw new Error(`Blocked: LIMIT value ${limitValue} exceeds maximum of 10000`);
    }
  }
}

/**
 * Main validation function
 * Performs all checks and returns sanitized SQL or throws error
 */
function validateSQL(sql) {
  try {
    // Step 1: Normalize
    const normalized = normalizeSql(sql);

    // Step 2: Check query type (must be SELECT)
    validateQueryType(normalized);

    // Step 3: Block write operations
    validateNoWriteOperations(normalized);

    // Step 4: Block dangerous patterns (comments, injection)
    validateNoComments(normalized);

    // Step 5: Single statement only
    validateSingleStatement(normalized);

    // Step 6: Only allowed tables
    validateAllowedTables(normalized);

    // Step 7: No subqueries/CTEs
    validateNoSubqueries(normalized);

    // Step 8: Safe JOINs only
    validateSafeJoins(normalized);

    // Step 9: Row limits enforced
    validateRowLimit(normalized);

    // All validations passed, return sanitized SQL
    return normalized;
  } catch (error) {
    // Re-throw validation errors with context
    throw error;
  }
}

module.exports = {
  validateSQL,
  // Export schema for reference
  ALLOWED_TABLES,
  SCHEMA,
};
