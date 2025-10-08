<template>
  <div class="relative min-h-screen bg-white">
    <div class="p-4 sm:p-6">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 mb-6 border-b border-black-400 gap-3"
      >
        <!-- Month/Week Navigation -->
        <div class="flex items-center justify-center sm:justify-start space-x-4">
          <button
            class="text-3xl font-bold text-black-700 hover:text-blue-600 transition-colors p-2"
            @click="goPrevious"
          >
            &lt;
          </button>

          <div
            class="py-2 px-6 sm:px-8 border-2 border-black-600 font-sans text-lg sm:text-xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
          >
            {{ currentMonthYearDisplay }}
          </div>

          <button
            class="text-3xl font-bold text-black-700 hover:text-blue-600 transition-colors p-2"
            @click="goNext"
          >
            &gt;
          </button>
        </div>

        <!-- View Toggle + Add Event -->
        <div class="flex gap-2">
          <button
            class="py-1 px-4 text-sm font-medium bg-gray-200 border border-black-500 shadow-md hover:shadow-lg"
            @click="toggleView"
          >
            {{ currentView === 'monthly' ? 'Weekly View' : 'Monthly View' }}
          </button>

          <button
            class="py-1 px-4 text-sm font-medium bg-gradient-to-b from-gray-100 to-gray-300 border border-black-500 shadow-md text-black-700 hover:shadow-lg"
            @click="showAddEventModal = true"
          >
            + add event
          </button>
        </div>
      </div>

      <!-- ================== CALENDAR SECTION ================== -->
      <!-- Weekly View -->
      <div v-if="currentView === 'weekly'" class="overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-1 bg-[#192E47] p-2 font-bold text-center text-sm min-w-[700px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="'week-dayname-' + dayName"
            class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-[#8192A9]"
          >
            {{ dayName }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1 min-w-[700px]">
          <div
            v-for="(day, index) in calendarDays"
            :key="'week-day-' + index"
            :class="{
              'bg-white border-b border-l border-[#8192A9]': day.isCurrentMonth,
              'bg-gray-100 border-b border-l border-[#8192A9] opacity-70': !day.isCurrentMonth,
              'border-r border-[#8192A9]': (index + 1) % 7 === 0
            }"
            class="col-span-1 h-40 p-1 text-left relative overflow-hidden text-xs"
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
                :key="'week-event-' + event.id"
                :class="[event.color, 'shadow-md']"
                class="w-full text-white text-xs px-1 py-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
                :title="event.title"
              >
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly View (original desktop layout) -->
      <div v-else class="hidden sm:block overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-1 bg-[#192E47] p-2 font-bold text-center text-sm min-w-[700px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-[#8192A9]"
          >
            {{ dayName }}
          </div>
        </div>

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
                class="w-full text-white text-xs px-1 py-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
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

    <!-- Add Event Modal -->
    <AddEventModal :is-visible="showAddEventModal" @close="showAddEventModal = false" />
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
  toggleView,
  goNext,
  goPrevious,
  currentView,
} = useScheduleLogic();
</script>
