import { reactive } from 'vue';
import api from './services/api.js';

export const store = reactive({
    events: [],
    folders: [],

    async loadData() {
        // CLEANUP: Do not proceed with API calls if no token is present.
        if (!localStorage.getItem('authToken')) {
            console.warn("Skipping loadData: User is not authenticated.");
            // Fallback to local storage (or just return empty arrays)
            const savedFolders = localStorage.getItem('folders');
            const savedEvents = localStorage.getItem('events');
            this.folders = savedFolders ? JSON.parse(savedFolders) : [];
            this.events = savedEvents ? JSON.parse(savedEvents) : [];
            return;
        }

        try {
            // --- Backend API version ---
            const [eventsRes, foldersRes] = await Promise.all([
                api.get('/events'),
                api.get('/folders')
            ]);
            this.events = eventsRes.data;
            this.folders = foldersRes.data;

            console.log("Store loaded from backend. Folders:", this.folders.length, "Events:", this.events.length);
        } catch (error) {
            // Note: If this 401, the API Interceptor handles the redirect.
            // We only need to handle non-auth related failures here.
            console.error("Failed to load data from backend:", error);
            
            // Fallback to localStorage if backend fails (e.g., 500 server error)
            const savedFolders = localStorage.getItem('folders');
            const savedEvents = localStorage.getItem('events');
            this.folders = savedFolders ? JSON.parse(savedFolders) : [];
            this.events = savedEvents ? JSON.parse(savedEvents) : [];
        }
    },

    async loadEventsByFolder(folderId) {
        if (!localStorage.getItem('authToken')) {
            console.warn("Skipping loadEventsByFolder: User is not authenticated.");
            return [];
        }
        try {
            const response = await api.get('/events', { params: { folderId } });
            return response.data;
        } catch (error) {
            console.error("Failed to load events by folder from backend:", error);
            return [];
        }
    },

    // ... rest of your store methods (addEvent, addFolder) ...
    // ... (They are fine as they are, using the try/catch blocks) ...
    async addEvent(eventData) {
        try {
            // --- Backend API version ---
            const response = await api.post('/events', eventData);
            const newEvent = response.data;

            this.events.push(newEvent);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log("Added event to backend. Events count:", this.events.length);
        } catch (error) {
            console.error('Failed to add event to backend:', error);
            // Fallback to localStorage
            const newEvent = {
                ...eventData,
                id: Date.now()
            };
            this.events.push(newEvent);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('events', JSON.stringify(this.events));
        }
    },

    async addFolder(name, color = 'bg-gray-400') {
        if (!name) return;

        try {
            // --- Backend API version ---
            const response = await api.post('/folders', { name, color });
            this.folders.push(response.data);

            console.log("Added folder to backend:", response.data);
        } catch (error) {
            console.error('Failed to add folder to backend:', error);
            // Fallback to localStorage
            const newFolder = {
                id: Date.now(),
                name,
                color
            };
            this.folders.push(newFolder);
            localStorage.setItem('folders', JSON.stringify(this.folders));
        }
    }
});
