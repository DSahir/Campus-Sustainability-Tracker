from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_metrics_summary_returns_http_200() -> None:
    response = client.get("/api/v1/metrics/summary")
    assert response.status_code == 200


def test_metrics_summary_response_shape() -> None:
    response = client.get("/api/v1/metrics/summary")
    payload = response.json()

    assert isinstance(payload, dict)
    assert {"campus", "generated_at", "energy_kwh", "water_gallons", "waste_kg", "co2_tons", "trend"} <= payload.keys()

