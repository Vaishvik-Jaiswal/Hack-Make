const express = require('express');
const router = express.Router();
const { handleQuery } = require('../controllers/agentController');

// POST /api/agents/query
router.post('/query', handleQuery);

// Convenience: GET /api/agents/query
// Browsing to the URL will return a helpful message explaining POST usage.
router.get('/query', (req, res) => {
	res.status(200).json({
		success: false,
		message: 'This endpoint accepts POST requests with JSON body { question: "..." }. Use POST /api/agents/query',
	});
});

module.exports = router;
