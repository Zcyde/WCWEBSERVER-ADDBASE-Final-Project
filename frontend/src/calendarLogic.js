import { reactive } from "vue";
import { store } from "./eventStore"; 

export const calendarState = reactive({
  viewDate: new Date(), 
  weekStartDate: getStartOfWeek(new Date()) 
});

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      dayOfMonth: day,
      isCurrentMonth: true,
      fullDate: formatDate(date),
      events: getEventsForDay(day)
    });
  }

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
