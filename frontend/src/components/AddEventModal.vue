<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
      <h3 class="text-xl font-bold mb-4 text-gray-800">Add New Schedule Event</h3>

      <form @submit.prevent="submitEvent" class="space-y-4">
        <div>
          <label for="eventTitle" class="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            id="eventTitle"
            v-model="newEvent.title"
            type="text"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="eventDate" class="block text-sm font-medium text-gray-700">Date</label>
          <input
            id="eventDate"
            v-model="newEvent.date"
            type="date"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="eventColor" class="block text-sm font-medium text-gray-700">Color</label>
          <select
            id="eventColor"
            v-model="newEvent.color"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
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
          >Save Event</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { store } from "../eventStore.js";
import { calendarState } from "../calendarLogic.js";

export default {
  name: "AddEventModal",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      newEvent: this.getNewEventFormDefaults(),
    };
  },
  watch: {
    // Reset the form whenever the modal is opened
    isVisible(newVal) {
      if (newVal) {
        this.newEvent = this.getNewEventFormDefaults();
      }
    },
  },
  methods: {
    getNewEventFormDefaults() {
      // Set default date to the currently viewed month/year
      const defaultDate = calendarState.viewDate || new Date();
      // Format: YYYY-MM-DD
      const defaultDateString = `${defaultDate.getFullYear()}-${String(
        defaultDate.getMonth() + 1
      ).padStart(2, "0")}-${String(defaultDate.getDate()).padStart(2, "0")}`;

      return {
        title: "",
        date: defaultDateString,
        color: "bg-indigo-500",
      };
    },
    submitEvent() {
      // 1. Add event to the global store
      store.addEvent({ ...this.newEvent });

      // 2. Emit the close event to the parent (Schedule.vue)
      this.$emit("close");
    },
  },
};
</script>