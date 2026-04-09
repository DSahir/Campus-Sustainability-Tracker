from fastapi import APIRouter

router = APIRouter(prefix="/metrics")


@router.get("/summary")
def summary() -> dict:
    return {
        "campus": "North Campus",
        "generated_at": "2026-04-09T09:00:00Z",
        "energy_kwh": 18250,
        "water_gallons": 96500,
        "waste_kg": 2140,
        "co2_tons": 15.8,
        "trend": "improving",
    }

