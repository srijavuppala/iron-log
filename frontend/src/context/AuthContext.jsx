import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            // Send the Google credential to our backend
            const response = await api.post('/auth/google', {
                token: credentialResponse.credential
            });

            const { user: userData, session_token } = response.data;

            localStorage.setItem('ironlog_token', session_token);
            localStorage.setItem('ironlog_user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Please try again.');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: userData, session_token } = response.data;
            localStorage.setItem('ironlog_token', session_token);
            localStorage.setItem('ironlog_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Login failed', error);
            return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { user: userData, session_token } = response.data;
            localStorage.setItem('ironlog_token', session_token);
            localStorage.setItem('ironlog_user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error('Registration failed', error);
            return { success: false, error: error.response?.data?.detail || 'Registration failed' };
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
        <AuthContext.Provider value={{ user, handleGoogleLogin, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
