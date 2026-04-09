from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_buildings_returns_http_200() -> None:
    response = client.get("/api/v1/buildings")
    assert response.status_code == 200


def test_buildings_response_shape() -> None:
    response = client.get("/api/v1/buildings")
    payload = response.json()

    assert isinstance(payload, dict)
    assert "items" in payload
    assert isinstance(payload["items"], list)
    assert len(payload["items"]) > 0
    assert {"id", "name", "energy_kwh", "water_gallons", "waste_kg"} <= payload["items"][0].keys()
