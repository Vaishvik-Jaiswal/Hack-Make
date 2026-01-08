const { processQuestion } = require('../../agents/pipeline');
const { interpretResult } = require('../../agents/resultInterpreterLLM');

async function handleQuery(req, res) {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, message: 'question is required' });
    }

    // -------------------------
    // Backend input pre-check (defense-in-depth)
    // - Reject single-word greetings and very short inputs
    // - Require an interrogative word (what/how/when/where/why/etc.) or a question mark
    // -------------------------
    const text = question.trim();
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);

    const greetingsRegex = /^(hi|hello|hey|thanks|thank you|good morning|good afternoon|good evening|yo|hiya)$/i;
    if (words.length === 1 && greetingsRegex.test(lower)) {
      return res.status(400).json({ success: false, message: 'Please ask a clear analytical question (e.g. "How many sellers in Nagpur?")' });
    }

    const interrogatives = [
      'what', 'how', 'when', 'where', 'why', 'who', 'which', 'whom', 'whose',
      'does', 'do', 'is', 'are', 'can', 'could', 'would', 'should', 'will', 'may', 'how many', 'how much'
    ];

    const hasInterrogative = interrogatives.some((w) => lower.includes(w));

    // If input is very short (2 or fewer words) and doesn't look like a question, ask to rephrase
    if (words.length <= 2 && !hasInterrogative && !text.includes('?')) {
      return res.status(400).json({ success: false, message: 'Please ask a clear analytical question (e.g. "How many sellers in Nagpur?")' });
    }

    const result = await processQuestion(question);

    // If execution succeeded and returned rows, run Agent-4 (interpreter)
    try {
      if (result && result.execution && result.execution.success && Array.isArray(result.execution.rows)) {
        const rows = result.execution.rows;
        const validatedSQL = result.sql || '';
        const interp = await interpretResult(question, validatedSQL, rows);

        // attach interpretation output (success + answer or error)
        result.interpretation = interp;
      } else {
        result.interpretation = { success: false, error: 'No execution rows available for interpretation' };
      }
    } catch (interpErr) {
      console.error('Interpretation error:', interpErr);
      result.interpretation = { success: false, error: interpErr.message || String(interpErr) };
    }

    // Return full pipeline result so frontend can inspect generation/validation/execution and interpretation
    return res.status(200).json(result);
  } catch (err) {
    console.error('Agent controller error:', err);
    // Always return JSON on error to avoid frontend JSON parse failures
    return res.status(500).json({ 
      success: false, 
      error: err.message || 'Internal server error',
      message: 'Agent pipeline error' 
    });
  }
}

module.exports = {
  handleQuery,
};
