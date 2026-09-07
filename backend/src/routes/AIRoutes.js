const express = require('express');
const router = express.Router();
const { transcribeAndAnalyze } = require('../controllers/AIGeminiController');

// POST /api/ai/analyze-voice
router.post('/analyze-voice', transcribeAndAnalyze);

module.exports = router;
