from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Workout, User
from odmantic import ObjectId
import httpx
import os

app = FastAPI(title="Ironlog API")

# CORS - Read from environment variable or use defaults
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in cors_origins_str.split(",")]

print(f"[CORS] Allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Ironlog API is running"}

# Auth
from pydantic import BaseModel

class GoogleAuthRequest(BaseModel):
    token: str

@app.post("/auth/google")
async def google_auth(request: GoogleAuthRequest):
    try:
        print(f"[AUTH] Received login request, token length: {len(request.token)}")

        # TEMPORARY: Dev bypass for testing while OAuth propagates
        if request.token == "dev_bypass_token":
            print("[AUTH] Using dev bypass")
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
        print("[AUTH] Verifying token with Google...")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://oauth2.googleapis.com/tokeninfo?id_token={request.token}"
            )

            print(f"[AUTH] Google response status: {response.status_code}")

            if response.status_code != 200:
                error_detail = response.text
                print(f"[AUTH] Token verification failed: {error_detail}")
                raise HTTPException(
                    status_code=401,
                    detail=f"Invalid token - Google returned {response.status_code}: {error_detail}"
                )

            token_info = response.json()
            print(f"[AUTH] Token info received: email={token_info.get('email')}")

            # Extract user info from token
            google_id = token_info.get("sub")
            email = token_info.get("email")
            name = token_info.get("name")
            picture = token_info.get("picture")

            if not google_id or not email:
                print(f"[AUTH] Missing required fields: google_id={google_id}, email={email}")
                raise HTTPException(status_code=401, detail="Invalid token data - missing required fields")

            # Find or create user
            print(f"[AUTH] Looking up user: {email}")
            user = await engine.find_one(User, User.google_id == google_id)
            if not user:
                print(f"[AUTH] Creating new user: {email}")
                user = User(
                    google_id=google_id,
                    email=email,
                    name=name or email.split('@')[0],
                    avatar_url=picture
                )
                await engine.save(user)
            else:
                print(f"[AUTH] Existing user found: {email}")

            # Generate session token (in production, use JWT or similar)
            session_token = f"session_{google_id}"

            print(f"[AUTH] Login successful for: {email}")
            return {"user": user, "session_token": session_token}

    except HTTPException:
        raise
    except httpx.HTTPError as e:
        print(f"[AUTH] HTTP error during token verification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to verify token with Google: {str(e)}")
    except Exception as e:
        print(f"[AUTH] Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")

@app.get("/me")
async def get_me(session_token: str = ""):
    if not session_token or not session_token.startswith("session_"):
        raise HTTPException(status_code=401, detail="Invalid session")
    
    google_id = session_token.replace("session_", "")
    user = await engine.find_one(User, User.google_id == google_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

@app.post("/workouts")
async def create_workout(workout_data: dict, session_token: str = ""):
    try:
        # Extract user_id from session token
        if not session_token or not session_token.startswith("session_"):
            raise HTTPException(status_code=401, detail="Invalid session")
        
        user_id = session_token.replace("session_", "")
        
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
        if not session_token or not session_token.startswith("session_"):
            raise HTTPException(status_code=401, detail="Invalid session")
        
        user_id = session_token.replace("session_", "")
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
