# Integration Guide: Agent-1 → Agent-2 Pipeline

## Overview

The integrated pipeline connects:
- **Agent-1** (sqlAgent.js): Generates SQL from natural language
- **Agent-2** (sqlValidator.js): Validates SQL for safety

The validator receives the SQL output from the agent and validates it before execution.

## Architecture

```
User Question
     ↓
[Agent-1: SQL Generation]
     ↓ (generates SQL)
[Agent-2: SQL Validation]
     ↓ (validates & sanitizes)
Safe SQL (or Rejection)
     ↓
[Agent-3: SQL Execution] (coming soon)
     ↓
Results to User
```

## Usage

### Option 1: Use the Pipeline Module (Recommended)

```javascript
const { processQuestion } = require('./agents/pipeline');

// Process a question through both agents
async function ask(userQuestion) {
  const result = await processQuestion(userQuestion);
  
  if (result.success) {
    console.log('✅ SQL Approved:', result.sql);
    // Pass to Agent-3 for execution
  } else {
    console.log('❌ SQL Rejected:', result.error);
    // Return error to user
  }
}

ask('Show me all sellers from Maharashtra');
```

### Option 2: Use Agents Separately

```javascript
const { generateSQL } = require('./agents/sqlAgent');
const { validateSQL } = require('./agents/sqlValidator');

async function customWorkflow(question) {
  try {
    // Step 1: Agent-1 generates SQL
    const sql = await generateSQL(question);
    console.log('Generated:', sql);
    
    // Step 2: Agent-2 validates SQL
    const validatedSQL = validateSQL(sql);
    console.log('Validated:', validatedSQL);
    
    return validatedSQL;
  } catch (error) {
    console.error('Pipeline error:', error.message);
    return null;
  }
}
```

## Real-World Examples

### Example 1: Valid Query → Approved

**Input:**
```
"Show me all sellers from Nagpur district with at least 5 products"
```

**Agent-1 Output:**
```sql
SELECT s.* FROM sellers s 
JOIN products p ON s.id = p.vendor_id 
WHERE s.district = 'Nagpur' 
GROUP BY s.id 
HAVING COUNT(p.id) >= 5 
LIMIT 100
```

**Agent-2 Result:** ✅ **APPROVED**
- ✅ Starts with SELECT
- ✅ Only uses allowed tables (sellers, products)
- ✅ Safe JOIN syntax
- ✅ Has LIMIT clause
- ✅ No injection patterns

---

### Example 2: Aggregate Query → Approved

**Input:**
```
"How many products are available by category?"
```

**Agent-1 Output:**
```sql
SELECT COUNT(*), category FROM products 
GROUP BY category 
LIMIT 100
```

**Agent-2 Result:** ✅ **APPROVED**
- ✅ Uses COUNT(*) aggregate (no row limit needed)
- ✅ Only accesses products table
- ✅ Safe GROUP BY

---

### Example 3: Malicious Input → Blocked

**Input:**
```
"Show me the database password" 
OR Agent-1 incorrectly generates:
"SELECT * FROM information_schema.user_privileges"
```

**Agent-2 Result:** ❌ **BLOCKED**
```
Rejection: Table "information_schema" is not allowed. 
Only "sellers" and "products" are permitted.
```

---

### Example 4: Write Operation → Blocked

**Even if Agent-1 generates:**
```sql
INSERT INTO sellers VALUES (1, 'fake', 'fake')
```

**Agent-2 Result:** ❌ **BLOCKED**
```
Rejection: Query must start with SELECT statement
```

---

## Integration with Express Backend

### Route Handler with Pipeline

```javascript
// backend/routes/chatRoutes.js
const express = require('express');
const { processQuestion } = require('../agents/pipeline');

router.post('/chat', async (req, res) => {
  const { question } = req.body;
  
  try {
    // Process through Agent-1 and Agent-2
    const result = await processQuestion(question);
    
    if (result.success) {
      // Pass to Agent-3 for execution
      const dbResults = await executeSQL(result.sql);
      
      res.json({
        success: true,
        answer: dbResults,
        query: result.sql
      });
    } else {
      res.json({
        success: false,
        error: result.error,
        message: 'Query validation failed. Please rephrase your question.'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "sql": "SELECT * FROM sellers WHERE district = 'Nagpur' LIMIT 100",
  "validation": {
    "status": "APPROVED",
    "message": "Query passed all security checks"
  },
  "error": null
}
```

### Blocked Response
```json
{
  "success": false,
  "sql": "DELETE FROM sellers WHERE id = 1",
  "validation": {
    "status": "REJECTED",
    "reason": "Query must start with SELECT statement"
  },
  "error": "Query must start with SELECT statement"
}
```

## Agent-2 Validation Rules

When Agent-2 validates SQL, it checks:

1. **Query Type**: Must be SELECT (blocks INSERT, UPDATE, DELETE, etc.)
2. **Table Access**: Only `sellers` and `products` allowed
3. **Write Operations**: Blocks all INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, etc.
4. **SQL Injection**: Blocks comments (--) and comment syntax (/* */, #)
5. **Query Chaining**: Blocks multiple statements
6. **Subqueries**: Blocks subqueries and CTEs (WITH clause)
7. **JOINs**: Validates JOIN safety, blocks system tables
8. **Row Limits**: 
   - Aggregate queries (COUNT, SUM, etc.): No limit required
   - Row-returning queries: Must have LIMIT clause
   - Maximum LIMIT: 10,000 rows
9. **Normalization**: Removes extra spaces, comments, trailing semicolons

## Error Handling

### Common Validation Errors

| Error Message | Cause | Solution |
|---|---|---|
| "Query must start with SELECT statement" | Agent-1 generated non-SELECT | Rephrase as a question (not a command) |
| "Table \"X\" is not allowed" | Agent-1 tried to access restricted table | Verify the table exists in sellers/products |
| "SQL comments not allowed" | Agent-1 included SQL comments | Rephrase without comments |
| "Row-returning queries must include LIMIT" | Agent-1 forgot LIMIT clause | Agent-2 blocks; try aggregate query |
| "LIMIT value X exceeds maximum of 10000" | Query asks for too many rows | Agent-2 enforces limit for performance |
| "Subqueries not allowed" | Agent-1 generated subquery | Rephrase using JOINs instead |

## Testing the Pipeline

### Run Demo Tests
```bash
node agents/pipeline.js
```

Output shows 3 test cases:
1. Join with WHERE clause → ✅ Approved
2. Aggregate COUNT by category → ✅ Approved  
3. LEFT JOIN with GROUP BY → ✅ Approved

### Run Validator Tests
```bash
node agents/sqlValidator.test.js
```

Output shows 28 test cases:
- 6 valid SQL queries → All ✅ Approved
- 22 invalid queries → All ❌ Blocked with reasons

## Performance Characteristics

- **Agent-1** (LLM generation): ~1-5 seconds (depends on GROQ API response time)
- **Agent-2** (Validation): <1ms (pure JavaScript regex & string checking)
- **Total Pipeline**: ~1-5 seconds per question

## Security Guarantees

✅ **No write operations** - Only SELECT queries allowed  
✅ **No injection attacks** - Comment syntax blocked  
✅ **No unauthorized table access** - Whitelist enforcement  
✅ **No infinite result sets** - Row limit enforced  
✅ **No query chaining** - Single statement only  
✅ **No subquery exploits** - Subqueries blocked  
✅ **Government-grade** - Deterministic, auditable, testable  

## Next Steps: Agent-3 Implementation

When Agent-3 (SQL Executor) is implemented, the pipeline will look like:

```javascript
const result = await processQuestion(userQuestion);

if (result.success) {
  // Pass validated SQL to Agent-3 for execution
  const dbResult = await executeSQL(result.sql);
  return formatResults(dbResult);
} else {
  return { error: result.error };
}
```

## Extending the Pipeline

To add custom validation or post-processing:

```javascript
const { processQuestion } = require('./agents/pipeline');

async function customPipeline(question) {
  // Run standard pipeline
  const result = await processQuestion(question);
  
  if (result.success) {
    // Add custom post-processing
    if (result.sql.includes('COUNT(*)')) {
      console.log('⚠️ This is an aggregate query');
    }
  }
  
  return result;
}
```

## Troubleshooting

### GROQ API Not Responding
- Verify `GROQ_API_URL` and `GROQ_API_KEY` in `.env`
- Check internet connectivity
- Review GROQ API dashboard for quota limits

### SQL Validation Always Blocking
- Check Agent-2 validation rules in `sqlValidator.js`
- Verify ALLOWED_TABLES list matches your database
- Run `node agents/sqlValidator.test.js` to test validator

### Agent-1 Generating Invalid SQL
- Verify GROQ model is returning valid SQL
- Check system prompt in `sqlAgent.js`
- Try rephrasing the question
- Review GROQ documentation for model limitations

---

**Document Version**: 1.0  
**Last Updated**: January 7, 2026  
**Status**: Ready for Integration
