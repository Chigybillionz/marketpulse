const express = require('express');
const router = express.Router();
const { getDebtors, getDebtorById, addCreditTransaction, logRepayment, resolveCredit, logReminder } = require('../controllers/DebtorController');

router.get('/', getDebtors);
router.get('/:id', getDebtorById);
router.post('/credit', addCreditTransaction);
router.post('/:id/repay', logRepayment);
router.post('/:id/resolve', resolveCredit);
router.post('/:id/remind', logReminder);

module.exports = router;
