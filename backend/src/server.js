/**
 * AutoMorph AI - Express REST API Server
 * Main application entry point providing health checks, vehicle catalogue,
 * user authentication, and garage build endpoints.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedCarsIfEmpty } = require('./controllers/carController');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const buildRoutes = require('./routes/buildRoutes');
const mlRoutes = require('./routes/mlRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB and seed catalog if empty
connectDB().then((conn) => {
  if (conn) {
    seedCarsIfEmpty();
  }
});

// Core Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @route   GET /api/health
 * @desc    Health check endpoint for monitoring system status
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AutoMorph AI Backend API Service',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/cars',
      '/api/builds',
      '/api/predict',
      '/api/ml/metrics',
    ],
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/builds', buildRoutes);
app.use('/api', mlRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`[AutoMorph Backend] Server listening on http://localhost:${PORT}`);
  console.log(`[AutoMorph Backend] Health Endpoint: http://localhost:${PORT}/api/health`);
});

module.exports = app;
