from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    predictions = relationship('PredictionHistory', back_populates='user', cascade='all, delete-orphan')

class DiseaseInfo(Base):
    __tablename__ = 'disease_information'
    id = Column(Integer, primary_key=True)
    class_id = Column(String(255), unique=True, index=True, nullable=False)
    plant = Column(String(120), nullable=False)
    disease = Column(String(160), nullable=False)
    status = Column(String(50), nullable=False)
    severity = Column(String(80), nullable=False)
    symptoms = Column(Text, nullable=False, default='[]')
    organic_cure = Column(Text, nullable=False)
    chemical_cure = Column(Text, nullable=False)
    prevention = Column(Text, nullable=False, default='[]')

class PredictionHistory(Base):
    __tablename__ = 'prediction_history'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    class_id = Column(String(255), nullable=False)
    plant = Column(String(120), nullable=False)
    disease = Column(String(160), nullable=False)
    status = Column(String(50), nullable=False)
    severity = Column(String(80), nullable=False)
    confidence = Column(Float, nullable=False)
    image_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    user = relationship('User', back_populates='predictions')
