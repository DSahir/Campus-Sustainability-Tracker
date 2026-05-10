from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.settings_service import get_thresholds, update_thresholds

router = APIRouter(prefix="/settings")


class ThresholdsPayload(BaseModel):
    energy_kwh: float
    water_gallons: float
    waste_kg: float
    co2_tons: float


@router.get("/thresholds")
def read_thresholds(db: Session = Depends(get_db)) -> dict:
    return get_thresholds(db)


@router.put("/thresholds")
def save_thresholds(payload: ThresholdsPayload, db: Session = Depends(get_db)) -> dict:
    return update_thresholds(db, payload.dict())
