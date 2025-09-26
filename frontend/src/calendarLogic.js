// src/calendarLogic.js
import { reactive } from 'vue';
import { store } from './eventStore'; // Import the shared event store

// --- State Management for Calendar View ---
export const calendarState = reactive({
    // The date currently being viewed (default to current system date)
    viewDate: new Date(), 
});

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

/**
 * Calculates the display string for the current view date (e.g., "September 2025").
 * @returns {string} The formatted month and year string.
 */
export function getCurrentMonthYearDisplay() {
    const year = calendarState.viewDate.getFullYear();
    const month = calendarState.viewDate.getMonth(); // 0-indexed
    return `${monthNames[month]} ${year}`;
}

/**
 * Moves the calendar view one month forward.
 */
export function nextMonth() {
    const current = calendarState.viewDate;
    // Set the date to the 1st of the next month to prevent month skipping issues (e.g., from Jan 31st)
    calendarState.viewDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
}

/**
 * Moves the calendar view one month backward.
 */
export function previousMonth() {
    const current = calendarState.viewDate;
    // Set the date to the 1st of the previous month
    calendarState.viewDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
}

// ------------------------------------------

/**
 * Gets a list of events for a specific day from the store for the current viewed month/year.
 * @param {number} day - The day of the month (1-31).
 * @returns {Array} An array of events for that day.
 */
export function getEventsForDay(day) {
  const year = calendarState.viewDate.getFullYear();
  const month = calendarState.viewDate.getMonth() + 1; // 1-based month for padding

  const paddedMonth = String(month).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  const targetDate = `${year}-${paddedMonth}-${paddedDay}`;
  
  // Events are fetched from the shared store
  return store.events.filter(event => event.date === targetDate);
}

/**
 * Generates an array of 42 day objects for the current calendar month view.
 * @returns {Array<Object>} Array of day objects.
 */
export function generateCalendarDays() {
  const year = calendarState.viewDate.getFullYear();
  const month = calendarState.viewDate.getMonth(); // 0-indexed month (0-11)
  
  // 1. Calculate start day and month length
  const firstOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstOfMonth.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get last day of current month
  
  const days = [];
  
  // 2. Add preceding days (from the previous month)
  const prevMonthLastDay = new Date(year, month, 0).getDate(); // Get last day of previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      dayOfMonth: prevMonthLastDay - i,
      isCurrentMonth: false,
    });
  }
  
  // 3. Add the days of the current month
  const currentMonthOneBased = month + 1;
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      dayOfMonth: day,
      isCurrentMonth: true,
      // Format: YYYY-MM-DD for event lookup
      date: `${year}-${String(currentMonthOneBased).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      events: getEventsForDay(day) 
    });
  }
  
  // 4. Fill the remaining cells with days from the next month
  const totalCells = 42; 
  const remainingCells = totalCells - days.length;
  
  for (let i = 1; i <= remainingCells; i++) {
    days.push({
      dayOfMonth: i,
      isCurrentMonth: false,
    });
  }

  return days;
}