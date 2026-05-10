from datetime import datetime
import enum

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class ResourceType(enum.Enum):
    energy = "energy"
    water = "water"
    waste = "waste"
    co2 = "co2"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)


class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)

    resource_readings = relationship("ResourceReading", back_populates="building")
    recommendations = relationship("Recommendation", back_populates="building")
    alerts = relationship("Alert", back_populates="building")


class ResourceReading(Base):
    __tablename__ = "resource_readings"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"))
    type = Column(Enum(ResourceType), nullable=False)
    value = Column(Float)
    ts = Column(DateTime, default=datetime.utcnow)

    building = relationship("Building", back_populates="resource_readings")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    metric = Column(String)
    severity = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    building = relationship("Building", back_populates="alerts")


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    file_path = Column(String)
    campus = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=True)
    suggestion = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    building = relationship("Building", back_populates="recommendations")


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True, nullable=False)
    value = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
