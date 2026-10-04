/**
 * Machine Learning Proxy Controller
 * Forwards prediction requests from React to Flask ML service (port 5001)
 * running the trained acceleration_model.joblib pipeline.
 */

const fs = require('fs');
const path = require('path');

const getFlaskUrl = () => process.env.ML_API_URL || process.env.ML_SERVICE_URL || 'http://localhost:5001';

/**
 * @route   POST /api/predict
 * @desc    Validate input, forward to Flask ML API, and return model prediction
 * @access  Public
 */
const predictAcceleration = async (req, res, next) => {
  try {
    const { cylinders, displacement, horsepower, weight, model_year, origin } = req.body;

    // 1. Validate required fields
    if (
      cylinders === undefined ||
      displacement === undefined ||
      horsepower === undefined ||
      weight === undefined
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required vehicle specifications: cylinders, displacement, horsepower, and weight are required.',
      });
    }

    // 2. Validate numeric types
    const numCylinders = Number(cylinders);
    const numDisplacement = Number(displacement);
    const numHorsepower = Number(horsepower);
    const numWeight = Number(weight);
    const numModelYear = model_year !== undefined ? Number(model_year) : 82;
    const numOrigin = origin !== undefined ? Number(origin) : 2;

    if (
      isNaN(numCylinders) ||
      isNaN(numDisplacement) ||
      isNaN(numHorsepower) ||
      isNaN(numWeight) ||
      isNaN(numModelYear) ||
      isNaN(numOrigin)
    ) {
      return res.status(422).json({
        status: 'error',
        message: 'Invalid input: vehicle specifications must be valid numeric values.',
      });
    }

    // 3. Validate positive non-zero physical ranges
    if (numCylinders <= 0 || numDisplacement <= 0 || numHorsepower <= 0 || numWeight <= 0) {
      return res.status(422).json({
        status: 'error',
        message: 'Specifications (horsepower, weight, displacement, cylinders) must be greater than zero.',
      });
    }

    const flaskPayload = {
      cylinders: numCylinders,
      displacement: numDisplacement,
      horsepower: numHorsepower,
      weight: numWeight,
      model_year: numModelYear,
      origin: numOrigin,
    };

    const flaskBaseUrl = getFlaskUrl();

    // 4. Forward to Flask ML REST API
    try {
      const flaskResponse = await fetch(`${flaskBaseUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flaskPayload),
      });

      const data = await flaskResponse.json();

      if (!flaskResponse.ok || data.status !== 'success') {
        return res.status(flaskResponse.status || 500).json({
          status: 'error',
          message: data.message || 'Flask ML service returned an error during model inference.',
        });
      }

      return res.json({
        status: 'success',
        source: 'Flask ML API (Gradient Boosting Joblib Model)',
        prediction: data.prediction,
        input_specs: data.input_specs,
      });
    } catch (flaskErr) {
      return res.status(503).json({
        status: 'error',
        message: `Flask ML API service is currently unavailable at ${flaskBaseUrl}. Please ensure ml/app.py is running.`,
        error_code: 'FLASK_SERVICE_UNAVAILABLE',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/ml/metrics
 * @desc    Retrieve trained model evaluation results from evaluation_results.json
 * @access  Public
 */
const getModelMetrics = async (req, res, next) => {
  try {
    const metricsPath = path.join(__dirname, '..', '..', '..', 'ml', 'evaluation_results.json');
    if (fs.existsSync(metricsPath)) {
      const raw = fs.readFileSync(metricsPath, 'utf8');
      const metrics = JSON.parse(raw);
      return res.json({ status: 'success', data: metrics });
    }

    return res.status(404).json({
      status: 'error',
      message: 'Evaluation results file not found.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { predictAcceleration, getModelMetrics };
