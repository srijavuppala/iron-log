import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen bg-background flex items-center justify-center text-text-muted">Loading...</div>;

  if (!user) {
    return <Landing />;
  }

  return <Dashboard />;
};

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="h-screen w-screen bg-background flex flex-col items-center justify-center text-text-main p-8">
        <h1 className="text-2xl font-bold mb-4">⚠️ Configuration Required</h1>
        <p className="text-text-muted max-w-md text-center">
          Please add your Google OAuth Client ID to <code className="bg-surfaceHighlight px-2 py-1 rounded">.env</code> file:
        </p>
        <pre className="bg-surfaceHighlight p-4 rounded-lg mt-4 text-sm">
          VITE_GOOGLE_CLIENT_ID=your_client_id_here
        </pre>
        <p className="text-text-muted text-sm mt-4">
          Get your Client ID from: <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-primary underline">Google Cloud Console</a>
        </p>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
