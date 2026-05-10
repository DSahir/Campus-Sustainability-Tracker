import pytest
from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_recommendations_list():
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0


def test_recommendations_list_by_building():
    response = client.get("/api/v1/recommendations?building_id=101")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert isinstance(data["items"], list)
