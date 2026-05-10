from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.alert_service import get_alerts, get_alerts_for_building

router = APIRouter(prefix="/alerts")


@router.get("")
def list_alerts(
    building_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict:
    if building_id is not None:
        items = get_alerts_for_building(db, building_id)
    else:
        items = get_alerts(db)
    return {"items": items}

