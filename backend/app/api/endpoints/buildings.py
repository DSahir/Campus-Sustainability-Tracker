from fastapi import APIRouter

router = APIRouter(prefix="/buildings")


@router.get("")
def list_buildings() -> dict:
    return {
        "items": [
            {
                "id": 101,
                "name": "Engineering Hall",
                "energy_kwh": 5400,
                "water_gallons": 22000,
                "waste_kg": 430,
            },
            {
                "id": 102,
                "name": "Science Center",
                "energy_kwh": 6100,
                "water_gallons": 27500,
                "waste_kg": 510,
            },
            {
                "id": 103,
                "name": "Library",
                "energy_kwh": 3900,
                "water_gallons": 16000,
                "waste_kg": 260,
            },
        ]
    }

