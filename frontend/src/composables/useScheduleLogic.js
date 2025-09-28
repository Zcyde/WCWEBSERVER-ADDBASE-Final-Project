import { computed, ref } from "vue";
import { store } from "../eventStore.js"; // Access to the global data store
import {
  generateCalendarDays,
  getCurrentMonthYearDisplay,
  nextMonth,
  previousMonth,
} from "../calendarLogic.js"; // Assuming external calendar utility functions exist

/**
 * useScheduleLogic Composable
 * Handles all calendar generation, event injection, and UI state for the Schedule view.
 * It combines event data from the store with the calendar grid utility.
 */
export function useScheduleLogic() {
  // --- STATE ---
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const showAddEventModal = ref(false); // UI state for modal visibility

  // --- COMPUTED PROPERTIES ---

  const currentMonthYearDisplay = computed(() =>
    getCurrentMonthYearDisplay()
  );

  // This is the core logic: generate days and inject events from the store
  const calendarDays = computed(() => {
    // 1. Get the base calendar grid structure
    const days = generateCalendarDays();

    // 2. Map the store events into a lookup structure for fast access (YYYY-MM-DD -> [events])
    const eventsByDate = store.events.reduce((acc, event) => {
      // We assume event.date is in 'YYYY-MM-DD' format (as required by calendar utilities)
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {});

    // 3. Inject events into the corresponding day object
    return days.map(day => {
      // Assuming day.fullDate is the date string used as a key by generateCalendarDays
      const dateKey = day.fullDate;
      if (eventsByDate[dateKey]) {
        return {
          ...day,
          events: eventsByDate[dateKey],
        };
      }
      // Return day without events if none are found
      return day;
    });
  });

  // --- INITIALIZATION ---

  // Ensure data is loaded when the schedule is first accessed
  if (store.events.length === 0 || store.folders.length === 0) {
    store.loadData();
  }

  return {
    // Exposed State & Data
    dayNames,
    showAddEventModal,
    currentMonthYearDisplay,
    calendarDays,

    // Exposed Methods (from external logic)
    nextMonth,
    previousMonth,
  };
}
