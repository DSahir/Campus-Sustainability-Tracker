from fastapi import APIRouter

router = APIRouter(prefix="/recommendations")


@router.get("")
def list_recommendations() -> dict:
    return {
        "items": [
            "Shift HVAC schedules in Engineering Hall by 30 minutes during low-occupancy periods.",
            "Install low-flow fixtures in Science Center restrooms.",
            "Move library lab workloads to off-peak windows to reduce compute energy spikes.",
        ]
    }

