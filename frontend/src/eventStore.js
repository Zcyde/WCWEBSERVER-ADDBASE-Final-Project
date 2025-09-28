import { reactive } from 'vue';
import api from './services/api.js';

export const store = reactive({
    events: [],
    folders: [],
    async loadData() {
        try {
            // NOTE: The previous ECONNREFUSED error suggests this call is failing. 
            // Ensure your backend server is definitely running on port 3000!
            const [eventsRes, foldersRes] = await Promise.all([
                api.get('/events'),
                api.get('/folders')
            ]);
            this.events = eventsRes.data;
            this.folders = foldersRes.data;
            console.log("Store initialized. Folders loaded:", this.folders.length, "Events loaded:", this.events.length);
        } catch (error) {
            console.error('Failed to load data during initialization. Is the backend running on port 3000?', error.message);
            // Log the full Axios error object for detailed debugging
            if (error.response) {
                console.error("Server Error Response:", error.response.data);
            } else if (error.request) {
                console.error("No Response Received (Connection Issue):", error.request);
            } else {
                console.error("Request Setup Error:", error.message);
            }
        }
    },

    /**
     * Action to add a new event (plan) to the store.
     * The response.data contains the new event object with the server-assigned ID.
     */
    async addEvent(eventData) {
        try {
            const response = await api.post('/events', eventData);
            const newEvent = response.data;

            // 1. Push the new event object
            this.events.push(newEvent);

            // 2. FIX: Replace the array with a new, sorted array to explicitly trigger reactivity.
            this.events = [...this.events].sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Console log the current state to confirm it's in the store.
            console.log("Successfully added and sorted event. Current events count:", this.events.length);
        } catch (error) {
            console.error('Failed to add event:', error.message);
            // Log the full Axios error object for detailed debugging
            if (error.response) {
                console.error("Server Error Response:", error.response.data);
            } else if (error.request) {
                console.error("No Response Received (Connection Issue):", error.request);
            } else {
                console.error("Request Setup Error:", error.message);
            }
        }
    },

    /**
     * Action to add a new folder to the store.
     */
    async addFolder(name, color = 'bg-gray-400') {
        if (!name) return;
        try {
            const response = await api.post('/folders', { name, color });
            this.folders.push(response.data);
        } catch (error) {
            console.error('Failed to add folder:', error);
        }
    }
});
