import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Add a request interceptor to include the session token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('ironlog_token');
    if (token) {
        // In a real app this would be in headers
        config.params = { ...config.params, session_token: token };
    }
    return config;
});

export default api;
