from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models import Recommendation, Building


def list_recommendations(db: Session, building_id: int | None = None) -> dict[str, Any]:
    """Return stored recommendations or a small default set when none are available."""
    stmt = select(Recommendation)
    if building_id is not None:
        stmt = stmt.where(Recommendation.building_id == building_id)

    recommendations = db.execute(stmt).scalars().all()
    if recommendations:
        return {
            "items": [
                {
                    "id": rec.id,
                    "building_id": rec.building_id,
                    "building_name": rec.building.name if rec.building else None,
                    "suggestion": rec.suggestion,
                }
                for rec in recommendations
            ]
        }

    items = [
        {
            "id": None,
            "building_id": building_id,
            "building_name": None,
            "suggestion": "Use evening setback schedules and LED retrofits to reduce peak energy load.",
        },
        {
            "id": None,
            "building_id": building_id,
            "building_name": None,
            "suggestion": "Improve chilled water loop insulation to reduce cooling energy waste.",
        },
        {
            "id": None,
            "building_id": building_id,
            "building_name": None,
            "suggestion": "Optimize building controls based on occupancy and weather forecasts.",
        },
    ]
    return {"items": items}
