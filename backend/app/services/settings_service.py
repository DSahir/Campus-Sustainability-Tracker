from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models import Setting

DEFAULT_THRESHOLDS: dict[str, float] = {
    "energy_kwh": 6000.0,
    "water_gallons": 25000.0,
    "waste_kg": 500.0,
    "co2_tons": 6.0,
}


def get_thresholds(db: Session) -> dict[str, float]:
    """Return configured thresholds, falling back to defaults when no persisted values exist."""
    stmt = select(Setting)
    rows = db.execute(stmt).scalars().all()
    if not rows:
        return DEFAULT_THRESHOLDS.copy()

    thresholds: dict[str, float] = {}
    for setting in rows:
        try:
            thresholds[setting.key] = float(setting.value)
        except ValueError:
            continue

    for key, default_value in DEFAULT_THRESHOLDS.items():
        thresholds.setdefault(key, default_value)

    return thresholds


def update_thresholds(db: Session, values: dict[str, float]) -> dict[str, float]:
    """Persist threshold values and return the updated threshold map."""
    for key, value in values.items():
        setting = db.execute(select(Setting).where(Setting.key == key)).scalar_one_or_none()
        if setting:
            setting.value = str(value)
        else:
            setting = Setting(key=key, value=str(value))
            db.add(setting)
    db.commit()
    return get_thresholds(db)
