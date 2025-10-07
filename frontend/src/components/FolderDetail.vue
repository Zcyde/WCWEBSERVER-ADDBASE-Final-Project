<template>
  <div class="relative min-h-screen p-4 sm:p-8">
    <div class="flex items-center space-x-4 mb-8">
      <button
        @click="$emit('back-to-list')"
        class="p-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
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
          class="ml-3 px-3 py-1 text-white text-2xl font-semibold shadow-md"
        >
          {{ folder.name }}
        </span>
      </h2>
    </div>

    <div class="flex justify-end mb-6">
      <button
        @click="showModal = true"
        class="py-3 px-6 text-base font-medium bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-700 shadow-lg text-white hover:shadow-xl hover:from-blue-500 transition-all"
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
        class="bg-white p-4 shadow-md border-l-4 cursor-pointer hover:bg-gray-100 transition"
        :class="[getBorderClass(plan.color)]"
        @click="openActionModal(plan)"
      >
        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold">{{ plan.title }}</p>
          <span class="text-sm font-mono text-gray-600">{{ plan.date }}</span>
        </div>
        <div class="flex justify-between items-center text-sm mt-1 text-gray-600">
          <span>{{ plan.time }}</span>
          <div
            :class="[plan.color]"
            class="text-xs text-white px-2 py-0.5 font-medium shadow-sm"
          >
            {{ plan.type }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-10 bg-white shadow-lg border-2 border-dashed border-gray-300 mb-10"
    >
      <p class="text-xl font-medium text-gray-600">This planner is empty. Start adding your tasks!</p>
    </div>

    <PlanInputModal :is-visible="showModal" :folder="folder" @close="showModal = false" />

    <div
      v-if="isActionModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div
        class="relative bg-white shadow-2xl w-full p-8"
        :class="{
          'max-w-2xl': currentActionView === 'file-viewer',
          'max-w-md': currentActionView !== 'file-viewer'
        }"
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

        <!-- (rest of your component unchanged — only rounded classes removed throughout) -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, toRaw } from "vue";
import { store } from "../eventStore.js";
import PlanInputModal from "./PlanInputModal.vue";

const props = defineProps({
  folder: { type: Object, required: true },
});
defineEmits(["back-to-list"]);

const showModal = ref(false);
const filteredPlans = computed(() =>
  store.events.filter((event) => event.folderId === props.folder.id)
);
const getBorderClass = (colorClass) => colorClass.replace("bg-", "border-");

// rest of your script unchanged
</script>
