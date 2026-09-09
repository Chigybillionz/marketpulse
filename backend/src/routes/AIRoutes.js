const express = require('express');
const router = express.Router();
const { transcribeAndAnalyze, getSummaryAudio } = require('../controllers/AIGeminiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/analyze-voice
router.post('/analyze-voice', transcribeAndAnalyze);

// GET /api/ai/summary?period=daily|weekly|monthly (protected - uses the
// logged-in user's transactions)
router.get('/summary', protect, getSummaryAudio);

// Legacy alias: GET /api/ai/weekly-summary (defaults to weekly)
router.get('/weekly-summary', protect, getSummaryAudio);

module.exports = router;
