from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.core.database import get_db
from backend.app.models import ResourceReading, ResourceType

router = APIRouter(prefix="/analytics")


@router.get("/trends")
def get_trends(db: Session = Depends(get_db)):
    rows = (
        db.query(
            func.date(ResourceReading.ts).label("day"),
            ResourceReading.type,
            func.sum(ResourceReading.value).label("total")
        )
        .group_by(func.date(ResourceReading.ts), ResourceReading.type)
        .order_by(func.date(ResourceReading.ts))
        .limit(30)
        .all()
    )

    grouped = {}

    for row in rows:
        day = str(row.day)
        resource = row.type.value

        if day not in grouped:
            grouped[day] = {
                "day": day,
                "actualEnergy": 0,
                "water": 0,
                "co2": 0
            }

        if resource == "energy":
            grouped[day]["actualEnergy"] = float(row.total)
        elif resource == "water":
            grouped[day]["water"] = float(row.total)
        elif resource == "co2":
            grouped[day]["co2"] = float(row.total)

    return list(grouped.values())


@router.get("/buildings")
def building_usage(db: Session = Depends(get_db)):
    rows = (
        db.query(
            ResourceReading.building_id,
            ResourceReading.type,
            func.sum(ResourceReading.value).label("total")
        )
        .group_by(ResourceReading.building_id, ResourceReading.type)
        .all()
    )

    grouped = {}

    for row in rows:
        bid = row.building_id

        if bid not in grouped:
            grouped[bid] = {
                "building": f"Building {bid}",
                "energy": 0,
                "water": 0,
                "co2": 0
            }

        if row.type == ResourceType.energy:
            grouped[bid]["energy"] = float(row.total)
        elif row.type == ResourceType.water:
            grouped[bid]["water"] = float(row.total)
        elif row.type == ResourceType.co2:
            grouped[bid]["co2"] = float(row.total)

    return list(grouped.values())


@router.get("/waste")
def waste_breakdown(db: Session = Depends(get_db)):
    waste_total = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.waste)
        .scalar()
    ) or 0

    return [{"name": "Waste", "value": float(waste_total)}]


@router.get("/recommendations")
def recommendations(db: Session = Depends(get_db)):
    total_energy = (
        db.query(func.sum(ResourceReading.value))
        .filter(ResourceReading.type == ResourceType.energy)
        .scalar()
    ) or 0

    recs = []

    if total_energy > 10000:
        recs.append({
            "id": 1,
            "title": "Optimize HVAC schedules",
            "description": "High energy usage detected. Reduce HVAC runtime during low occupancy periods.",
            "category": "energy",
            "impact": "high"
        })

    if total_energy > 20000:
        recs.append({
            "id": 2,
            "title": "Investigate after-hours power usage",
            "description": "Potential unnecessary overnight electricity consumption detected.",
            "category": "energy",
            "impact": "medium"
        })

    return recs