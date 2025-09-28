import { ref, computed } from "vue";
import { store } from "../eventStore.js"; // Access to the global data store

/**
 * useDashboardLogic Composable
 * Handles profile state and integration with planner data for the Dashboard view.
 */
export function useDashboardLogic() {
	// --- STATE ---
	const firstName = ref("Marlon");
	const lastName = ref("Garcia Michael");
	const selectedFolderId = ref(null);

	// --- HELPERS ---
    const formatDate = (date) => date.toISOString().split('T')[0];
    const getDayName = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });

	// --- METHODS ---
	const selectFolder = (folderId) => {
		// Toggle selection behavior
		selectedFolderId.value = selectedFolderId.value === folderId ? null : folderId;
	};

	// --- COMPUTED PROPERTIES: Data Filters ---
	const plannerFolders = computed(() => store.folders);
	const displayedFolders = computed(() => plannerFolders.value.slice(0, 4));

	const plansInSelectedFolder = computed(() => {
		if (!selectedFolderId.value) return [];
		return store.events.filter(event => 
			event.folderId == selectedFolderId.value
		).sort((a, b) => new Date(a.date) - new Date(b.date));
	});

	const upcomingPlans = computed(() => {
		const today = formatDate(new Date());
		const filteredEvents = store.events.filter(event => 
			event.date >= today 
		);
		filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
		return filteredEvents.slice(0, 5);
	});
    
    // --- TEMPLATE CONSOLIDATION LOGIC ---
    // 1. Unified Task List (max 5 items)
    const activeTasks = computed(() => {
        const plans = selectedFolderId.value ? plansInSelectedFolder.value : upcomingPlans.value;
        return plans.slice(0, 5);
    });

    // 2. Unified Task Widget Title
    const activeTaskTitle = computed(() => {
        return selectedFolderId.value 
            ? 'Tasks in Selected Planner' 
            : 'Upcoming Tasks (Next 5)';
    });

    // 3. Truncation message logic
    const showTruncation = computed(() => {
        return selectedFolderId.value && plansInSelectedFolder.value.length > 5;
    });

    const truncationCount = computed(() => {
        return selectedFolderId.value ? plansInSelectedFolder.value.length - 5 : 0;
    });

    /**
     * Creates a summary of tasks for the next 7 days for the mini-calendar grid.
     */
    const weeklyTaskSummary = computed(() => {
        const today = new Date();
        const formattedToday = formatDate(today);

        const eventsByDate = store.events
            .filter(event => event.date >= formattedToday)
            .reduce((acc, event) => {
                acc[event.date] = acc[event.date] || [];
                acc[event.date].push(event);
                return acc;
            }, {});
        
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateKey = formatDate(date);

            return {
                date: dateKey,
                dayOfMonth: date.getDate(),
                dayOfWeek: getDayName(date),
                isToday: i === 0,
                tasks: eventsByDate[dateKey] || [],
            };
        });
    });


	// --- INITIALIZATION ---
	if (store.events.length === 0 || store.folders.length === 0) {
		store.loadData();
	}

	return {
		firstName,
		lastName,
		displayedFolders,
		plannerFolders,
		selectedFolderId,
		selectFolder,
		plansInSelectedFolder,
        weeklyTaskSummary,
        // Consolidated logic for the template
        activeTasks,
        activeTaskTitle,
        showTruncation,
        truncationCount
	};
}
