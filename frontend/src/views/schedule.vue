<template>
  <div class="relative min-h-screen bg-white">
    <div class="p-4 sm:p-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 mb-6 border-b border-black-400 gap-3"
      >
        <div class="flex items-center justify-center sm:justify-start space-x-4">
          <button
            class="text-xl font-bold text-gray-700 hover:text-gray-900"
            @click="previousMonth"
          >
            &lt;
          </button>

          <div
            class="py-2 px-6 sm:px-8 rounded-full border-2 border-black-600 font-sans text-lg sm:text-xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
          >
            {{ currentMonthYearDisplay }}
          </div>

          <button
            class="text-xl font-bold text-gray-700 hover:text-gray-900"
            @click="nextMonth"
          >
            &gt;
          </button>
        </div>

        <button
          class="py-1 px-4 rounded-full text-sm font-medium bg-gradient-to-b from-gray-100 to-gray-300 border border-black-500 shadow-md text-black-700 hover:shadow-lg self-center sm:self-auto"
          @click="showAddEventModal = true"
        >
          + add event
        </button>
      </div>

      <!-- MOBILE VIEW (grid, but click to see events below) -->
      <div class="sm:hidden">
        <!-- Day Names -->
        <div
          class="grid grid-cols-7 gap-1 bg-[#192E47] p-1 rounded-md font-bold text-center text-xs"
        >
          <div
            v-for="dayName in dayNames"
            :key="'mobile-dayName-' + dayName"
            class="col-span-1 bg-[#4C8BF5] text-white py-2 border-[#8192A9]"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1 text-xs">
          <div
            v-for="(day, index) in calendarDays"
            :key="'mobile-day-' + index"
            class="h-14 flex items-center justify-center border border-[#8192A9] relative cursor-pointer"
            :class="{
              'bg-gray-100 opacity-70': !day.isCurrentMonth,
              'bg-white': day.isCurrentMonth,
              'border-2': selectedDay && selectedDay.dayOfMonth === day.dayOfMonth && selectedDay.isCurrentMonth === day.isCurrentMonth
            }"
            @click="selectDay(day)"
          >
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full"
              :class="{
                [day.events?.[0]?.color]: selectedDay && selectedDay.dayOfMonth === day.dayOfMonth,
                'bg-transparent': !(selectedDay && selectedDay.dayOfMonth === day.dayOfMonth)
              }"
            >
              {{ day.dayOfMonth }}
            </span>
          </div>
        </div>

        <!-- Selected Day Events -->
        <div v-if="selectedDay" class="mt-4 border-t pt-4">
          <h3 class="font-bold text-gray-800 mb-2">
            Events on {{ selectedDay.dayOfMonth }}
          </h3>
          <div v-if="selectedDay.events && selectedDay.events.length" class="space-y-2">
            <div
              v-for="event in selectedDay.events"
              :key="'mobile-event-' + event.id"
              :class="[event.color]"
              class="px-3 py-2 rounded-md text-white text-sm shadow-md"
            >
              {{ event.title }}
            </div>
          </div>
          <div v-else class="text-sm text-gray-500">No events for this day</div>
        </div>
      </div>

      <!-- DESKTOP VIEW (original calendar grid with events inside) -->
      <div class="hidden sm:block overflow-x-auto">
        <!-- Day Names -->
        <div
          class="grid grid-cols-7 gap-1 bg-[#192E47] p-2 rounded-md font-bold text-center text-sm min-w-[700px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            :class="{
              'rounded-tl-md': dayName === 'Sun',
              'rounded-tr-md': dayName === 'Sat',
              'border-r': dayName !== 'Sat'
            }"
            class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-[#8192A9]"
          >
            {{ dayName }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-1 min-w-[700px]">
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
              :class="{
                'text-gray-900 font-bold': day.isCurrentMonth,
                'text-gray-500': !day.isCurrentMonth
              }"
              class="text-right p-1"
            >
              {{ day.dayOfMonth }}
            </div>

            <div v-if="day.events && day.events.length" class="space-y-0.5">
              <div
                v-for="event in day.events"
                :key="event.id"
                :class="[event.color, 'shadow-md']"
                class="w-full text-white text-xs px-1 py-0.5 rounded-sm truncate cursor-pointer hover:opacity-90 transition-opacity"
                :title="event.title"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Watermark -->
    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10 z-0"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-60 sm:w-96" />
    </div>

    <!-- Modal -->
    <AddEventModal
      :is-visible="showAddEventModal"
      @close="showAddEventModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AddEventModal from "../components/AddEventModal.vue";
import { useScheduleLogic } from "../composables/useScheduleLogic.js";

const {
  dayNames,
  showAddEventModal,
  currentMonthYearDisplay,
  calendarDays,
  nextMonth,
  previousMonth,
} = useScheduleLogic();

const selectedDay = ref(null);

const selectDay = (day) => {
  selectedDay.value = day;
};
</script>
