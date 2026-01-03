# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Ironlog
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: Ironlog Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:8000`
   - Authorized redirect URIs:
     - `http://localhost:5173`
7. Click **Create** and copy your **Client ID**

## Step 2: Configure the App

1. Open `/Users/srijavuppala/Desktop/ironlog/frontend/.env`
2. Add your Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   ```
3. Save the file

## Step 3: Restart the App

```bash
cd /Users/srijavuppala/Desktop/ironlog
./start_app.sh
```

## Step 4: Test

1. Open http://localhost:5173
2. Click the Google Sign In button
3. Sign in with your Google account
4. You should be redirected to the dashboard!

## Troubleshooting

- **"redirect_uri_mismatch"**: Make sure `http://localhost:5173` is in your authorized origins
- **Button not showing**: Check that your Client ID is correctly set in `.env`
- **Token verification fails**: Ensure your backend can reach `oauth2.googleapis.com`
