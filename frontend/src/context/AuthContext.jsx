import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            console.log('[AUTH] Starting Google login...');
            console.log('[AUTH] Token received from Google, length:', credentialResponse.credential?.length);

            // Send the Google credential to our backend
            const response = await api.post('/auth/google', {
                token: credentialResponse.credential
            });

            console.log('[AUTH] Backend response received:', response.status);

            const { user: userData, session_token } = response.data;

            localStorage.setItem('ironlog_token', session_token);
            localStorage.setItem('ironlog_user', JSON.stringify(userData));
            setUser(userData);

            console.log('[AUTH] Login successful for:', userData.email);
        } catch (error) {
            console.error('[AUTH] Login failed:', error);

            let errorMessage = 'Login failed. Please try again.';

            if (error.response) {
                // Server responded with error
                console.error('[AUTH] Server error:', error.response.status, error.response.data);
                errorMessage = `Login failed: ${error.response.data.detail || error.response.statusText}`;
            } else if (error.request) {
                // Request made but no response
                console.error('[AUTH] No response from server');
                errorMessage = 'Cannot connect to server. Please check your internet connection.';
            } else {
                // Error setting up request
                console.error('[AUTH] Request setup error:', error.message);
                errorMessage = `Login error: ${error.message}`;
            }

            alert(errorMessage);
        }
    };

    useEffect(() => {
        // Check local storage on load
        const token = localStorage.getItem('ironlog_token');
        const savedUser = localStorage.getItem('ironlog_user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('ironlog_token');
        localStorage.removeItem('ironlog_user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, handleGoogleLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
