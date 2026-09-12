const express = require('express');
const router = express.Router();
const { protectOrEmail } = require('../middleware/authMiddleware');
const {
  checkPinRequirement,
  requestExport,
  getHistory,
  downloadExport,
} = require('../controllers/PortabilityController');

// All portability endpoints require user authentication (Bearer token or email fallback)
router.get('/check-pin', protectOrEmail, checkPinRequirement);
router.post('/export', protectOrEmail, requestExport);
router.get('/history', protectOrEmail, getHistory);
router.get('/download/:id', protectOrEmail, downloadExport);

module.exports = router;
