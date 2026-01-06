from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Workout, User
from odmantic import ObjectId
import httpx
from passlib.context import CryptContext
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

app = FastAPI(title="Ironlog API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev ease, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Ironlog API is running"}

# Auth
from pydantic import BaseModel

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

@app.post("/auth/register")
async def register(request: RegisterRequest):
    # Check if user exists
    existing_user = await engine.find_one(User, User.email == request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(request.password)
    user = User(
        email=request.email,
        password_hash=hashed_password,
        name=request.name
    )
    await engine.save(user)
    
    session_token = f"sess_uid_{user.id}"
    return {"user": user, "session_token": session_token}

@app.post("/auth/login")
async def login(request: LoginRequest):
    user = await engine.find_one(User, User.email == request.email)
    if not user or not user.password_hash or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    session_token = f"sess_uid_{user.id}"
    return {"user": user, "session_token": session_token}

@app.post("/auth/google")
async def google_auth(request: GoogleAuthRequest):
    try:
        # TEMPORARY: Dev bypass for testing while OAuth propagates
        if request.token == "dev_bypass_token":
            google_id = "dev_user_123"
            user = await engine.find_one(User, User.google_id == google_id)
            if not user:
                user = User(
                    google_id=google_id,
                    email="dev@ironlog.test",
                    name="Dev User",
                    avatar_url=None
                )
                await engine.save(user)
            session_token = f"session_{google_id}"
            return {"user": user, "session_token": session_token}
        
        # Real Google token verification
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={request.token}"
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid token")
            
            token_info = response.json()
            
            # Extract user info from token
            google_id = token_info.get("sub")
            email = token_info.get("email")
            name = token_info.get("name")
            picture = token_info.get("picture")
            
            if not google_id or not email:
                raise HTTPException(status_code=401, detail="Invalid token data")
            
            # Find or create user
            user = await engine.find_one(User, User.google_id == google_id)
            if not user:
                user = User(
                    google_id=google_id,
                    email=email,
                    name=name or email.split('@')[0],
                    avatar_url=picture
                )
                await engine.save(user)
            
            # Generate session token (in production, use JWT or similar)
            session_token = f"session_{google_id}"
            
            return {"user": user, "session_token": session_token}
            
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.get("/me")
async def get_me(session_token: str = ""):
    if not session_token:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user = None
    if session_token.startswith("sess_uid_"):
        user_id_str = session_token.replace("sess_uid_", "")
        try:
            user_id = ObjectId(user_id_str)
            user = await engine.find_one(User, User.id == user_id)
        except:
             pass
    elif session_token.startswith("session_"):
        google_id = session_token.replace("session_", "")
        user = await engine.find_one(User, User.google_id == google_id)
    
    if not user:
        raise HTTPException(status_code=401, detail="User not found or session invalid")
    
    return user

@app.post("/workouts")
async def create_workout(workout_data: dict, session_token: str = ""):
    try:
        # Extract user_id from session token
        user_id = None
        if session_token.startswith("sess_uid_"):
            user_id = session_token.replace("sess_uid_", "")
        elif session_token.startswith("session_"):
            user_id = session_token.replace("session_", "")
        else:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        # Create workout with user_id
        workout = Workout(
            date=workout_data.get("date"),
            type=workout_data.get("type"),
            exercises=[],  # We'll add exercises separately
            user_id=user_id
        )
        
        # Add exercises
        for ex_data in workout_data.get("exercises", []):
            from database import Exercise
            exercise = Exercise(
                name=ex_data.get("name"),
                reps=ex_data.get("reps"),
                sets=ex_data.get("sets", 3),
                weight=ex_data.get("weight", 0),
                weight_unit=workout_data.get("weight_unit", "lbs")
            )
            workout.exercises.append(exercise)
        
        await engine.save(workout)
        return workout
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save workout: {str(e)}")

@app.get("/workouts")
async def get_workouts(session_token: str = ""):
    try:
        user_id = None
        if session_token.startswith("sess_uid_"):
            user_id = session_token.replace("sess_uid_", "")
        elif session_token.startswith("session_"):
            user_id = session_token.replace("session_", "")
        else:
            raise HTTPException(status_code=401, detail="Invalid session")
        workouts = await engine.find(Workout, Workout.user_id == user_id, sort=Workout.date.desc())
        return workouts
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch workouts: {str(e)}")

@app.delete("/workouts/{id}")
async def delete_workout(id: ObjectId):
    workout = await engine.find_one(Workout, Workout.id == id)
    if not workout:
        raise HTTPException(status_code=404, message="Workout not found")
    await engine.delete(workout)
    return {"message": "Deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
