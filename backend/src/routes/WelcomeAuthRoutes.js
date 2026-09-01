const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);

module.exports = router;
