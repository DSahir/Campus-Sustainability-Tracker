import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_alerts_list_empty():
    response = client.get("/api/v1/alerts")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)


def test_alerts_list_by_building():
    response = client.get("/api/v1/alerts?building_id=101")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)
