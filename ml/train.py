"""
AutoMorph AI - ML Model Training & Pipeline Export
Target: Acceleration (0-60 mph sprint time in seconds)
Dataset: auto-mpg.csv
"""

import json
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "auto-mpg.csv")
MODELS_DIR = os.path.join(BASE_DIR, "models")
EVAL_PATH = os.path.join(BASE_DIR, "evaluation_results.json")
BEST_MODEL_PATH = os.path.join(MODELS_DIR, "acceleration_model.joblib")


def load_and_engineer_features(filepath):
    """Loads cleaned dataset and performs domain feature engineering."""
    df = pd.read_csv(filepath)

    # Engineered physics features
    df["power_to_weight"] = df["horsepower"] / df["weight"]
    df["weight_per_hp"] = df["weight"] / df["horsepower"]
    df["displacement_per_cylinder"] = df["displacement"] / df["cylinders"]

    feature_cols = [
        "cylinders",
        "displacement",
        "horsepower",
        "weight",
        "model year",
        "origin",
        "power_to_weight",
        "weight_per_hp",
        "displacement_per_cylinder",
    ]
    target_col = "acceleration"

    X = df[feature_cols]
    y = df[target_col]

    return X, y, feature_cols


def train_and_evaluate():
    os.makedirs(MODELS_DIR, exist_ok=True)

    print(f"Loading data from: {DATA_PATH}")
    X, y, feature_cols = load_and_engineer_features(DATA_PATH)

    # 80/20 train-test split with fixed seed for reproducibility
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    models = {
        "Linear Regression": LinearRegression(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Decision Tree": DecisionTreeRegressor(max_depth=5, random_state=42),
        "Random Forest": RandomForestRegressor(
            n_estimators=100, max_depth=6, random_state=42
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42
        ),
    }

    eval_results = []
    best_r2 = -float("inf")
    best_pipeline = None
    best_model_name = ""

    print("\nTraining and evaluating models:")
    print("-" * 55)

    for name, model in models.items():
        pipeline = Pipeline([("scaler", StandardScaler()), ("regressor", model)])

        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        mae = float(mean_absolute_error(y_test, y_pred))
        rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
        r2 = float(r2_score(y_test, y_pred))

        metrics = {
            "model": name,
            "mae_seconds": round(mae, 4),
            "rmse_seconds": round(rmse, 4),
            "r2_score": round(r2, 4),
        }
        eval_results.append(metrics)

        print(
            f"{name:<20} | MAE: {mae:.4f}s | RMSE: {rmse:.4f}s | R²: {r2:.4f}"
        )

        if r2 > best_r2:
            best_r2 = r2
            best_pipeline = pipeline
            best_model_name = name

    # Save evaluation report JSON
    with open(EVAL_PATH, "w") as f:
        json.dump(
            {
                "target": "acceleration (0-60 mph in seconds)",
                "dataset": "auto-mpg.csv",
                "train_samples": len(X_train),
                "test_samples": len(X_test),
                "features": feature_cols,
                "best_model": best_model_name,
                "model_evaluations": eval_results,
            },
            f,
            indent=2,
        )
    print(f"\nEvaluation summary saved to: {EVAL_PATH}")

    # Save the best model pipeline using Joblib
    joblib.dump(best_pipeline, BEST_MODEL_PATH)
    print(
        f"Best model ({best_model_name}, R²={best_r2:.4f}) saved to: {BEST_MODEL_PATH}"
    )


if __name__ == "__main__":
    train_and_evaluate()
