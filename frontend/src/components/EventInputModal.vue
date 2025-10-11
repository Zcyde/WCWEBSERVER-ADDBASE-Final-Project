<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
      <h3 class="text-xl font-bold mb-4 text-gray-800">{{ isEditing ? (props.event.folderId ? 'Edit Planner Event' : 'Edit Schedule Event') : 'Add New Event' }}</h3>

      <form @submit.prevent="submitEvent" class="space-y-4">
        <div>
          <label for="eventTitle" class="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            id="eventTitle"
            v-model="newEvent.title"
            type="text"
            required
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="eventDate" class="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            id="eventDate"
            v-model="newEvent.date"
            type="date"
            required
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>



        <div>
          <label for="eventColor" class="block text-sm font-medium text-gray-700">Color</label>
          <select
            id="eventColor"
            v-model="newEvent.color"
            class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bg-indigo-500">Indigo (Default)</option>
            <option value="bg-gray-500">Gray</option>
            <option value="bg-red-500">Red</option>
            <option value="bg-blue-500">Blue</option>
            <option value="bg-teal-500">Teal</option>
            <option value="bg-pink-500">Pink</option>
            <option value="bg-orange-500">Orange</option>
            <option value="bg-green-500">Green</option>
            <option value="bg-purple-500">Purple</option>
          </select>
        </div>

        <div :class="['flex items-center pt-2', isEditing && !props.event.folderId ? 'justify-between' : 'justify-end']">
          <button
            v-if="isEditing && !props.event.folderId"
            type="button"
            @click="deleteEvent"
            class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >Delete Event</button>
          <div class="flex space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Cancel</button>
            <button
              type="submit"
              class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >{{ isEditing ? 'Update Event' : 'Add Event' }}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import { store } from "../eventStore.js";
import { calendarState } from "../calendarLogic.js";

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  event: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "event-added", "event-updated", "event-deleted"]);

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const defaultDate = calendarState.viewDate || new Date();
  const dateObj = defaultDate instanceof Date ? defaultDate : new Date();

  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(dateObj.getDate()).padStart(2, "0")}`;
};

const newEvent = reactive({
  title: "",
  date: getTodayDateString(),
  color: "bg-indigo-500",
});

const isEditing = computed(() => !!props.event);

// Resets form state when the modal opens
watch(
  () => props.isVisible,
  () => {
    if (props.isVisible) {
      if (props.event) {
        newEvent.title = props.event.title || "";
        newEvent.date = props.event.date ? props.event.date.split("T")[0] : getTodayDateString();
        newEvent.color = props.event.color || "bg-indigo-500";
      } else {
        newEvent.title = "";
        newEvent.date = getTodayDateString();
        newEvent.color = "bg-indigo-500";
      }
    }
  },
  { immediate: true }
);

const submitEvent = async () => {
  if (!newEvent.title || !newEvent.date) return;

  // Construct the data object without folderId for standalone events
  const eventData = {
    title: newEvent.title,
    date: newEvent.date,
    color: newEvent.color,
    // No folderId for standalone events
  };

  if (isEditing.value) {
    // Update existing event
    await store.updateEvent(props.event._id, eventData);
    emit("close");
    emit("event-updated");
  } else {
    // Add new event
    await store.addEvent(eventData);
    emit("close");
    emit("event-added");
  }
};

const deleteEvent = async () => {
  if (confirm("Are you sure you want to delete this event?")) {
    await store.deleteEvent(props.event._id);
    emit("close");
    emit("event-deleted");
  }
};
</script>
