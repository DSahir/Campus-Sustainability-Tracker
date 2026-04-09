from fastapi import APIRouter

router = APIRouter(prefix="/predict")


@router.get("")
def predict_usage() -> dict:
    return {
        "campus": "North Campus",
        "forecast_window_days": 7,
        "predictions": {
            "energy_kwh": 19420,
            "water_gallons": 101300,
            "waste_kg": 2280,
            "co2_tons": 16.9,
        },
        "model_status": "stubbed",
    }

