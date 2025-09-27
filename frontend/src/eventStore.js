import { reactive } from 'vue';
import api from './services/api.js';

export const store = reactive({
    events: [],
    folders: [],
    async loadData() {
        try {
            const [eventsRes, foldersRes] = await Promise.all([
                api.get('/events'),
                api.get('/folders')
            ]);
            this.events = eventsRes.data;
            this.folders = foldersRes.data;
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    },

    /**
     * Action to add a new event (plan) to the store.
     */
    async addEvent(eventData) {
        try {
            const response = await api.post('/events', eventData);
            this.events.push(response.data);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Failed to add event:', error);
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
