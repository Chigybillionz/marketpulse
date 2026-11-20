const express = require('express');
const router = express.Router();
const {
  getTodaySavingsPlan,
  confirmSavings,
  getSavingsHistory,
  getSavingsStats,
} = require('../controllers/SavingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/today', protect, getTodaySavingsPlan);
router.post('/confirm', protect, confirmSavings);
router.get('/history', protect, getSavingsHistory);
router.get('/stats', protect, getSavingsStats);

module.exports = router;
