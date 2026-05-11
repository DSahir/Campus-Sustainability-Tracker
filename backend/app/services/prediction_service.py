from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.ml.model_loader import ModelArtifactLoader, predict_resource_from_model
from backend.app.models import Building, ResourceReading, ResourceType
from backend.app.services.alert_service import create_alert


def _resolve_recent_readings(db: Session, building_id: int, resource_type: ResourceType) -> tuple[float, float]:
    """Fetch the two most recent readings for a building/resource and return lag1/lag24 values."""
    stmt = (
        select(ResourceReading)
        .where(ResourceReading.building_id == building_id)
        .where(ResourceReading.type == resource_type)
        .order_by(ResourceReading.ts.desc())
        .limit(2)
    )
    rows = db.execute(stmt).scalars().all()
    if not rows:
        return 0.0, 0.0
    if len(rows) == 1:
        return float(rows[0].value), float(rows[0].value)
    return float(rows[0].value), float(rows[1].value)


def forecast_building(
    db: Session,
    building_id: int,
    resource_type: ResourceType,
    horizon_days: int = 7,
    reference_hour: int | None = None,
    reference_dayofweek: int | None = None,
) -> dict[str, Any]:
    """Produce a short-term forecast series for a building and resource type."""
    building = db.get(Building, building_id)
    if building is None:
        raise ValueError(f"Building {building_id} not found")

    lag1, lag24 = _resolve_recent_readings(db, building_id, resource_type)
    now = datetime.utcnow()
    hour = reference_hour if reference_hour is not None else now.hour
    dayofweek = reference_dayofweek if reference_dayofweek is not None else now.weekday()

    model = ModelArtifactLoader.load_model(resource_type)
    forecast = []
    prev_value = lag1
    prev_day_value = lag24
    current_day = now

    for day_index in range(horizon_days):
        point_time = current_day + timedelta(days=day_index + 1)
        prediction = predict_resource_from_model(
            model=model,
            lag1=prev_value,
            lag24=prev_day_value,
            hour=hour,
            dayofweek=dayofweek,
        )
        interval = _build_confidence_interval(prediction)
        forecast.append(
            {
                "timestamp": point_time.isoformat() + "Z",
                "predicted_value": round(prediction, 2),
                "lower_bound": interval[0],
                "upper_bound": interval[1],
            }
        )
        prev_day_value = prev_value
        prev_value = prediction
        dayofweek = (dayofweek + 1) % 7

    return {
        "building_id": building_id,
        "building_name": building.name,
        "resource_type": resource_type.value,
        "horizon_days": horizon_days,
        "forecast": forecast,
    }


def _build_confidence_interval(prediction: float) -> tuple[float, float]:
    """Return a simple confidence interval around a predicted value."""
    margin = max(abs(prediction) * 0.12, 0.5)
    return (round(prediction - margin, 2), round(prediction + margin, 2))


def compute_prediction(
    db: Session,
    resource_type: ResourceType,
    lag1: float,
    lag24: float,
    hour: int,
    dayofweek: int,
    building_id: int | None = None,
) -> dict[str, Any]:
    """Compute a prediction and optionally record an alert if an anomaly is detected."""
    model = ModelArtifactLoader.load_model(resource_type)
    predicted_value = predict_resource_from_model(
        model=model,
        lag1=lag1,
        lag24=lag24,
        hour=hour,
        dayofweek=dayofweek,
    )
    anomaly = ModelArtifactLoader.detect_anomaly(
        current_value=predicted_value,
        historical_values=[lag1, lag24],
    )
    result = {
        "predicted_value": round(predicted_value, 2),
        "anomaly_detected": anomaly,
        "model_status": model.model_status,
        "resource_type": resource_type.value,
    }
    if resource_type == ResourceType.energy:
        result["predicted_energy_kwh"] = round(predicted_value, 2)

    if anomaly and building_id is not None:
        create_alert(
            db=db,
            building_id=building_id,
            metric=resource_type.value,
            severity="high",
            message=(
                f"Anomaly detected for {resource_type.value} at building {building_id}. "
                f"Predicted {predicted_value:.2f} differs from normal trend."
            ),
        )

    return result
