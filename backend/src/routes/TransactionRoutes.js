const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getFinancialSummary,
  createTransaction,
} = require('../controllers/TransactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/financial-summary').get(protect, getFinancialSummary);
router.route('/').get(protect, getTransactions).post(protect, createTransaction);

module.exports = router;
