# 🚀 Deployment Guide

This guide will walk you through deploying Ironlog to production using free tiers of cloud services.

## Architecture Overview

```
Frontend (Vercel) → Backend (Railway/Render) → Database (MongoDB Atlas)
```

---

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Railway account (sign up at railway.app) OR Render account (sign up at render.com)
- MongoDB Atlas account (sign up at mongodb.com/cloud/atlas)

---

## 1️⃣ MongoDB Atlas Setup

### Create Database

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new project called "Ironlog"
3. Click "Build a Database"
4. Choose **FREE** tier (M0)
5. Select a cloud provider and region (choose one close to your users)
6. Name your cluster (e.g., "ironlog-cluster")
7. Click "Create"

### Configure Database Access

1. **Database Access** → Add New Database User
   - Username: `ironlog_user`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"

2. **Network Access** → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is needed for Railway/Render to connect

### Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://ironlog_user:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://ironlog_user:<password>@cluster.mongodb.net/ironlog?retryWrites=true&w=majority`

---

## 2️⃣ Push to GitHub

1. **Create a new repository on GitHub**
   - Go to github.com
   - Click "New repository"
   - Name it "ironlog"
   - Make it public or private
   - Don't initialize with README (you already have one)

2. **Push your code**
   ```bash
   cd /Users/srijavuppala/Desktop/ironlog
   
   # Remove cached files that should be ignored
   git rm -r --cached backend/__pycache__
   git rm --cached backend/server_debug.log
   git rm --cached frontend/.env
   
   # Commit everything
   git add .
   git commit -m "Initial commit - Ironlog workout tracker"
   
   # Add remote and push
   git remote add origin https://github.com/YOUR_USERNAME/ironlog.git
   git branch -M main
   git push -u origin main
   ```

---

## 3️⃣ Backend Deployment (Choose One)

### Option A: Railway (Recommended)

1. **Create New Project**
   - Go to [Railway](https://railway.app/)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your `ironlog` repository
   - Railway will detect it's a Python project

2. **Configure Service**
   - Click on the service
   - Go to "Settings"
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables**
   - Go to "Variables" tab
   - Add:
     ```
     MONGO_URL=mongodb+srv://ironlog_user:YOUR_PASSWORD@cluster.mongodb.net/ironlog?retryWrites=true&w=majority
     CORS_ORIGINS=http://localhost:5173
     ```
   - ⚠️ **IMPORTANT**: You'll update CORS_ORIGINS after deploying frontend
   - ⚠️ **CRITICAL**: CORS_ORIGINS must include your Vercel URL or login will fail silently!

4. **Generate Domain**
   - Go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy your backend URL (e.g., `https://ironlog-backend.railway.app`)

### Option B: Render

1. **Create New Web Service**
   - Go to [Render](https://render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `ironlog`

2. **Configure Service**
   - **Name**: `ironlog-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free

3. **Add Environment Variables**
   - Scroll to "Environment Variables"
   - Add:
     ```
     MONGO_URL=mongodb+srv://ironlog_user:YOUR_PASSWORD@cluster.mongodb.net/ironlog?retryWrites=true&w=majority
     CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
     ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://ironlog-backend.onrender.com`)

---

## 4️⃣ Frontend Deployment (Vercel)

1. **Import Project**
   - Go to [Vercel](https://vercel.com/)
   - Click "Add New..." → "Project"
   - Import your `ironlog` repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
     ```
   - Replace with your actual backend URL from step 3

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your frontend URL (e.g., `https://ironlog.vercel.app`)

5. **Update Backend CORS** ⚠️ **CRITICAL STEP**
   - Go back to Railway/Render
   - Update `CORS_ORIGINS` environment variable to include your Vercel URL:
     ```
     CORS_ORIGINS=https://ironlog.vercel.app,http://localhost:5173
     ```
   - Replace `ironlog.vercel.app` with your actual Vercel domain
   - **Don't forget to redeploy the backend** for changes to take effect!
   - You can verify CORS is working by checking Railway logs for `[CORS] Allowed origins:`

6. **Update Vercel API Proxy** (Optional)
   - Edit `frontend/vercel.json`
   - Update the `destination` URL to your backend URL
   - Commit and push to trigger redeployment

---

## 5️⃣ Google OAuth Setup

1. **Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable "Google+ API"

2. **Create OAuth Credentials**
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - **Authorized JavaScript origins**:
     - `https://ironlog.vercel.app` (your Vercel URL)
     - `http://localhost:5173` (for local dev)
   - **Authorized redirect URIs**:
     - `https://ironlog.vercel.app` (your Vercel URL)
     - `http://localhost:5173` (for local dev)

3. **Update Environment Variables**
   - Copy the Client ID
   - Update `VITE_GOOGLE_CLIENT_ID` in Vercel
   - Redeploy frontend

---

## ✅ Verification

1. Visit your Vercel URL
2. Try logging in with Google
3. Create a workout
4. Verify it saves and displays correctly

---

## 🔧 Troubleshooting

### Backend won't start
- Check environment variables are set correctly
- Verify MongoDB connection string is correct
- Check logs in Railway/Render dashboard

### Frontend can't connect to backend
- Verify CORS_ORIGINS includes your frontend URL (comma-separated, no spaces)
- Check VITE_API_URL is correct (or verify hardcoded URL in `frontend/src/api.js`)
- Look at browser console for errors
- Check Railway logs to see if requests are reaching the backend

### Google OAuth login fails silently (no error message)
This is usually a CORS or Google OAuth configuration issue:

1. **Check CORS Configuration** (Most Common Issue)
   - Railway: Go to Variables → Verify `CORS_ORIGINS` includes your Vercel URL
   - Example: `CORS_ORIGINS=https://ironlog.vercel.app,http://localhost:5173`
   - **Redeploy backend** after changing CORS_ORIGINS
   - Check Railway logs for: `[CORS] Allowed origins: ['https://ironlog.vercel.app', ...]`

2. **Check Google OAuth Configuration**
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → Credentials
   - **Authorized JavaScript origins** must include:
     - `https://ironlog.vercel.app` (your actual Vercel URL)
     - `http://localhost:5173`
   - **Authorized redirect URIs** must include:
     - `https://ironlog.vercel.app`
     - `http://localhost:5173`
   - Changes can take 5-30 minutes to propagate

3. **Check Environment Variables**
   - Vercel: Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
   - **Redeploy frontend** after changing environment variables

4. **Debug with Browser Console**
   - Open DevTools (F12) → Console tab
   - Try to login
   - Look for errors starting with `[AUTH]`
   - Check Network tab for failed requests to `/auth/google`

5. **Check Railway Logs**
   - Railway dashboard → Deployments → View logs
   - Look for `[AUTH]` messages to see where login is failing
   - Common errors:
     - "Invalid token" = Google OAuth configuration issue
     - No logs at all = CORS blocking the request

### Google OAuth not working
- Verify authorized origins and redirect URIs match your Vercel URL exactly
- Check VITE_GOOGLE_CLIENT_ID is correct
- Make sure you're using HTTPS (Vercel provides this automatically)
- Wait 5-30 minutes after changing Google OAuth settings for changes to propagate

---

## 💰 Cost Breakdown

- **MongoDB Atlas**: Free (M0 tier - 512MB)
- **Railway**: Free tier ($5 credit/month, ~500 hours)
- **Render**: Free tier (spins down after inactivity)
- **Vercel**: Free tier (generous limits for personal projects)

**Total**: $0/month for low-traffic personal use! 🎉

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)

---

## 🎥 Video Tutorials

See the main README for links to YouTube tutorials covering each deployment step.
