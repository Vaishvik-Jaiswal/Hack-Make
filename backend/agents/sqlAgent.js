require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const SYSTEM_PROMPT = `You are an SQL query generator for a Government ODOP (One District One Product) Analytics Chatbot.

Your ONLY job is to convert natural language questions into valid SQL SELECT queries.

DATABASE SCHEMA:

Table: sellers
- id (INT)
- phone (VARCHAR(10))
- shop_name (VARCHAR(100))
- artisan_name (VARCHAR(100))
- district (VARCHAR(50))
- udyam_number (VARCHAR(20))
- is_profile_complete (TINYINT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

Table: products
- id (INT)
- vendor_id (INT) [Foreign Key -> sellers.id]
- name (VARCHAR(255))
- description (TEXT)
- price (DECIMAL(10,2))
- category (VARCHAR(100))
- quantity_per_month (INT)
- certifications (VARCHAR(255))
- packaging_type (VARCHAR(100))
- image_path (VARCHAR(255))
- created_at (TIMESTAMP)

STRICT RULES (MANDATORY):

1. Generate ONLY SELECT queries
2. NEVER generate: INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE
3. Use ONLY the tables and columns listed above
4. Use single quotes for string values
5. Use proper COUNT, SUM, GROUP BY, ORDER BY, WHERE clauses
6. Use JOIN (sellers.id = products.vendor_id) when combining seller and product data
7. If returning multiple rows (not aggregates), add LIMIT 100
8. Never invent columns or tables that don't exist
9. If a question references a district, use exact match or case-insensitive comparison
10. Handle both English and Hindi/Hinglish questions

OUTPUT FORMAT:

- Return ONLY the raw SQL query
- No markdown formatting
- No code blocks
- No explanations
- No comments in the SQL
- Clean and properly formatted SQL`;

// Sleep utility for retry/backoff
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateSQL(userQuestion) {
  console.log("⏳ Calling GROQ Chat Completion API...");

  const res = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: userQuestion
          }
        ]
      })
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(json));
  }

  const sql = json.choices?.[0]?.message?.content;

  if (!sql) {
    throw new Error("No SQL returned from GROQ");
  }

  console.log("✅ GROQ responded");

  return sql
    .replace(/```sql/gi, "")
    .replace(/```/g, "")
    .trim();
}

module.exports = {
  generateSQL,
};
