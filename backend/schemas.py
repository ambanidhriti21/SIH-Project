from pydantic import BaseModel, EmailStr, Field
from typing import List

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class PredictionResponse(BaseModel):
    id: int
    class_id: str
    plant: str
    disease: str
    status: str
    severity: str
    confidence_percentage: float
    symptoms: List[str]
    organic_cure: str
    chemical_cure: str
    prevention: List[str]
    created_at: str
