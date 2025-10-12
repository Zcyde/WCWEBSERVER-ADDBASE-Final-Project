<template>
  <div class="relative min-h-screen bg-white">
    <div class="p-4 sm:p-6">
      <!-- ================== HEADER ================== -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 mb-6 border-b border-gray-300 gap-3"
      >
        <!-- Month/Week Navigation -->
        <div class="flex items-center justify-center sm:justify-start space-x-4">
          <button
            class="text-3xl font-bold text-gray-700 hover:text-blue-600 transition-colors p-2"
            @click="goPrevious"
          >
            &lt;
          </button>

          <div
            class="py-2 px-6 sm:px-8 border border-gray-300 font-sans text-xl font-bold text-gray-800 bg-gray-100 shadow-md"
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

        <!-- View Toggle -->
        <div class="flex gap-2">
          <button
            class="py-1 px-4 text-sm font-medium bg-gray-200 border border-gray-300 rounded-lg shadow-md hover:shadow-lg"
            @click="toggleView"
          >
            {{ currentView === 'monthly' ? 'Weekly View' : 'Monthly View' }}
          </button>
          <button
            class="py-1 px-4 text-sm font-medium bg-blue-500 text-white border border-blue-600 rounded-lg shadow-md hover:shadow-lg"
            @click="editingEvent = null; showEventModal = true"
          >
            Add Event
          </button>
        </div>
      </div>

      <!-- ================== WEEKLY VIEW ================== -->
      <div v-if="currentView === 'weekly'" class="overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-1 bg-slate-800 p-2 font-bold text-center text-sm min-w-[700px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="'week-dayname-' + dayName"
            class="col-span-1 bg-blue-500 text-white font-normal py-4 px-2 border-slate-400"
          >
            {{ dayName }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1 min-w-[700px]">
          <div
            v-for="(day, index) in calendarDays"
            :key="'week-day-' + index"
            :class="{
              'bg-white border-b border-l border-slate-400': day.isCurrentMonth,
              'bg-gray-100 border-b border-l border-slate-400 opacity-70': !day.isCurrentMonth,
              'border-r border-slate-400': (index + 1) % 7 === 0
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

            <!-- Weekly: Scrollable Events -->
            <div
              v-if="day.events && day.events.length"
              class="space-y-0.5 overflow-y-auto max-h-30 pr-1"
            >
              <div
                v-for="(event, index) in day.events"
                :key="'week-event-' + index"
                :class="[event.color, 'shadow-md rounded-sm']"
                class="w-full text-white text-xs px-1 py-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
                :title="event.title"
                @click.stop="handleEventClick(event)"
              >
                {{ event.folderId ? '📁' : '🗓️' }} {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================== MONTHLY VIEW ================== -->
      <div v-else class="hidden sm:block overflow-x-auto">
        <div
          class="grid grid-cols-7 gap-1 bg-slate-800 p-2 font-bold text-center text-sm min-w-[700px]"
        >
          <div
            v-for="dayName in dayNames"
            :key="dayName"
            class="col-span-1 bg-blue-500 text-white font-normal py-3 px-2 border-slate-400"
          >
            {{ dayName }}
          </div>
          </div>

          <div class="grid grid-cols-7 gap-1 min-w-[700px]">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              :class="{
                'bg-white border-b border-l border-slate-400': day.isCurrentMonth,
                'bg-gray-100 border-b border-l border-slate-400 opacity-70': !day.isCurrentMonth,
                'border-r border-slate-400': (index + 1) % 7 === 0
              }"
              class="col-span-1 h-24 p-2 text-left relative overflow-hidden text-xs"
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

            <!-- Monthly: Scrollable Events -->
            <div
              v-if="day.events && day.events.length"
              class="space-y-0.5 overflow-y-auto max-h-12 pr-1"
            >
              <div
                v-for="(event, index) in day.events"
                :key="'month-event-' + index"
                :class="[event.color, 'shadow-md rounded-sm']"
                class="w-full text-white text-xs px-1 py-0.5 truncate cursor-pointer hover:opacity-90 transition-opacity"
                :title="event.title"
                @click.stop="handleEventClick(event)"
              >
                {{ event.folderId ? '📁' : '🗓️' }} {{ event.title }}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ================== WATERMARK ================== -->
    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10 z-0"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-60 sm:w-96" />
    </div>

    <!-- Event Modal -->
    <EventInputModal
      :is-visible="showEventModal"
      :event="editingEvent"
      @close="showEventModal = false"
      @event-added="onEventAdded"
      @event-updated="editingEvent = null"
      @event-deleted="onEventDeleted"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useScheduleLogic } from "../composables/useScheduleLogic.js";
import EventInputModal from "../components/EventInputModal.vue";

const scheduleLogic = useScheduleLogic();

const {
  dayNames,
  currentMonthYearDisplay,
  calendarDays,
  toggleView,
  goNext,
  goPrevious,
  currentView,
} = scheduleLogic;

const showEventModal = ref(false);
const editingEvent = ref(null);

// Click event handler for both weekly and monthly view
const handleEventClick = (event) => {
  console.log("Clicked event:", event);
  editingEvent.value = event;
  showEventModal.value = true;
};

const onEventAdded = () => {
  // Events are reactive, so calendar should update automatically
  console.log("Event added");
};

const onEventDeleted = () => {
  // Events are reactive, so calendar should update automatically
  console.log("Event deleted");
  editingEvent.value = null;
};
</script>
