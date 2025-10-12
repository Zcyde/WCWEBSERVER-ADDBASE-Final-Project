import { reactive } from 'vue';
import api from './services/api.js';

export const store = reactive({
    events: [],
    folders: [],

    async loadData() {
        if (!localStorage.getItem('authToken')) {
            console.warn("Skipping loadData: User is not authenticated.");
            const savedFolders = localStorage.getItem('folders');
            const savedEvents = localStorage.getItem('events');
            this.folders = savedFolders ? JSON.parse(savedFolders) : [];
            this.events = savedEvents ? JSON.parse(savedEvents) : [];
            return;
        }

        try {
            const [eventsRes, foldersRes] = await Promise.all([
                api.get('/events'),
                api.get('/folders')
            ]);
            this.events = eventsRes.data;
            this.folders = foldersRes.data;

            console.log("Store loaded from backend. Folders:", this.folders.length, "Events:", this.events.length);
        } catch (error) {
            console.error("Failed to load data from backend:", error);
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

    async addEvent(eventData) {
        try {
            const response = await api.post('/events', eventData);
            const newEvent = response.data;

            this.events.push(newEvent);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log("Added event to backend. Events count:", this.events.length);
        } catch (error) {
            console.error('Failed to add event to backend:', error);
            const newEvent = {
                ...eventData,
                id: Date.now()
            };
            this.events.push(newEvent);
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            localStorage.setItem('events', JSON.stringify(this.events));
        }
    },

    async updateEventWithFiles(planId, formData) {
        try {
            const response = await api.put(`/events/${planId}`, formData, {
                headers: {
                    'Content-Type': undefined,
                },
            });

            const savedPlan = response.data;
            const index = this.events.findIndex(e => e._id === savedPlan._id);
            if (index !== -1) {
                this.events[index] = savedPlan;
            }

            console.log(`Successfully updated plan ${savedPlan._id} and files on backend.`);
        } catch (error) {
            console.error("Failed to update event with files on backend:", error);
            throw new Error("Failed to upload files and update event on server.");
        }
    },

    async addFolder(name, color = 'bg-gray-400') {
        if (!name) return;

        try {
            const response = await api.post('/folders', { name, color });
            this.folders.push(response.data);

            console.log("Added folder to backend:", response.data);
        } catch (error) {
            console.error('Failed to add folder to backend:', error);
            const newFolder = {
                id: Date.now(),
                name,
                color
            };
            this.folders.push(newFolder);
            localStorage.setItem('folders', JSON.stringify(this.folders));
        }
    },
    /**
     * Deletes a folder and all associated events/plans.
     * @param {string} folderId The unique ID of the folder to delete.
     */
    /**
     * Deletes a folder and all associated events/plans.
     * @param {string} folderId The unique ID of the folder to delete.
     */
    async deleteFolder(folderId) {
        if (!localStorage.getItem('authToken')) {
            console.warn("Skipping deleteFolder: User is not authenticated.");
            this.folders = this.folders.filter(f => f._id !== folderId);
            this.events = this.events.filter(e => e.folderId !== folderId);
            localStorage.setItem('folders', JSON.stringify(this.folders));
            localStorage.setItem('events', JSON.stringify(this.events));
            return;
        }



        try {
            await api.delete(`/folders/${folderId}`);

            this.folders = this.folders.filter(f => f._id !== folderId);

            this.events = this.events.filter(e => e.folderId !== folderId);

            console.log(`Successfully deleted folder ${folderId} and its plans from backend.`);
        } catch (error) {
            console.error(`Failed to delete folder ${folderId}:`, error);
            throw new Error("Failed to delete the planner folder and its content on the server.");
        }
    },

    async updateEvent(eventId, eventData) {
        try {
            if (localStorage.getItem("authToken")) {
                await api.put(`/events/${eventId}`, eventData);
                console.log(`Updated event ${eventId} on backend`);
            } else {
                console.warn("User not authenticated — updating event locally only.");
            }

            const index = this.events.findIndex(e => String(e._id ?? e.id) === String(eventId));
            if (index !== -1) {
                this.events[index] = { ...this.events[index], ...eventData };
            }

            localStorage.setItem("events", JSON.stringify(this.events));

            console.log(`Updated event ${eventId} and updated localStorage`);
        } catch (error) {
            console.error("Failed to update event:", error);
            throw error;
        }
    },

    async deleteEvent(eventId) {
        const originalEvents = [...this.events];
        this.events = this.events.filter(
            (e) => String(e._id ?? e.id) !== String(eventId)
        );
        localStorage.setItem("events", JSON.stringify(this.events));

        try {
            if (localStorage.getItem("authToken")) {
                await api.delete(`/events/${eventId}`);
                console.log(`Deleted event ${eventId} from backend`);
            } else {
                console.warn("User not authenticated — deleted event locally only.");
            }

            console.log(`Deleted event ${eventId} and updated localStorage`);
        } catch (error) {
            console.error("Failed to delete event:", error);
            this.events = originalEvents;
            localStorage.setItem("events", JSON.stringify(this.events));
        }
    }
});
