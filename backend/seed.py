from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Building, ResourceReading, ResourceType
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
    # UMass Amherst (real)
    {"name": "W.E.B. Du Bois Library", "location": "UMass Amherst"},
    {"name": "Integrated Learning Center (ILC)", "location": "UMass Amherst"},
    {"name": "Lederle Graduate Research Center", "location": "UMass Amherst"},

    # Amherst College (semi-realistic)
    {"name": "Science Center", "location": "Amherst College"},

    # Hampshire College (semi-realistic)
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
                ts=datetime.now() - timedelta(days=day)
            )
            session.add(reading)

session.commit()

print("Seed data inserted successfully!")