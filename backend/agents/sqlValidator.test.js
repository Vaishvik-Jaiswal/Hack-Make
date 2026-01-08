/**
 * SQL Validator Test Suite
 * Demonstrates Agent-2 security validation with comprehensive test cases
 */

const { validateSQL } = require('./sqlValidator');

// Test cases
const testCases = [
  // ✅ VALID CASES
  {
    name: 'Simple count query',
    sql: 'SELECT COUNT(*) FROM sellers',
    shouldPass: true,
  },
  {
    name: 'Query with WHERE clause',
    sql: 'SELECT * FROM sellers WHERE district = \'Nagpur\' LIMIT 100',
    shouldPass: true,
  },
  {
    name: 'Group by with aggregate',
    sql: 'SELECT category, COUNT(*) AS total FROM products GROUP BY category',
    shouldPass: true,
  },
  {
    name: 'Join query',
    sql: 'SELECT s.shop_name, COUNT(p.id) FROM sellers s JOIN products p ON s.id = p.vendor_id GROUP BY s.id, s.shop_name',
    shouldPass: true,
  },
  {
    name: 'Query with ORDER BY',
    sql: 'SELECT * FROM sellers ORDER BY created_at DESC LIMIT 50',
    shouldPass: true,
  },
  {
    name: 'Multiple column selection with limit',
    sql: 'SELECT id, phone, shop_name FROM sellers LIMIT 100',
    shouldPass: true,
  },

  // ❌ INVALID CASES - Write Operations
  {
    name: 'INSERT operation blocked',
    sql: 'INSERT INTO sellers (phone, shop_name) VALUES (\'1234567890\', \'Shop\')',
    shouldPass: false,
  },
  {
    name: 'UPDATE operation blocked',
    sql: 'UPDATE sellers SET phone = \'9999999999\' WHERE id = 1',
    shouldPass: false,
  },
  {
    name: 'DELETE operation blocked',
    sql: 'DELETE FROM products WHERE id = 1',
    shouldPass: false,
  },
  {
    name: 'DROP operation blocked',
    sql: 'DROP TABLE sellers',
    shouldPass: false,
  },
  {
    name: 'ALTER operation blocked',
    sql: 'ALTER TABLE sellers ADD COLUMN new_col VARCHAR(100)',
    shouldPass: false,
  },
  {
    name: 'TRUNCATE operation blocked',
    sql: 'TRUNCATE TABLE sellers',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Comments/Injection
  {
    name: 'SQL comment (--) blocked',
    sql: 'SELECT * FROM sellers -- DROP TABLE sellers; LIMIT 100',
    shouldPass: false,
  },
  {
    name: 'SQL comment (/*) blocked',
    sql: 'SELECT * FROM sellers /* UNION SELECT * FROM users */ LIMIT 100',
    shouldPass: false,
  },
  {
    name: 'MySQL comment (#) blocked',
    sql: 'SELECT * FROM sellers # DROP TABLE sellers\nLIMIT 100',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Unauthorized Tables
  {
    name: 'Unauthorized table (users) blocked',
    sql: 'SELECT * FROM users LIMIT 100',
    shouldPass: false,
  },
  {
    name: 'System table (information_schema) blocked',
    sql: 'SELECT * FROM information_schema.tables',
    shouldPass: false,
  },
  {
    name: 'System table (mysql.user) blocked',
    sql: 'SELECT * FROM mysql.user',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Multiple Statements
  {
    name: 'Chained queries blocked',
    sql: 'SELECT * FROM sellers LIMIT 100; DROP TABLE sellers;',
    shouldPass: false,
  },
  {
    name: 'Multiple statements blocked',
    sql: 'SELECT * FROM sellers; DELETE FROM products;',
    shouldPass: false,
  },

  // ❌ INVALID CASES - No Query Type
  {
    name: 'Non-SELECT query blocked',
    sql: 'UPDATE sellers SET phone = \'1234567890\'',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Missing LIMIT
  {
    name: 'Missing LIMIT blocked',
    sql: 'SELECT * FROM sellers',
    shouldPass: false,
  },
  {
    name: 'Missing LIMIT with WHERE blocked',
    sql: 'SELECT id, shop_name FROM sellers WHERE district = \'Nagpur\'',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Subqueries
  {
    name: 'Subquery blocked',
    sql: 'SELECT * FROM (SELECT * FROM sellers) AS sub LIMIT 100',
    shouldPass: false,
  },
  {
    name: 'CTE (WITH clause) blocked',
    sql: 'WITH seller_stats AS (SELECT id, COUNT(*) as cnt FROM sellers GROUP BY id) SELECT * FROM seller_stats',
    shouldPass: false,
  },

  // ❌ INVALID CASES - Edge Cases
  {
    name: 'Empty query blocked',
    sql: '',
    shouldPass: false,
  },
  {
    name: 'Only whitespace blocked',
    sql: '   \n\t  ',
    shouldPass: false,
  },
  {
    name: 'LIMIT exceeds maximum',
    sql: 'SELECT * FROM sellers LIMIT 100000',
    shouldPass: false,
  },
];

// Run tests
function runTests() {
  console.log('🧪 SQL Validator Test Suite\n');
  console.log('='.repeat(70));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const result = validateSQL(testCase.sql);
      
      if (testCase.shouldPass) {
        console.log(`✅ PASS: ${testCase.name}`);
        console.log(`   SQL: ${result.substring(0, 60)}${result.length > 60 ? '...' : ''}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${testCase.name}`);
        console.log(`   Expected rejection but query was accepted`);
        failed++;
      }
    } catch (error) {
      if (!testCase.shouldPass) {
        console.log(`✅ PASS: ${testCase.name}`);
        console.log(`   Rejection: ${error.message}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${testCase.name}`);
        console.log(`   Error: ${error.message}`);
        failed++;
      }
    }
    console.log();
  }

  console.log('='.repeat(70));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Validator is working correctly.\n');
  } else {
    console.log(`⚠️  ${failed} test(s) failed.\n`);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
