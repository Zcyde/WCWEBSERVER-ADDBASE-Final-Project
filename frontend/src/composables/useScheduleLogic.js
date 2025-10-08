import { computed, ref } from "vue";
import { store } from "../eventStore.js";
import {
  generateCalendarDays,
  generateWeeklyDays,
  getCurrentMonthYearDisplay,
  nextMonth,
  previousMonth,
  nextWeek,
  previousWeek,
} from "../calendarLogic.js";

export function useScheduleLogic() {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const showAddEventModal = ref(false);
  const currentView = ref("monthly");

  const currentMonthYearDisplay = computed(() => getCurrentMonthYearDisplay());

  const calendarDays = computed(() => {
    const days =
      currentView.value === "weekly"
        ? generateWeeklyDays()
        : generateCalendarDays();

    const eventsByDate = store.events.reduce((acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    }, {});

    return days.map(day => ({
      ...day,
      events: eventsByDate[day.fullDate] || [],
    }));
  });

  function toggleView() {
    currentView.value =
      currentView.value === "monthly" ? "weekly" : "monthly";
  }

  function goNext() {
    if (currentView.value === "weekly") {
      nextWeek();
    } else {
      nextMonth();
    }
  }

  function goPrevious() {
    if (currentView.value === "weekly") {
      previousWeek();
    } else {
      previousMonth();
    }
  }

  if (store.events.length === 0 || store.folders.length === 0) {
    store.loadData();
  }

  return {
    dayNames,
    showAddEventModal,
    currentMonthYearDisplay,
    calendarDays,
    toggleView,
    goNext,
    goPrevious,
    currentView,
  };
}
