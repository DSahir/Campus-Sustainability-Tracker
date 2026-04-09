from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base, User, Building, ResourceReading, ResourceType
from datetime import datetime

engine = create_engine("sqlite:///:memory:")
Session = sessionmaker(bind=engine)

Base.metadata.create_all(engine)

def test_insert_user():
    session = Session()
    user = User(username="test", password="123", role="admin")
    session.add(user)
    session.commit()

    result = session.query(User).first()
    assert result.username == "test"

def test_resource_reading_timestamp():
    session = Session()
    building = Building(name="Test", location="Test")
    session.add(building)
    session.commit()

    reading = ResourceReading(
        building_id=building.id,
        type=ResourceType.energy,
        value=50,
        ts=datetime.now()
    )
    session.add(reading)
    session.commit()

    result = session.query(ResourceReading).first()
    assert result.ts is not None