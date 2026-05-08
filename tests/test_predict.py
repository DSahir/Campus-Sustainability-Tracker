from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_predict_endpoint():
    response = client.get(
        "/api/v1/predict?lag1=336.44&lag24=320.10&hour=12&dayofweek=2"
    )

    assert response.status_code == 200

    data = response.json()

    assert "predicted_energy_kwh" in data
    assert "anomaly_detected" in data
    assert data["model_status"] == "xgboost_live"