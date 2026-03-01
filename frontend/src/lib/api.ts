import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
// Priority: NextAuth session backendToken > localStorage fallback
api.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        let authSet = false;
        try {
            // First try NextAuth session (most reliable after login)
            const session = await getSession();
            const backendToken = (session?.user as any)?.backendToken;
            if (backendToken) {
                (config.headers as any).Authorization = `Bearer ${backendToken}`;
                authSet = true;
            }
        } catch {
            // fall through to localStorage
        }

        if (!authSet) {
            // Fallback: localStorage token (for backward compatibility)
            const token = localStorage.getItem('qd_token');
            if (token) (config.headers as any).Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('qd_token');
            localStorage.removeItem('qd_user');
        }
        return Promise.reject(error);
    }
);

export default api;
