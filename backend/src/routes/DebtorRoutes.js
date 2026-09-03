const express = require('express');
const router = express.Router();
const { getDebtors, getDebtorById, addCreditTransaction, logRepayment } = require('../controllers/DebtorController');

router.get('/', getDebtors);
router.get('/:id', getDebtorById);
router.post('/credit', addCreditTransaction);
router.post('/:id/repay', logRepayment);

module.exports = router;
