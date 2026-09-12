const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // We attach the user ID to the request object so subsequent controllers can use it
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const protectOrEmail = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    } catch (error) {
      console.error('JWT verification error:', error);
    }
  }

  // Fallback to user identification via email in query, headers, or body
  const email = req.query?.email || req.body?.email || req.headers['x-user-email'];
  if (email) {
    try {
      const WelcomeUser = require('../models/WelcomeUser');
      const user = await WelcomeUser.findOne({ email: String(email).trim().toLowerCase() });
      if (user) {
        req.user = { id: user._id };
        return next();
      }
    } catch (dbErr) {
      console.error('Error finding user by email:', dbErr);
    }
  }

  return res.status(401).json({ message: 'Not authorized, please log in' });
};

module.exports = { protect, protectOrEmail };
