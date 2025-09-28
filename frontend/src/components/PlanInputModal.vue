<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
      <h3 class="text-xl font-bold mb-4 text-gray-800">
        Add Plan to:
        <span
          :class="[folder.color]"
          class="px-2 py-0.5 rounded-md text-white text-base font-medium"
        >{{ folder.name }}</span>
      </h3>

      <form @submit.prevent="submitPlan" class="space-y-4">
        <div>
          <label for="planTitle" class="block text-sm font-medium text-gray-700">Plan/Task Title</label>
          <input
            id="planTitle"
            v-model="newPlan.title"
            type="text"
            required
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="planDate" class="block text-sm font-medium text-gray-700">Target Date</label>
          <input
            id="planDate"
            v-model="newPlan.date"
            type="date"
            required
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="planColor"
            class="block text-sm font-medium text-gray-700"
          >Override Color (Optional)</label>
          <select
            id="planColor"
            v-model="newPlan.color"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="folder.color">Use Folder Color</option>
            <option value="bg-red-500">Red</option>
            <option value="bg-blue-500">Blue</option>
            <option value="bg-teal-500">Teal</option>
            <option value="bg-pink-500">Pink</option>
            <option value="bg-orange-500">Orange</option>
            <option value="bg-indigo-500">Indigo (Default)</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >Cancel</button>
          <button
            type="submit"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >Add to Schedule</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { store } from "../eventStore.js";
import { calendarState } from "../calendarLogic.js";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  folder: {
    type: Object,
    required: true,
    default: () => ({ id: null, name: "New Plan", color: "bg-gray-500" }),
  },
});

const emit = defineEmits(["close"]);

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const defaultDate = calendarState.viewDate || new Date();
  // Ensure the object used for date parts is a valid Date object if calendarState.viewDate is null
  const dateObj = defaultDate instanceof Date ? defaultDate : new Date();

  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

const newPlan = reactive({
  title: "",
  date: getTodayDateString(),
  color: props.folder.color,
});

// Resets form state when the modal opens or the folder changes
watch(
  [() => props.isVisible, () => props.folder.color],
  () => {
    if (props.isVisible) {
      newPlan.title = "";
      newPlan.date = getTodayDateString();
      newPlan.color = props.folder.color; // Set default color to the current folder's color
    }
  },
  { immediate: true }
);

const submitPlan = async () => {
  if (!newPlan.title || !newPlan.date) return;

  // 1. Construct the data object *without* a client-side ID. The backend will assign it.
  const planData = {
    title: newPlan.title,
    date: newPlan.date,
    color: newPlan.color,
    folderId: props.folder.id,
    // REMOVED: id: `e-${Date.now()}`
  };

  // 2. Add event to the global store and WAIT for the API call to complete.
  // The store receives the complete object (including the new backend ID)
  // and pushes it into the reactive array.
  await store.addEvent(planData);

  // 3. Emit the close event to the parent.
  emit("close");
};
</script>
