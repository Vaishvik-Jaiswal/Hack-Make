# SQL Agent Setup & Troubleshooting Guide

## Overview

The SQL Agent converts natural language questions into safe, read-only SQL SELECT queries using a configurable HTTP LLM endpoint. By default this repository targets a GROQ-style HTTP API (configure `GROQ_API_URL` and `GROQ_API_KEY`). The agent includes automatic retry logic with exponential backoff for handling rate limits.

## Quick Setup

### 1. Configure GROQ HTTP endpoint (required)

Provide the GROQ-style endpoint URL and API key in `.env`:

```env
GROQ_API_URL=https://api.groq.ai/v1/generate
GROQ_API_KEY=your_groq_api_key_here
```

If you use a different LLM provider, set `GROQ_API_URL` to the provider's generate endpoint and `GROQ_API_KEY` accordingly. The agent sends a JSON POST with `prompt`, `temperature`, and `max_tokens`.

### 2. Test It

```bash
cd backend
npm install  # if not already done
node agents/example.js
```

## Available Models

| Model | Status | Notes |
|-------|--------|-------|
| `gemini-pro` | ✅ Recommended | Text-only, stable, production-ready |
| `gemini-pro-vision` | ✅ Available | Text + image input capability |
| `gemini-1.5-flash` | ⚠️ Check availability | Newer, faster, may not be in all regions |
| `gemini-2.0-flash` | ⚠️ Check availability | Latest model, may hit quota limits |

**To find available models:**

```bash
# Go to: https://ai.google.dev/models
# Or run the listModels script (if API key is valid):
node agents/listModels.js
```

## Error Messages & Solutions

### ❌ "API key not valid"

**Cause:** Invalid, expired, or placeholder API key  
**Solution:**
1. Get a new key from https://ai.google.dev/
2. Ensure it's the exact key from your Google AI project
3. Update `.env` with the correct key
4. Restart your application

### ❌ "429 Too Many Requests / Quota exceeded"

**Cause:** Free tier rate limit exceeded  
**Solution:**
1. **Wait:** Agent will automatically retry with exponential backoff (up to 30 seconds)
2. **Check quota:** https://ai.dev/usage?tab=rate-limit
3. **Upgrade plan:** Switch to paid plan for higher limits
4. **Use different model:** Try `gemini-pro-vision` instead of `gemini-2.0-flash`

### ❌ "404 Not Found - model not supported"

**Cause:** Model name doesn't exist or isn't available in your region  
**Solution:**
1. Check available models: https://ai.google.dev/models
2. Update `GEMINI_MODEL` in `.env` to a working model
3. Verify your API key has access to that model

### ❌ "Unexpected end of JSON input"

**Cause:** LangChain compatibility issue (old versions)  
**Solution:**
- Agent now uses native Google SDK - this should not occur
- If it does, run: `npm install @google/generative-ai`

## Configuration Options

### Model Selection

Edit `.env`:

```env
# Text-only (recommended)
GEMINI_MODEL=gemini-pro

# With vision capability
GEMINI_MODEL=gemini-pro-vision

# Newer models (if available)
GEMINI_MODEL=gemini-1.5-flash
GEMINI_MODEL=gemini-2.0-flash
```

### Retry Behavior

The agent automatically retries on quota/rate limit errors with exponential backoff:

- Attempt 1: Immediate
- Attempt 2: Wait 1 second
- Attempt 3: Wait 2 seconds
- Max wait: 30 seconds

To customize (edit `agents/sqlAgent.js`):

```javascript
// Change retries parameter
const sql = await generateSQL(userQuestion, 5); // 5 retries instead of 3
```

## API Usage & Costs

### Free Tier (Gemini API)

- **Requests per minute:** 60
- **Tokens per minute:** 10,000
- **Daily limit:** 1,500 free requests
- **Cost:** FREE

### Paid Tier

- **Cost per 1M input tokens:** $0.075
- **Cost per 1M output tokens:** $0.30
- **Unlimited requests**

**Monitor usage:** https://ai.dev/usage

## Typical SQL Generation

### Input
```
How many sellers are registered?
```

### Output (with valid API key)
```sql
SELECT COUNT(*) FROM sellers;
```

### Processing
1. Agent receives question
2. Calls Gemini API with system prompt + question
3. Receives SQL from model (temperature=0 for determinism)
4. Strips markdown formatting
5. Returns clean SQL

## Database Schema Reference

The agent has access to these tables:

**sellers**
- id, phone, shop_name, artisan_name, district, udyam_number, is_profile_complete, created_at, updated_at

**products**
- id, vendor_id (FK to sellers), name, description, price, category, quantity_per_month, certifications, packaging_type, image_path, created_at

## Security Notes

✅ **Safe:**
- Read-only queries only (no INSERT/UPDATE/DELETE)
- No data modification possible
- Schema-constrained (only knows 2 tables)
- Deterministic output (temp=0)
- API key stored in `.env` (not in code)

⚠️ **Best Practices:**
- Never commit `.env` to git
- Rotate API keys periodically
- Monitor usage for suspicious activity
- Use `.env.example` template for team setup

## Example `.env` Template

```env
# Google Gemini API
GOOGLE_API_KEY=your_key_here
GEMINI_MODEL=gemini-pro

# Other config
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ODOP_Admin_2026
DB_NAME=odop_marketplace
```

## Testing

Run the full test suite:

```bash
cd backend
node agents/example.js
```

You should see output like:

```
🚀 SQL Agent - Natural Language to SQL Conversion

📝 Question: How many sellers are registered?
⏳ Calling gemini-pro (attempt 1/3)...
✅ Successfully generated SQL
✅ Generated SQL:
SELECT COUNT(*) FROM sellers;
```

## Support & Resources

- **Google Gemini API Docs:** https://ai.google.dev/docs
- **Rate Limits:** https://ai.google.dev/gemini-api/docs/rate-limits
- **Models:** https://ai.google.dev/models
- **Usage Dashboard:** https://ai.dev/usage
- **GitHub Issues:** Report bugs in the project repo

## Troubleshooting Checklist

- [ ] API key is valid and from https://ai.google.dev/
- [ ] `.env` file exists in `backend/` directory
- [ ] `GOOGLE_API_KEY` is set to actual key (not placeholder)
- [ ] `GEMINI_MODEL` is set to available model
- [ ] Dependencies installed: `npm install`
- [ ] Node.js version is 14+ (check: `node --version`)
- [ ] No proxy/firewall blocking googleapis.com
- [ ] Project has Gemini API enabled

## Next Steps

After setup works:

1. **Integrate into backend:** Import `generateSQL` in your route handlers
2. **Add database execution:** Execute returned SQL and format results
3. **Cache results:** Store common queries for performance
4. **Add logging:** Log all queries for audit trail
5. **Monitor usage:** Track API costs and rate limits

---

**Last Updated:** January 7, 2026  
**Status:** ✅ Production Ready (with valid API key)
