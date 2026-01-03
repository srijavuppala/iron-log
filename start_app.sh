#!/bin/bash
echo "🔥 Starting Ironlog..."

# Start Backend
echo "🚀 Starting Backend (Port 8000)..."
cd backend
source venv/bin/activate
# check if port 8000 is taken, if so kill it
lsof -t -i:8000 | xargs kill -9 2>/dev/null
uvicorn server:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "🎨 Starting Frontend (Port 5173)..."
cd frontend
# kill 5173 if taken
lsof -t -i:5173 | xargs kill -9 2>/dev/null
npm run dev -- --host &
FRONTEND_PID=$!
cd ..

echo "✅ App is running!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend: http://localhost:8000/docs"
echo "Press CTRL+C to stop both."

trap "kill $BACKEND_PID $FRONTEND_PID" INT
wait
