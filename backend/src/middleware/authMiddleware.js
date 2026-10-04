/**
 * Authentication Middleware
 * Validates JWT Bearer tokens in Request Headers for protected routes.
 */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { inMemoryUsers } = require('../controllers/authController');

const findUserById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const u = await User.findById(id).select('-password');
      if (u) return u;
    } catch (e) {
      // Ignore
    }
  }
  return inMemoryUsers.find((u) => u._id === id || u.id === id) || null;
};

/**
 * Strict Route Protection Middleware
 * Requires a valid JWT token in Authorization header. Returns 401 if missing/invalid.
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'automorph_super_secret_jwt_key_2026');

      req.user = await findUserById(decoded.id);
      if (!req.user) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: User account no longer exists',
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid or expired JWT token',
      });
    }
  }

  return res.status(401).json({
    status: 'error',
    message: 'Unauthorized: No token provided in Authorization header',
  });
};

/**
 * Optional Authentication Middleware
 * Attaches req.user if valid JWT is present, but continues as guest if token is missing.
 */
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'automorph_super_secret_jwt_key_2026');
      req.user = await findUserById(decoded.id);
    } catch (e) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { protect, optionalAuth };
