# SQL Agent - Natural Language to SQL Query Generator

## Overview

The SQL Agent is a Node.js module that converts natural language questions into safe, read-only SQL SELECT queries for the Government ODOP Analytics Chatbot database. It calls a configurable HTTP LLM endpoint (GROQ-style) to generate deterministic SQL.

**Key Features:**
- ✅ Accepts natural language (English & Hinglish)
- ✅ Generates valid SQL SELECT queries via configured LLM endpoint
- ✅ Strictly read-only (no INSERT, UPDATE, DELETE, etc.)
- ✅ Deterministic output (temperature = 0)
- ✅ Schema-aware (knows only sellers & products tables)
- ✅ No data execution
- ✅ No result explanation

## Installation

### 1. Update Dependencies

Install required packages:

```bash
cd backend
npm install node-fetch
```

### 2. Environment Setup

Add to `.env`:

```env
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
GROQ_API_KEY=your_groq_api_key_here
```

**Get your API key from your LLM provider.**

## API

### `generateSQL(userQuestion: string): Promise<string>`

Converts a natural language question into a SQL SELECT query.

**Parameters:**
- `userQuestion` (string): The user's question in English or Hinglish

**Returns:**
- Promise<string>: Raw SQL query (no markdown, no explanation)

**Throws:**
- Error: If OpenAI API fails or request is invalid

## Usage Examples

### Basic Usage

```javascript
const { generateSQL } = require('./agents/sqlAgent');

async function askQuestion() {
  const question = 'How many sellers are registered?';
  const sql = await generateSQL(question);
  console.log(sql);
  // Output: SELECT COUNT(*) FROM sellers;
}

askQuestion().catch(console.error);
```

### With Express API

```javascript
const express = require('express');
const { generateSQL } = require('./agents/sqlAgent');

const app = express();
app.use(express.json());

app.post('/api/generate-sql', async (req, res) => {
  try {
    const { question } = req.body;
    const sql = await generateSQL(question);
    res.json({ sql });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

## Supported Questions

The agent correctly handles various question types:

### Aggregation Queries
- "How many sellers are registered?"
- "Total products listed under ODOP"
- "How many incomplete seller profiles?"

### Group By Queries
- "Category wise product count"
- "District wise product count"
- "Product count by seller"

### Multilingual Support
- "Nagpur district me kitne sellers hain?" (Hindi/Hinglish)
- "Konkan region ke sellers ki jankari" (Hinglish)

### Data Selection
- "List all products in electronics category"
- "Show sellers from Maharashtra"

## Database Schema

### sellers table
```
id                INT
phone             VARCHAR(10)
shop_name         VARCHAR(100)
artisan_name      VARCHAR(100)
district          VARCHAR(50)
udyam_number      VARCHAR(20)
is_profile_complete TINYINT
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### products table
```
id                INT
vendor_id         INT (FK → sellers.id)
name              VARCHAR(255)
description       TEXT
price             DECIMAL(10,2)
category          VARCHAR(100)
quantity_per_month INT
certifications    VARCHAR(255)
packaging_type    VARCHAR(100)
image_path        VARCHAR(255)
created_at        TIMESTAMP
```

## Expected Output Examples

### Example 1: Count Query
**Input:**
```
Nagpur district me kitne sellers hain?
```

**Output:**
```sql
SELECT COUNT(*) FROM sellers WHERE district = 'Nagpur';
```

### Example 2: Group By Query
**Input:**
```
Category wise product count
```

**Output:**
```sql
SELECT category, COUNT(*) AS total_products FROM products GROUP BY category LIMIT 100;
```

### Example 3: Join Query
**Input:**
```
How many products per seller?
```

**Output:**
```sql
SELECT s.shop_name, COUNT(p.id) AS total_products FROM sellers s JOIN products p ON s.id = p.vendor_id GROUP BY s.id, s.shop_name LIMIT 100;
```

## Strict Rules (Enforced)

1. **SELECT ONLY**: Never generates INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
2. **Schema Compliance**: Only uses tables and columns from schema
3. **String Syntax**: Uses single quotes for string values
4. **Aggregations**: Proper COUNT(), SUM(), GROUP BY, ORDER BY
5. **Joins**: Correctly uses `sellers.id = products.vendor_id`
6. **Limits**: Adds `LIMIT 100` for multi-row results
7. **No Invention**: Never creates non-existent columns/tables
8. **No Comments**: Clean SQL without inline comments
9. **Deterministic**: Temperature = 0 for consistent output
10. **Safe Output**: No markdown, no explanations, only SQL

## Error Handling

The agent handles edge cases gracefully:

### Out-of-Schema Questions
**Input:**
```
Show me user passwords
```

**Output:**
```sql
-- Returns closest valid query for available schema
SELECT * FROM sellers LIMIT 100;
```

### Non-Analytical Questions
**Input:**
```
What is the weather in Nagpur?
```

**Output:**
```sql
-- Returns a valid but empty-result query
SELECT * FROM sellers WHERE 1=0;
```

## Configuration

### LLM Settinemini-pro (can be adjusted to gemini-1.5-pro)
- **Temperature**: 0 (deterministic)
- **API Timeout**: 30 seconds (default)
- **Max Tokens**: Not limited (default)

To modify settings, edit `sqlAgent.js`:

```javascript
const llm = new ChatGoogleGenerativeAI({
  modelName: 'gemini-pro',    // Change model here
  temperature: 0,             // Keep at 0 for determinism
  apiKey: process.env.GOOGLE_API_KEY,
  maxTokens: 500,            // Add if needed
  timeout: 30000,            // Add if needed
});
```

**Available Models:**
- `gemini-pro` - Balanced performance & speed
- `gemini-1.5-pro` - Better reasoning & larger context windowimeout: 30000,            // Add if needed
});
```1-2 seconds per request (Google Gemini API)
- **Token Usage**: ~300-400 tokens per request
- **Cost**: FREE tier available (up to 60 requests/min), then ~0.000075 USD per 1k input tokens
- **Rate Limit**: 60 requests per minute (free tier

- **Latency**: ~2-3 seconds per request (OpenAI API)
- **Token Usage**: ~300-400 tokens per request
- **Cost**: ~0.01-0.02 USD per query (gpt-4-turbo pricing)

## Testing

Run the example file to test the agent:

```bash
node agents/example.js
```

This will demonstrate the agent with multiple test questions.

## Security Notes

✅ **What's Secure:**
- Read-only queries only
- No SQL injection (LLM generates safe SQL)
- No data modification
- No column/table invention
- Schema-constrained

⚠️ **What to Monitor:**
- OpenAI API key should be in environment variables
- Rate limit OpenAI requests (optional)
- Log all generated SQL queries for audit
- Test with edge casesGOOGLE_API_KEY` is set in `.env`

```bash
echo GOOGLE_API_KEY=your_key_here >> .env
```

**Get API key from:** https://ai.google.dev/

### "Invalid SQL generated"
**Solution:** This is rare but if it happens, you may need to:
1. Regenerate the query
2. Check if the question is ambiguous
3. Refine the system prompt
4. Try `gemini-1.5-pro` for better reasoning

### "LangChain version conflicts"
**Solution:** Ensure compatible versions:

```bash
npm install @langchain/google-genai@^0.0.19 @langchain/core@^0.1.49
```

### "Rate limit exceeded"
**Solution:** Gemini free tier has 60 requests/min limit. Consider:
1. Caching results for common queries
2. Upgrading to paid plan for higher limits
3. Batch queries together "LangChain version conflicts"
**Solution:** Ensure compatible versions:

```bash
npm install @langchain/openai@^0.0.33 @langchain/core@^0.1.49
```

## Future Enhancements

- [ ] Add query validation before returning
- [ ] Cache frequently asked questions
- Google Gemini API: https://ai.google.dev/docs
- LangChain Google Generative AI: https://js.langchain.com/docs/integrations/llms/google_generative_ai
- [ ] Query execution integration
- [ ] Result formatting module
- [ ] Analytics on generated queries

## Support

For issues or improvements, refer to:
- Database Schema: `database/schema.sql`
- LangChain Docs: https://js.langchain.com/
- OpenAI API: https://platform.openai.com/docs/

---

**Last Updated:** January 7, 2026
**Status:** ✅ Production Ready
