import axios from 'axios';
// We must import the router to perform a soft navigation (router.push)
// instead of a hard reload (window.location.href).
import router from '../routing/router.js'; // Assuming router.js is in one directory up

// FIX: Ensure this baseURL points to your Express backend's running port (3000).
// The frontend runs on 5173, so it must explicitly call the backend on 3000.
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple 401 redirects from happening simultaneously
let isRedirecting = false; 

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, clear localStorage.
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // CRITICAL FIX: Use the flag and router.push() instead of window.location.href
            if (!isRedirecting) {
                isRedirecting = true;
                
                // Use router.push() for a soft navigation within the SPA.
                // The router guard will then see the user is logged out and handle the redirect flow.
                // NOTE: If the user is already on the Login page, this push is essentially a no-op 
                // but correctly resolves the route.
                router.push({ name: 'Login' }).catch(err => {
                    // Ignore navigation errors for already-at-target
                    if (err.name !== 'NavigationDuplicated') {
                        console.error('Router push error after 401:', err);
                    }
                }).finally(() => {
                    // Reset the flag after navigation is initiated
                    isRedirecting = false;
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
