// src/calendarLogic.js
import { reactive } from "vue";
import { store } from "./eventStore"; // Shared event store

// --- Global Calendar State ---
export const calendarState = reactive({
  viewDate: new Date(), // Used for monthly view
  weekStartDate: getStartOfWeek(new Date()) // Used for weekly view
});

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ------------------------------------------
// 🔸 UTILITIES
// ------------------------------------------

/**
 * Returns start of the week (Sunday) for a given date.
 */
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ------------------------------------------
// 🔸 MONTHLY LOGIC
// ------------------------------------------

export function getCurrentMonthYearDisplay() {
  const year = calendarState.viewDate.getFullYear();
  const month = calendarState.viewDate.getMonth();
  return `${monthNames[month]} ${year}`;
}

export function nextMonth() {
  const current = calendarState.viewDate;
  calendarState.viewDate = new Date(current.getFullYear(), current.getMonth() + 1, 1);
}

export function previousMonth() {
  const current = calendarState.viewDate;
  calendarState.viewDate = new Date(current.getFullYear(), current.getMonth() - 1, 1);
}

export function getEventsForDay(day) {
  const year = calendarState.viewDate.getFullYear();
  const month = calendarState.viewDate.getMonth() + 1;
  const paddedMonth = String(month).padStart(2, "0");
  const paddedDay = String(day).padStart(2, "0");
  const targetDate = `${year}-${paddedMonth}-${paddedDay}`;

  return store.events.filter(event => event.date === targetDate);
}

export function generateCalendarDays() {
  const year = calendarState.viewDate.getFullYear();
  const month = calendarState.viewDate.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];

  // Preceding days (from previous month)
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push({
      dayOfMonth: date.getDate(),
      isCurrentMonth: false,
      fullDate: formatDate(date),
      events: store.events.filter(e => e.date === formatDate(date))
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      dayOfMonth: day,
      isCurrentMonth: true,
      fullDate: formatDate(date),
      events: getEventsForDay(day)
    });
  }

  // Fill remaining cells with next month's days
  const totalCells = 42;
  const remainingCells = totalCells - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      dayOfMonth: i,
      isCurrentMonth: false,
      fullDate: formatDate(date),
      events: store.events.filter(e => e.date === formatDate(date))
    });
  }

  return days;
}

// ------------------------------------------
// 🔸 WEEKLY LOGIC
// ------------------------------------------

export function generateWeeklyDays() {
  const start = calendarState.weekStartDate;
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    weekDays.push({
      dayOfMonth: date.getDate(),
      fullDate: formatDate(date),
      isCurrentMonth: date.getMonth() === calendarState.viewDate.getMonth(),
      events: store.events.filter(e => e.date === formatDate(date))
    });
  }

  return weekDays;
}

export function nextWeek() {
  calendarState.weekStartDate.setDate(calendarState.weekStartDate.getDate() + 7);
}

export function previousWeek() {
  calendarState.weekStartDate.setDate(calendarState.weekStartDate.getDate() - 7);
}
