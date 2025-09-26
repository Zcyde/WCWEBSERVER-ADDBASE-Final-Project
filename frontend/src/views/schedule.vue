<template>
  <div class="relative min-h-screen bg-white">
    <div class="p-6">
      <div class="flex justify-between items-center pb-4 mb-6 pr-4 border-b border-black-400">
        <div class="flex items-center space-x-4">
          <button
            class="text-xl font-bold text-gray-700 hover:text-gray-900"
            @click="previousMonth"
          >&lt;</button>

          <div
            class="py-2 px-8 rounded-full border-2 border-black-600 font-sans text-xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
          >{{ currentMonthYearDisplay }}</div>

          <button
            class="text-xl font-bold text-gray-700 hover:text-gray-900"
            @click="nextMonth"
          >&gt;</button>
        </div>

        <button
          class="py-1 px-3 rounded-full text-sm font-medium bg-gradient-to-b from-gray-100 to-gray-300 border border-black-500 shadow-md text-black-700 hover:shadow-lg"
          @click="showAddEventModal = true"
        >+ add event</button>
      </div>

      <div class="grid grid-cols-7 gap-1 bg-[#192E47] p-2 rounded-md font-bold text-center text-sm">
        <div
          v-for="dayName in dayNames"
          :key="dayName"
          :class="{
            'rounded-tl-md': dayName === 'Sun',
            'rounded-tr-md': dayName === 'Sat',
            'border-r': dayName !== 'Sat'
          }"
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-[#8192A9]"
        >{{ dayName }}</div>

        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="{
            'bg-white border-b border-l border-[#8192A9]': day.isCurrentMonth,
            'bg-gray-100 border-b border-l border-[#8192A9] opacity-70': !day.isCurrentMonth,
            'border-r border-[#8192A9]': (index + 1) % 7 === 0 
          }"
          class="col-span-1 h-20 p-1 text-left relative overflow-hidden text-xs"
        >
          <div
            :class="{'text-gray-900 font-bold': day.isCurrentMonth, 'text-gray-500': !day.isCurrentMonth}"
            class="text-right p-1"
          >{{ day.dayOfMonth }}</div>

          <div v-if="day.events && day.events.length" class="space-y-0.5">
            <div
              v-for="event in day.events"
              :key="event.id"
              :class="[event.color, 'shadow-md']"
              class="w-full text-white text-xs px-1 py-0.5 rounded-sm truncate cursor-pointer hover:opacity-90 transition-opacity"
              :title="event.title"
            >{{ event.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10 z-0"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-96" />
    </div>

    <AddEventModal :is-visible="showAddEventModal" @close="showAddEventModal = false" />
  </div>
</template>

<script>
import {
  generateCalendarDays,
  getCurrentMonthYearDisplay,
  nextMonth,
  previousMonth,
  calendarState,
} from "../calendarLogic.js";
import { store } from "../eventStore.js";
import AddEventModal from "../components/AddEventModal.vue"; // 💥 Import the new component
import { computed, watch } from "vue";

export default {
  name: "Schedule",
  components: {
    AddEventModal, // 💥 Register the new component
  },
  // The 'setup' function holds the core calendar reactivity logic
  setup() {
    // Computed properties for reactivity
    const currentMonthYearDisplay = computed(() =>
      getCurrentMonthYearDisplay()
    );
    const calendarDays = computed(() => generateCalendarDays());

    // Watcher for store changes (from Planner or Modal) and view date changes (from navigation)
    watch(
      [() => store.events, () => calendarState.viewDate],
      () => {
        // The calendarDays computed property will automatically re-run and update the template
      },
      { deep: true, immediate: true }
    );

    return {
      currentMonthYearDisplay,
      calendarDays,
      nextMonth,
      previousMonth,
    };
  },
  data() {
    return {
      dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      showAddEventModal: false, // Controls the visibility of the AddEventModal component
    };
  },
};
</script>