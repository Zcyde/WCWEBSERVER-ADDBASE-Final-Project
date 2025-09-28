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

          <!-- EVENT DISPLAY LOGIC (Now driven by calendarDays from Composable) -->
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
      <!-- Assuming you have an image at this path -->
      <img src="../dmLogo.png" alt="watermark" class="w-96" />
    </div>

    <AddEventModal :is-visible="showAddEventModal" @close="showAddEventModal = false" />
  </div>
</template>

<script setup>
// --- LOGIC / SCRIPT (Minimized and Delegated to Composable) ---
import AddEventModal from "../components/AddEventModal.vue";
import { useScheduleLogic } from "../composables/useScheduleLogic.js";

// Destructure all logic from the composable
const {
  dayNames,
  showAddEventModal,
  currentMonthYearDisplay,
  calendarDays,
  nextMonth,
  previousMonth,
} = useScheduleLogic();
</script>
