from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()

# Enum for resource type
class ResourceType(enum.Enum):
    energy = "energy"
    water = "water"
    waste = "waste"
    co2 = "co2"

# Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

# Buildings Table
class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)

# Resource Readings Table
class ResourceReading(Base):
    __tablename__ = "resource_readings"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    type = Column(Enum(ResourceType))
    value = Column(Float)
    timestamp = Column(DateTime)

    building = relationship("Building")

# Alerts Table
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    message = Column(String)
    created_at = Column(DateTime)

# Reports Table
class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    generated_by = Column(Integer, ForeignKey("users.id"))
    file_path = Column(String)

# Recommendations Table
class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    suggestion = Column(String)