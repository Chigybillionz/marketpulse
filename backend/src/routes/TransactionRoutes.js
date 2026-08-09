const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction } = require('../controllers/TransactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTransactions).post(protect, createTransaction);

module.exports = router;
