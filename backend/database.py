import os
from datetime import datetime
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine, Field, Model, Reference

# Database Configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "ironlog"

# Engine
client = AsyncIOMotorClient(MONGO_URL)
engine = AIOEngine(client=client, database=DB_NAME)

# Models
class Exercise(Model):
    name: str
    reps: Optional[str] = None  # String to allow "12" or "30s"
    sets: int = 3
    weight: Optional[float] = None
    weight_unit: str = "lbs" # lbs or kg

class Workout(Model):
    date: datetime = Field(default_factory=datetime.utcnow)
    type: str # Push, Pull, Legs, Core, Cardio
    exercises: List[Exercise] = []
    user_id: str  # For simple emergent auth, this might just be a session token or email

class User(Model):
    email: str = Field(unique=True)
    google_id: Optional[str] = None
    password_hash: Optional[str] = None
    name: str
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

async def get_engine():
    return engine
