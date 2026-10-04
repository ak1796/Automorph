"""
AutoMorph AI - Flask API Unit & Integration Tests
Tests /health and /predict with valid and invalid payloads.
"""

import json
import sys
import unittest
from app import app


class TestFlaskMLAPI(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "ok")
        self.assertTrue(data["model_loaded"])

    def test_valid_prediction(self):
        payload = {
            "cylinders": 6,
            "displacement": 200,
            "horsepower": 150,
            "weight": 2800,
            "model_year": 78,
            "origin": 1,
        }
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("0_to_60_mph_sec", data["prediction"])
        self.assertGreater(data["prediction"]["0_to_60_mph_sec"], 0)
        print(
            f"\n[Test Valid Payload] 150 HP / 2800 lbs -> Predicted 0-60 mph: {data['prediction']['0_to_60_mph_sec']}s"
        )

    def test_high_performance_vehicle_prediction(self):
        # BMW M3 / High HP Spec
        payload = {
            "cylinders": 6,
            "displacement": 183,
            "horsepower": 473,
            "weight": 3830,
            "model_year": 82,
            "origin": 1,
        }
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        print(
            f"[Test High HP Payload] 473 HP / 3830 lbs -> Predicted 0-60 mph: {data['prediction']['0_to_60_mph_sec']}s"
        )

    def test_missing_fields_payload(self):
        payload = {"horsepower": 150, "weight": 2800}
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertEqual(data["status"], "error")
        self.assertIn("Missing required vehicle specification fields", data["message"])

    def test_invalid_negative_values_payload(self):
        payload = {
            "cylinders": 6,
            "displacement": -100,
            "horsepower": 150,
            "weight": 2800,
        }
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 422)
        data = response.get_json()
        self.assertEqual(data["status"], "error")

    def test_invalid_non_numeric_payload(self):
        payload = {
            "cylinders": "six",
            "displacement": 200,
            "horsepower": 150,
            "weight": 2800,
        }
        response = self.client.post(
            "/predict",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 422)
        data = response.get_json()
        self.assertEqual(data["status"], "error")


if __name__ == "__main__":
    unittest.main()
