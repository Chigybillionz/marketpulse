const express = require('express');
const router = express.Router();
const { transcribeAndAnalyze, getWeeklySummaryAudio } = require('../controllers/AIGeminiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/analyze-voice
router.post('/analyze-voice', transcribeAndAnalyze);

// GET /api/ai/weekly-summary (protected - uses the logged-in user's transactions)
router.get('/weekly-summary', protect, getWeeklySummaryAudio);

module.exports = router;
