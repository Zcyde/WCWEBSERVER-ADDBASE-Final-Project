import { reactive } from 'vue';
// import api from './services/api.js'; // Keep backend commented out for now

export const store = reactive({
    events: [],
    folders: [],

    async loadData() {
        try {
            // --- Backend API version (commented out for now) ---
            // const [eventsRes, foldersRes] = await Promise.all([
            //     api.get('/events'),
            //     api.get('/folders')
            // ]);
            // this.events = eventsRes.data;
            // this.folders = foldersRes.data;

            // --- Frontend-only with localStorage ---
            const savedFolders = localStorage.getItem('folders');
            const savedEvents = localStorage.getItem('events');

            this.folders = savedFolders ? JSON.parse(savedFolders) : [];
            this.events = savedEvents ? JSON.parse(savedEvents) : [];

            console.log("Store loaded. Folders:", this.folders.length, "Events:", this.events.length);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    },

    async addEvent(eventData) {
        try {
            // --- Backend API version (commented out) ---
            // const response = await api.post('/events', eventData);
            // const newEvent = response.data;

            // --- Frontend-only version ---
            const newEvent = {
                ...eventData,
                id: Date.now()
            };

            this.events.push(newEvent);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Save to localStorage
            localStorage.setItem('events', JSON.stringify(this.events));

            console.log("Added event and saved to localStorage. Events count:", this.events.length);
        } catch (error) {
            console.error('Failed to add event:', error);
        }
    },

    async addFolder(name, color = 'bg-gray-400') {
        if (!name) return;

        try {
            // --- Backend API version (commented out) ---
            // const response = await api.post('/folders', { name, color });
            // this.folders.push(response.data);

            // --- Frontend-only version ---
            const newFolder = {
                id: Date.now(),
                name,
                color
            };
            this.folders.push(newFolder);

            // Save to localStorage
            localStorage.setItem('folders', JSON.stringify(this.folders));

            console.log("Added folder and saved to localStorage:", newFolder);
        } catch (error) {
            console.error('Failed to add folder:', error);
        }
    }
});
