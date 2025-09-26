// src/eventStore.js
import { reactive } from 'vue';

// --- Date Helpers (for mock data) ---
const now = new Date();
const currentYear = now.getFullYear();
const currentMonthPadded = String(now.getMonth() + 1).padStart(2, '0');
const date = (day) => `${currentYear}-${currentMonthPadded}-${String(day).padStart(2, '0')}`;

// --- ID Tracking ---
let nextId = 9; 
let nextFolderId = 105; 

/**
 * The main reactive store for all events and metadata.
 */
export const store = reactive({
    // Initial mock events (adjusted to current month/year for testing)
    events: [
    ],
    
    // Default folders
    folders: [
    ],

    /**
     * Action to add a new event (plan) to the store.
     */
    addEvent(eventData) {
        const newEvent = {
            id: nextId++,
            ...eventData,
            color: eventData.color || 'bg-indigo-500'
        };
        this.events.push(newEvent);
        // Ensure events are sorted by date
        this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    /**
     * Action to add a new folder to the store.
     */
    addFolder(name, color = 'bg-gray-400') {
        if (!name) return;
        const newFolder = {
            id: nextFolderId++,
            name: name,
            color: color
        };
        this.folders.push(newFolder);
    }
});