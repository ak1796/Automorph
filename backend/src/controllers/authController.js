/**
 * Authentication Controller
 * Handles user registration, login, bcrypt password hashing, JWT token generation,
 * and protected profile retrieval. Supports MongoDB and fallback in-memory user store.
 */

const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory fallback user store when MongoDB is offline
const inMemoryUsers = [];

// Helper to check if MongoDB is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'automorph_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account with bcrypt password hashing
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is actively connected
    if (isDbConnected()) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ status: 'error', message: 'A user with this email address already exists.' });
        }

        const user = await User.create({
          name,
          email: cleanEmail,
          password,
        });

        return res.status(201).json({
          status: 'success',
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
          },
        });
      } catch (dbErr) {
        // Fall through to memory store if query fails
      }
    }

    // 2. In-memory fallback store
    const duplicate = inMemoryUsers.find((u) => u.email === cleanEmail);
    if (duplicate) {
      return res.status(400).json({ status: 'error', message: 'A user with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mockUser = {
      _id: `user-${Date.now()}`,
      name,
      email: cleanEmail,
      password: hashedPassword,
    };
    inMemoryUsers.push(mockUser);

    return res.status(201).json({
      status: 'success',
      data: {
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: generateToken(mockUser._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & compare bcrypt password hash
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Please provide email and password.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. If MongoDB is actively connected
    if (isDbConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password');

        if (user) {
          const isMatch = await user.matchPassword(password);
          if (isMatch) {
            return res.json({
              status: 'success',
              data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
              },
            });
          }
          return res.status(401).json({ status: 'error', message: 'Invalid email address or password.' });
        }
      } catch (dbErr) {
        // Fall through
      }
    }

    // 2. Check in-memory store
    const memUser = inMemoryUsers.find((u) => u.email === cleanEmail);
    if (memUser) {
      const isMatch = await bcrypt.compare(password, memUser.password);
      if (isMatch) {
        return res.json({
          status: 'success',
          data: {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            token: generateToken(memUser._id),
          },
        });
      }
      return res.status(401).json({ status: 'error', message: 'Invalid email address or password.' });
    }

    return res.status(401).json({ status: 'error', message: 'Invalid email address or password.' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile
 * @access  Private (Protected via JWT)
 */
const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized: User not found.' });
    }

    res.json({
      status: 'success',
      data: {
        _id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, inMemoryUsers };
