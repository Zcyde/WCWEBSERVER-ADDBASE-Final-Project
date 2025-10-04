<template>
  <div class="relative min-h-screen p-4 sm:p-8">
    <!-- Header with Back Button -->
    <div class="flex items-center space-x-4 mb-8">
      <button
        @click="$emit('back-to-list')"
        class="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        title="Back to all planners"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h2 class="text-3xl font-bold flex items-center">
        Plans in:
        <span
          :class="[folder.color]"
          class="ml-3 px-3 py-1 rounded-lg text-white text-2xl font-semibold shadow-md"
        >
          {{ folder.name }}
        </span>
      </h2>
    </div>

    <!-- Add Plan Button -->
    <div class="flex justify-end mb-6">
      <button
        @click="showModal = true"
        class="py-3 px-6 rounded-full text-base font-medium bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-700 shadow-lg text-white hover:shadow-xl hover:from-blue-500 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add New Plan
      </button>
    </div>

    <!-- Plan List -->
    <div v-if="filteredPlans.length" class="space-y-4 mb-10">
      <div
        v-for="plan in filteredPlans"
        :key="plan.id"
        class="bg-white p-4 rounded-xl shadow-md border-l-4 cursor-pointer hover:bg-gray-100 transition"
        :class="[getBorderClass(plan.color)]"
        @click="openTimerModal(plan)"
      >
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold">{{ plan.title }}</p>
          <span class="text-sm font-mono text-gray-600">{{ plan.date }}</span>
        </div>
        <div class="flex justify-between items-center text-sm mt-1 text-gray-600">
          <span>{{ plan.time }}</span>
          <div
            :class="[plan.color]"
            class="text-xs text-white px-2 py-0.5 rounded-full font-medium shadow-sm"
          >
            {{ plan.type }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-10 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 mb-10"
    >
      <p class="text-xl font-medium text-gray-600">This planner is empty. Start adding your tasks!</p>
    </div>

    <!-- Create Plan Modal -->
    <PlanInputModal :is-visible="showModal" :folder="folder" @close="showModal = false" @event-added="loadEvents" />

    <!-- ✅ Timer Overlay Modal -->
    <div
      v-if="isTimerModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <!-- Close button -->
        <button
          @click="closeTimerModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close timer"
          title="Close"
        >
          ✕
        </button>

        <!-- Task Title -->
        <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">
          {{ selectedPlan?.title || 'Task' }}
        </h3>
        <p class="text-sm text-gray-500 mb-6 text-center">
          Focus timer for this task
        </p>

        <!-- Timer Display -->
        <div class="text-center mb-6">
          <div class="text-5xl font-mono font-bold text-gray-900">
            {{ formattedTime }}
          </div>
          <div v-if="isBreak" class="text-sm text-blue-600 font-semibold mt-2">
            Break Time
          </div>
          <div v-else-if="selectedDurationKey" class="text-sm text-green-600 font-semibold mt-2">
            Study Time
          </div>
        </div>

        <!-- Duration Select Buttons -->
        <div class="flex justify-center gap-2 mb-6">
          <button
            @click="resetTimer('25m')"
            class="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            25m
          </button>
          <button
            @click="resetTimer('1h')"
            class="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            1h
          </button>
          <button
            @click="resetTimer('2h')"
            class="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            2h
          </button>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-3">
          <button
            @click="startTimer"
            class="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow hover:bg-green-600 transition"
          >
            Start
          </button>
          <button
            @click="pauseTimer"
            class="px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow hover:bg-yellow-600 transition"
          >
            Pause
          </button>
          <button
            @click="clearTimer"
            class="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { store } from "../eventStore.js";
import PlanInputModal from "./PlanInputModal.vue";

const props = defineProps({
  folder: { type: Object, required: true },
});
defineEmits(["back-to-list"]);

const showModal = ref(false);

/* ---------- Plans ---------- */
const filteredPlans = ref([]);

const loadEvents = async () => {
  filteredPlans.value = await store.loadEventsByFolder(props.folder._id);
};

onMounted(() => {
  loadEvents();
});

watch(() => props.folder._id, () => {
  loadEvents();
});

const getBorderClass = (colorClass) => colorClass.replace("bg-", "border-");

/* ---------- Timer Modal State ---------- */
const isTimerModalOpen = ref(false);
const selectedPlan = ref(null);

/* ---------- Per-task timers ---------- */
const timers = ref({});
const intervalId = ref(null);
const isBreak = ref(false);
const selectedDurationKey = ref(null);

/* Study & Break Durations */
const studyOptions = {
  "25m": 25 * 60,
  "1h": 60 * 60,
  "2h": 2 * 60 * 60,
};

const breakOptions = {
  "25m": 5 * 60,
  "1h": 10 * 60,
  "2h": 25 * 60,
};

/* Computed time display */
const formattedTime = computed(() => {
  if (!selectedPlan.value) return "--:--";
  const seconds = timers.value[selectedPlan.value.id];
  if (!seconds && seconds !== 0) return "--:--";
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
});

/* Open Timer Modal */
const openTimerModal = (plan) => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  selectedPlan.value = plan;
  isBreak.value = false;
  selectedDurationKey.value = null;
  isTimerModalOpen.value = true;
};

/* Close Timer Modal */
const closeTimerModal = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  isTimerModalOpen.value = false;
};

/* Tick function */
const tick = () => {
  const id = selectedPlan.value?.id;
  if (!id) return;
  const current = timers.value[id];
  if (current > 0) {
    timers.value[id] = current - 1;
  } else {
    clearInterval(intervalId.value);
    intervalId.value = null;

    if (!isBreak.value) {
      const breakSec = breakOptions[selectedDurationKey.value] || 0;
      timers.value[id] = breakSec;
      isBreak.value = true;
      startTimer();
      alert("Study time finished! Break starts now.");
    } else {
      alert("Break finished! Timer stopped.");
      isBreak.value = false;
      timers.value[id] = null;
    }
  }
};

/* Start Timer */
const startTimer = () => {
  if (!selectedPlan.value) return;
  const id = selectedPlan.value.id;
  if ((!timers.value[id] && timers.value[id] !== 0) || !selectedDurationKey.value) {
    alert("Select a duration first!");
    return;
  }
  if (!intervalId.value) {
    intervalId.value = setInterval(tick, 1000);
  }
};

/* Pause Timer */
const pauseTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
};

/* Clear Timer */
const clearTimer = () => {
  if (!selectedPlan.value) return;
  const id = selectedPlan.value.id;
  timers.value[id] = null;
  isBreak.value = false;
  selectedDurationKey.value = null;
  pauseTimer();
};

/* Reset Timer (sets new duration) */
const resetTimer = (durationKey) => {
  if (!selectedPlan.value) return;
  const id = selectedPlan.value.id;
  timers.value[id] = studyOptions[durationKey];
  selectedDurationKey.value = durationKey;
  isBreak.value = false;
  pauseTimer();
};
</script>
