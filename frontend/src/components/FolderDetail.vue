<template>
  <div class="relative min-h-screen p-4 sm:p-8">
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

    <div v-if="filteredPlans.length" class="space-y-4 mb-10">
      <div
        v-for="plan in filteredPlans"
        :key="plan.id"
        class="bg-white p-4 rounded-xl shadow-md border-l-4 cursor-pointer hover:bg-gray-100 transition"
        :class="[getBorderClass(plan.color)]"
        @click="openActionModal(plan)" >
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold">{{ plan.title }}</p>
        ono text-gray-600">{{ plan.date }}</span>
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

    <PlanInputModal :is-visible="showModal" :folder="folder" @close="showModal = false" />

    <div
      v-if="isActionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full p-8"
        :class="{'max-w-2xl': currentActionView === 'file-viewer', 'max-w-md': currentActionView !== 'file-viewer'}"
      >
        <button
          @click="closeActionModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>

        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">
          {{ selectedPlan?.title || 'Planner Task' }}
        </h3>

        <div v-if="currentActionView === 'selection'">
          <p class="text-lg text-gray-600 mb-6 text-center font-medium">What would you like to do?</p>
          <div class="flex flex-col space-y-4">
            
            <button
              @click="switchToUpdateFiles"
              class="w-full py-3 px-6 rounded-xl text-lg font-bold bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5.5 13a.5.5 0 01.5-.5h2.5a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" />
                <path fill-rule="evenodd" d="M12.414 5.942a2 2 0 00-2.617-2.617l-3.35 3.35A1.5 1.5 0 005 8.707v3.586A1.5 1.5 0 006.293 14H9V8a1 1 0 011-1h5a1 1 0 011 1v6h-1.707a1.5 1.5 0 00-1.06-.44L12.414 14.058zm3.08-3.081a1.5 1.5 0 011.06 2.12l-1.414 1.414a.5.5 0 11-.707-.707l1.414-1.414a.5.5 0 00-.707-.707L13.84 4.888a.5.5 0 01.707-.707zM11 9H9v2h2V9z" clip-rule="evenodd" />
              </svg>
              <span>Update Files (U)</span>
            </button>
            <div v-if="selectedPlan?.plannerFiles?.length">
              <h4 class="text-base font-semibold text-gray-800 mb-2">Review Files:</h4>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
                <button
                  v-for="file in files"
                  :key="file.url"
                  @click="openFileViewer(file)"
                  class="w-full text-left py-3 px-4 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition flex items-center justify-between"
                >
                  <span class="truncate">{{ file.name }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L16.586 7A2 2 0 0118 8.414v8.586a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm8 1v2a1 1 0 001 1h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1zm-2 9a1 1 0 100 2h4a1 1 0 100-2h-4z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              <div class="border-t border-gray-200 my-4"></div>
            </div>
            
            <div v-else class="text-center text-sm text-gray-500 mb-4">
                No files attached to this plan.
            </div>


            <button
              @click="switchToTimer"
              class="w-full py-4 px-6 rounded-xl text-lg font-bold bg-green-500 text-white shadow-lg hover:bg-green-600 transition flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Start Pomodoro Timer</span>
            </button>
          </div>
        </div>
        
        <div v-else-if="currentActionView === 'file-update'">
          <button
            @click="backToSelection"
            class="p-1 mb-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition absolute left-3 top-3"
            title="Back to selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <h4 class="text-lg font-semibold text-gray-700 mb-4 text-center">Manage Files</h4>

          <div v-if="localPlannerFiles.length" class="mb-4 max-h-40 overflow-y-auto border p-3 rounded-lg bg-gray-50">
            <h5 class="text-sm font-semibold text-gray-600 mb-2">Currently Attached:</h5>
            <ul class="space-y-1">
              <li v-for="(file, index) in files" :key="file.url" class="flex items-center justify-between text-sm text-gray-700 bg-white p-2 rounded-md shadow-sm">
                <span class="truncate">{{ file.name }}</span>
                <button
                  @click="removePlannerFile(index)"
                  class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition ml-2"
                  title="Remove file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
          <div class="space-y-4">
            <div>
              <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-2">Add New File(s)</label>
              <input
                id="fileUpload"
                type="file"
                multiple
                @change="handleFileUpload"
                class="block w-full text-sm text-gray-50
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-500 file:text-white
                  hover:file:bg-blue-600 transition duration-150"
              />
            </div>

            <div v-if="filesToUpload.length" class="mt-4">
                <h5 class="text-sm font-semibold text-gray-700 mb-2">New Files Staged for Upload:</h5>
                <ul class="space-y-1">
                    <li v-for="(file, index) in filesToUpload" :key="index" class="text-sm flex justify-between items-center text-gray-600 bg-yellow-50 p-2 rounded-md">
                        <span class="truncate">{{ file.name }}</span>
                        <button @click="removeStagedFile(index)" class="text-red-500 hover:text-red-700 text-xs ml-2">Remove</button>
                    </li>
                </ul>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="saveUpdatedFiles"
                :disabled="!filesToUpload.length && !hasRemovedFiles"
                :class="{'opacity-50 cursor-not-allowed': !filesToUpload.length && !hasRemovedFiles}"
                class="py-2 px-4 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-lg transition"
              >
                Save Changes (Update Plan)
              </button>
            </div>
          </div>
        </div>
        <div v-else-if="currentActionView === 'file-viewer'">
          <button
            @click="backToSelection"
            class="p-1 mb-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition absolute left-3 top-3"
            title="Back to selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <h4 class="text-lg font-semibold text-gray-700 mb-4 text-center">Viewing: {{ selectedFile?.name }}</h4>

          <div v-if="selectedFile && selectedFile.url" class="w-full h-96">
            <embed
              :src="selectedFile.url"
              type="application/pdf"
              class="w-full h-full border rounded-lg"
              title="File Viewer"
            />
          </div>
          <div v-else class="text-center text-gray-500">
            Unable to display file.
          </div>
        </div>

        <div v-else-if="currentActionView === 'timer'">
          <button
            @click="backToSelection"
            class="p-1 mb-4 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition absolute left-3 top-3"
            title="Back to selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          <p class="text-sm text-gray-500 mb-6 text-center">Focus timer for this task</p>

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
  </div>
</template>

<script setup>
import { computed, ref, toRaw } from "vue";
import { store } from "../eventStore.js";
import PlanInputModal from "./PlanInputModal.vue";
/* Removed import of non-existent FileViewer.vue */
// import FileViewer from "./FileViewer.vue";

const props = defineProps({
  folder: { type: Object, required: true },
});
defineEmits(["back-to-list"]);

const showModal = ref(false);

/* ---------- Plans ---------- */
const filteredPlans = computed(() =>
  store.events.filter((event) => event.folderId === props.folder.id)
);

const getBorderClass = (colorClass) => colorClass.replace("bg-", "border-");

/* ---------- Action Modal State (NEW) ---------- */
const isActionModalOpen = ref(false);
const selectedPlan = ref(null);
const currentActionView = ref('selection'); // 'selection', 'timer', 'file-viewer', or 'file-update'
const selectedFile = ref(null);

// 🔑 NEW: File Update State
const filesToUpload = ref([]);
const hasRemovedFiles = ref(false);
const localPlannerFiles = ref([]);

// Computed files for display
const files = computed(() => {
  return localPlannerFiles.value.map(url => ({ url, name: url.split('/').pop() }));
});


/* ---------- Per-task timers (EXISTING) ---------- */
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

/* 🔑 Open Action Modal */
const openActionModal = (plan) => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  selectedPlan.value = plan;
  localPlannerFiles.value = [...(plan.plannerFiles || [])];
  isBreak.value = false;
  selectedDurationKey.value = null;
  currentActionView.value = 'selection';
  // Reset file upload states
  filesToUpload.value = [];
  hasRemovedFiles.value = false;
  isActionModalOpen.value = true;
};

/* 🔑 Close Action Modal */
const closeActionModal = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
  isActionModalOpen.value = false;
  currentActionView.value = 'selection';
  selectedFile.value = null;
  // Clear file upload states
  filesToUpload.value = [];
  hasRemovedFiles.value = false;
};

/* 🔑 NEW: Switches to the file update view */
const switchToUpdateFiles = () => {
  currentActionView.value = 'file-update';
};

/* 🔑 NEW: Handler for file input change (adds files to staging) */
const handleFileUpload = (event) => {
  filesToUpload.value = [...filesToUpload.value, ...Array.from(event.target.files)];
  // Clear the input field so the same file can be selected again
  event.target.value = '';
};

/* 🔑 NEW: Removes a file from the staging area */
const removeStagedFile = (index) => {
  filesToUpload.value.splice(index, 1);
};

/* 🔑 NEW: Removes an existing file from the plan (prepares for update) */
const removePlannerFile = (index) => {
  localPlannerFiles.value.splice(index, 1);
  hasRemovedFiles.value = true;
};

/* 🔑 NEW: Saves the file changes (The 'U' in CRUD) */
/* 🔑 REPLACED: Saves the file changes using FormData */
/* 🔑 FINAL FIX: Saves the file changes using FormData with clear file lists */
const saveUpdatedFiles = async () => {
    if (!selectedPlan.value) return;

    // 1. Create a FormData object.
    const formData = new FormData();

    // 2. Append new files to the FormData object under the key 'files'.
    filesToUpload.value.forEach((file) => {
        formData.append(`files`, file);
    });

    // 3. Convert the reactive plan object to a clean, non-reactive JavaScript object.
    const planData = toRaw(selectedPlan.value);

    // 4. Construct the final update object for the backend JSON payload.
    // Convert plannerFiles to array of strings (URLs) only
    const plannerFilesUrls = localPlannerFiles.value.map(file => {
        if (typeof file === 'string') return file;
        if (file.url) return file.url;
        return '';
    }).filter(url => url !== '');

    const updateObject = {
        // Spread the clean object to include all event fields (title, date, color, etc.)
        ...planData,
        // CRITICAL: Ensure the plannerFiles array is correct (it holds the retained files as URLs)
        plannerFiles: plannerFilesUrls,
    };

    // Clean up temporary/Mongoose properties before sending
    // These properties should come from the URL/DB, not the body data.
    delete updateObject.id;
    delete updateObject._id;

    // 5. Append the FULL event object as a JSON string under the key 'data'.
    formData.append('data', JSON.stringify(updateObject));

    // 6. Call the store function with the Plan ID and the FormData object.
    try {
        await store.updateEventWithFiles(selectedPlan.value._id, formData);

        // SUCCESS CLEANUP (existing logic)
        filesToUpload.value = [];
        hasRemovedFiles.value = false;
        currentActionView.value = 'selection';

    } catch (error) {
        console.error("Error updating plan with files:", error);
        alert("Failed to update plan. See console for details.");
    }
};
/* 🔑 END NEW: File Management Methods */

/* 🔑 NEW: Switches to the timer view */
const switchToTimer = () => {
  currentActionView.value = 'timer';
  selectedFile.value = null;
};

/* 🔑 NEW: Sets the file and switches to the viewer view */
const openFileViewer = (file) => {
    selectedFile.value = file;
    currentActionView.value = 'file-viewer';
};

/* 🔑 NEW: Switches back to the main selection screen */
const backToSelection = () => {
    // Clear timer state if going back from timer view
    if (currentActionView.value === 'timer') {
      clearTimer();
    }
    // Clear file update state if going back from update view
    filesToUpload.value = [];
    hasRemovedFiles.value = false;
    localPlannerFiles.value = [...(selectedPlan.value.plannerFiles || [])];
    currentActionView.value = 'selection';
    selectedFile.value = null;
}

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
