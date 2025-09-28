<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center space-x-4 mb-8">
      <button
        @click="$emit('back-to-list')"
        class="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        title="Back to all planners"
      >
        <!-- Back Arrow Icon -->
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
      <h2 class="text-3xl font-bold text-gray-800 flex items-center">
        Plans in:
        <span
          :class="[folder.color]"
          class="ml-3 px-3 py-1 rounded-lg text-white text-2xl font-semibold shadow-md"
        >{{ folder.name }}</span>
      </h2>
    </div>

    <!-- Controls: Add Plan Button -->
    <div class="flex justify-end mb-6">
      <button
        @click="showModal = true"
        class="py-3 px-6 rounded-full text-base font-medium bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-700 shadow-lg text-white hover:shadow-xl hover:from-blue-500 transition-all"
      >
        <!-- Plus Icon -->
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
    <div v-if="filteredPlans.length" class="space-y-4">
      <div
        v-for="plan in filteredPlans"
        :key="plan.id"
        class="bg-white p-4 rounded-xl shadow-md border-l-4"
        :class="[getBorderClass(plan.color)]"
      >
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold text-gray-700">{{ plan.title }}</p>
          <span class="text-sm font-mono text-gray-500">{{ plan.date }}</span>
        </div>
        <!-- Display other details -->
        <div class="flex justify-between items-center text-sm text-gray-500 mt-1">
          <span>{{ plan.time }}</span>
          <div
            :class="[plan.color]"
            class="text-xs text-white px-2 py-0.5 rounded-full font-medium shadow-sm"
          >{{ plan.type }}</div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="text-center py-10 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300"
    >
      <p class="text-xl text-gray-500 font-medium">This planner is empty. Start adding your tasks!</p>
    </div>

    <PlanInputModal :is-visible="showModal" :folder="folder" @close="showModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { store } from "../eventStore.js";
import PlanInputModal from "./PlanInputModal.vue";

const props = defineProps({
  folder: {
    type: Object,
    required: true,
  },
});

defineEmits(["back-to-list"]);

// STATE
const showModal = ref(false);

// COMPUTED PROPERTY
const filteredPlans = computed(() => {
  // Filter events from the global store based on the current folder ID
  return store.events.filter((event) => event.folderId === props.folder.id);
});

// METHOD
const getBorderClass = (colorClass) => {
  // Converts 'bg-red-500' to 'border-red-500' for the left border
  return colorClass.replace("bg-", "border-");
};
</script>
