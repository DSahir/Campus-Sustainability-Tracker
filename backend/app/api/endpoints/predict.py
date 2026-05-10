from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models import ResourceType
from backend.app.services.prediction_service import compute_prediction, forecast_building

router = APIRouter(prefix="/predict")


def _parse_horizon(horizon: str) -> int:
    if horizon.endswith("d") and horizon[:-1].isdigit():
        return int(horizon[:-1])
    raise HTTPException(status_code=400, detail="horizon must be a number followed by 'd', e.g. 7d")


@router.get("")
def predict_usage(
    lag1: float = Query(..., description="Most recent reading"),
    lag24: float = Query(..., description="Reading from the same hour one day ago"),
    hour: int = Query(..., ge=0, le=23),
    dayofweek: int = Query(..., ge=0, le=6),
    resource_type: ResourceType = Query(default=ResourceType.energy),
    building_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return compute_prediction(
        db=db,
        resource_type=resource_type,
        lag1=lag1,
        lag24=lag24,
        hour=hour,
        dayofweek=dayofweek,
        building_id=building_id,
    )


@router.get("/{building_id}")
def predict_building_horizon(
    building_id: int,
    horizon: str = Query(default="7d"),
    resource_type: ResourceType = Query(default=ResourceType.energy),
    hour: int | None = Query(default=None, ge=0, le=23),
    dayofweek: int | None = Query(default=None, ge=0, le=6),
    db: Session = Depends(get_db),
):
    horizon_days = _parse_horizon(horizon)
    try:
        return forecast_building(
            db=db,
            building_id=building_id,
            resource_type=resource_type,
            horizon_days=horizon_days,
            reference_hour=hour,
            reference_dayofweek=dayofweek,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
