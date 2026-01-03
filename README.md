# 🏋️ Ironlog

A modern, full-stack workout tracking application built with FastAPI, React, and MongoDB.

## ✨ Features

- 🔐 Google OAuth authentication
- 📅 Calendar-based workout tracking
- 💪 Multiple workout types (Push, Pull, Legs, Core, Cardio, Custom)
- 📊 Exercise tracking with sets, reps, and weights
- 🎨 Beautiful, responsive UI with Tailwind CSS
- 📤 Share workouts with clipboard history
- 🌙 Modern dark mode design

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS
- Framer Motion
- React OAuth Google
- Axios

**Backend:**
- FastAPI
- Motor (Async MongoDB driver)
- Odmantic (MongoDB ODM)
- Uvicorn

**Database:**
- MongoDB

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)

### Local Development

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd ironlog
   \`\`\`

2. **Run the startup script**
   \`\`\`bash
   chmod +x start_app.sh
   ./start_app.sh
   \`\`\`

   This will:
   - Set up Python virtual environment
   - Install backend dependencies
   - Install frontend dependencies
   - Start both servers

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- Vercel (Frontend)
- Railway/Render (Backend)
- MongoDB Atlas (Database)

## 📝 Environment Variables

### Backend (\`backend/.env\`)
\`\`\`
MONGO_URL=mongodb://localhost:27017
CORS_ORIGINS=http://localhost:5173
\`\`\`

### Frontend (\`frontend/.env\`)
\`\`\`
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

## 📖 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own purposes.
# iron-log
