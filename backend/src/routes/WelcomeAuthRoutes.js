const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin, setupPin, uploadProfilePicture } = require('../controllers/WelcomeAuthController');

// Welcome Page Auth Routes
router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.post('/setup-pin', setupPin);
router.put('/profile-picture', uploadProfilePicture);

module.exports = router;
