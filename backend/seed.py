from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.models import User, Building, ResourceReading, ResourceType, Recommendation, Setting
from datetime import datetime, timedelta
import random

DATABASE_URL = "postgresql://user:password@db:5432/sustainability"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

session = SessionLocal()

# -------- USERS --------
users = [
    User(username="admin", password="admin123", role="admin"),
    User(username="manager", password="manager123", role="facility_manager"),
    User(username="student", password="student123", role="student"),
]

session.add_all(users)

# -------- BUILDINGS --------
building_data = [
    {"name": "W.E.B. Du Bois Library", "location": "UMass Amherst"},
    {"name": "Integrated Learning Center (ILC)", "location": "UMass Amherst"},
    {"name": "Lederle Graduate Research Center", "location": "UMass Amherst"},
    {"name": "Science Center", "location": "Amherst College"},
    {"name": "Franklin Patterson Hall", "location": "Hampshire College"},
]

buildings = []
for b in building_data:
    building = Building(name=b["name"], location=b["location"])
    session.add(building)
    buildings.append(building)

session.commit()

# -------- RESOURCE READINGS --------
for building in buildings:
    for day in range(30):
        for resource in ResourceType:
            reading = ResourceReading(
                building_id=building.id,
                type=resource,
                value=random.uniform(10, 100),
                ts=datetime.now() - timedelta(days=day),
            )
            session.add(reading)

session.commit()

# -------- RECOMMENDATIONS --------
recommendation_items = [
    (buildings[0].id, "Shift HVAC schedules in Engineering Hall by 30 minutes during low-occupancy periods."),
    (buildings[1].id, "Install low-flow fixtures in Science Center restrooms."),
    (buildings[2].id, "Move library lab workloads to off-peak windows to reduce compute energy spikes."),
]
for building_id, suggestion in recommendation_items:
    session.add(Recommendation(building_id=building_id, suggestion=suggestion))

session.commit()

# -------- SETTINGS --------
thresholds = {
    "energy_kwh": 6000,
    "water_gallons": 25000,
    "waste_kg": 500,
    "co2_tons": 6.0,
}
for key, value in thresholds.items():
    session.add(Setting(key=key, value=str(value)))

session.commit()

print("Seed data inserted successfully!")
