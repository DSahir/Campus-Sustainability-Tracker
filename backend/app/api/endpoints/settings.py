from fastapi import APIRouter

router = APIRouter(prefix="/settings")


@router.get("/thresholds")
def get_thresholds() -> dict:
    return {
        "energy_kwh": 6000,
        "water_gallons": 25000,
        "waste_kg": 500,
        "co2_tons": 6.0,
    }

