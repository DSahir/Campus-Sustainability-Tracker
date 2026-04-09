from fastapi import APIRouter

router = APIRouter(prefix="/alerts")


@router.get("")
def list_alerts() -> dict:
    return {
        "items": [
            {
                "id": "ALT-1001",
                "building": "Science Center",
                "severity": "high",
                "metric": "water",
                "message": "Water usage exceeded the configured threshold.",
            },
            {
                "id": "ALT-1002",
                "building": "Engineering Hall",
                "severity": "medium",
                "metric": "energy",
                "message": "Energy demand is trending upward compared to last week.",
            },
        ]
    }

