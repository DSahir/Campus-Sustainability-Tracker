from fastapi import APIRouter, Query

router = APIRouter(prefix="/alerts")


@router.get("")
def list_alerts(building_id: int | None = Query(default=None)):
    alerts = [
        {
            "id": 1,
            "severity": "critical",
            "message": "Engineering building exceeded energy threshold."
        },
        {
            "id": 2,
            "severity": "warning",
            "message": "Science Hall water usage increased by 12%."
        }
    ]

    if building_id is not None:
        return {"items": alerts[:1]}

    return {"items": alerts}