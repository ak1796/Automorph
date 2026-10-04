/**
 * Machine Learning API Routes
 * Mounted at /api
 */

const express = require('express');
const router = express.Router();
const { predictAcceleration, getModelMetrics } = require('../controllers/mlController');

router.post('/predict', predictAcceleration);
router.get('/ml/metrics', getModelMetrics);

module.exports = router;
