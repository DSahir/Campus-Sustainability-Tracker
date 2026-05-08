from fastapi import APIRouter
from backend.app.ml.model_loader import predict_energy

router = APIRouter(prefix="/predict")


@router.get("")
def predict_usage(
    lag1: float,
    lag24: float,
    hour: int,
    dayofweek: int
):
    prediction, anomaly = predict_energy(
        lag1=lag1,
        lag24=lag24,
        hour=hour,
        dayofweek=dayofweek
    )

    return {
        "predicted_energy_kwh": prediction,
        "anomaly_detected": anomaly,
        "model_status": "xgboost_live",
    }