import axios from 'axios';

// FIX: Ensure this baseURL points to your Express backend's running port (3000).
// The frontend runs on 5173, so it must explicitly call the backend on 3000.
const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
