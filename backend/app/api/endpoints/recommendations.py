from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.services.recommendation_service import list_recommendations

router = APIRouter(prefix="/recommendations")


@router.get("")
def list_recommendations_endpoint(
    building_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> dict:
    return list_recommendations(db=db, building_id=building_id)
