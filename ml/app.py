"""
AutoMorph AI - Flask ML REST API
Exposes /health and /predict endpoints for 0-60 mph acceleration predictions.
"""

import os
import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "acceleration_model.joblib")

# Load model pipeline on startup
model_pipeline = None
if os.path.exists(MODEL_PATH):
    try:
        model_pipeline = joblib.load(MODEL_PATH)
        print(f"ML Model successfully loaded from: {MODEL_PATH}")
    except Exception as e:
        print(f"Error loading ML model: {e}")
else:
    print(f"Warning: Model file not found at {MODEL_PATH}. Run train.py first.")


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify(
        {
            "status": "ok",
            "service": "AutoMorph AI ML Service",
            "model_loaded": model_pipeline is not None,
        }
    ), 200


@app.route("/predict", methods=["POST"])
def predict():
    if model_pipeline is None:
        return jsonify(
            {
                "status": "error",
                "message": "Model not loaded. Please train the model first.",
            }
        ), 500

    data = request.get_json(silent=True)
    if not data:
        return jsonify(
            {
                "status": "error",
                "message": "Invalid or missing JSON payload in request body.",
            }
        ), 400

    required_fields = ["cylinders", "displacement", "horsepower", "weight"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify(
            {
                "status": "error",
                "message": f"Missing required vehicle specification fields: {missing}",
            }
        ), 400

    try:
        cylinders = float(data["cylinders"])
        displacement = float(data["displacement"])
        horsepower = float(data["horsepower"])
        weight = float(data["weight"])

        # Optional features with sensible defaults
        model_year = float(data.get("model_year", data.get("model year", 80)))
        origin = float(data.get("origin", 1))

        # Validate numeric ranges
        if horsepower <= 0 or weight <= 0 or displacement <= 0 or cylinders <= 0:
            return jsonify(
                {
                    "status": "error",
                    "message": "Specifications (horsepower, weight, displacement, cylinders) must be greater than zero.",
                }
            ), 422

    except (ValueError, TypeError):
        return jsonify(
            {
                "status": "error",
                "message": "Invalid numeric data type provided for specs.",
            }
        ), 422

    # Calculate engineered features dynamically
    power_to_weight = horsepower / weight
    weight_per_hp = weight / horsepower
    displacement_per_cylinder = displacement / cylinders

    features_df = pd.DataFrame(
        [
            {
                "cylinders": cylinders,
                "displacement": displacement,
                "horsepower": horsepower,
                "weight": weight,
                "model year": model_year,
                "origin": origin,
                "power_to_weight": power_to_weight,
                "weight_per_hp": weight_per_hp,
                "displacement_per_cylinder": displacement_per_cylinder,
            }
        ]
    )

    try:
        prediction = model_pipeline.predict(features_df)[0]
        # Round prediction to 2 decimal places
        predicted_accel = round(float(prediction), 2)

        return jsonify(
            {
                "status": "success",
                "prediction": {
                    "0_to_60_mph_sec": max(2.0, predicted_accel),
                    "unit": "seconds",
                },
                "input_specs": {
                    "cylinders": cylinders,
                    "displacement_ci": displacement,
                    "horsepower": horsepower,
                    "weight_lbs": weight,
                    "power_to_weight_ratio": round(power_to_weight, 4),
                },
            }
        ), 200

    except Exception as e:
        return jsonify(
            {"status": "error", "message": f"Inference error: {str(e)}"}
        ), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
