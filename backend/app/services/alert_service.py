from datetime import datetime
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models import Alert


def create_alert(
    db: Session,
    building_id: int | None,
    metric: str,
    severity: str,
    message: str,
) -> Alert:
    """Persist an alert row into the database."""
    alert = Alert(
        building_id=building_id,
        metric=metric,
        severity=severity,
        message=message,
        created_at=datetime.utcnow(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def get_alerts(db: Session) -> list[dict[str, str]]:
    """Return all alert rows as dictionaries for API serialization."""
    stmt = select(Alert).order_by(Alert.created_at.desc())
    alerts = db.execute(stmt).scalars().all()
    return [
        {
            "id": alert.id,
            "building_id": alert.building_id,
            "metric": alert.metric,
            "severity": alert.severity,
            "message": alert.message,
            "created_at": alert.created_at.isoformat() + "Z",
        }
        for alert in alerts
    ]


def get_alerts_for_building(db: Session, building_id: int) -> list[dict[str, str]]:
    """Return alerts filtered by building."""
    stmt = select(Alert).where(Alert.building_id == building_id).order_by(Alert.created_at.desc())
    alerts = db.execute(stmt).scalars().all()
    return [
        {
            "id": alert.id,
            "building_id": alert.building_id,
            "metric": alert.metric,
            "severity": alert.severity,
            "message": alert.message,
            "created_at": alert.created_at.isoformat() + "Z",
        }
        for alert in alerts
    ]
