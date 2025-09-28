<template>
  <div class="relative min-h-screen p-4 sm:p-8">
    <div
      class="flex justify-end items-center pt-8 pb-4 relative pr-4 border-b border-black-300 mb-4"
    >
      <!-- Planner Header -->
      <div
        class="absolute left-1/2 top-0 transform -translate-x-1/2 py-3 px-10 rounded-full border-2 border-black font-sans text-2xl font-bold text-gray-800 bg-gradient-to-b from-gray-200 to-gray-300 shadow-xl"
      >Planner</div>

      <!-- Button for creating a NEW FOLDER (only visible on list view) -->
      <button
        v-if="!selectedFolder"
        @click="showAddFolderModal = true"
        class="py-2 px-4 rounded-full text-base font-medium bg-gradient-to-b from-blue-400 to-blue-600 border border-blue-700 shadow-md text-white hover:shadow-lg hover:from-blue-500 transition-all z-10"
      >
        <!-- Plus Icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 inline mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Planner
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="mt-4">
      <!-- 1. FOLDER LIST VIEW (Shows when no folder is selected) -->
      <FolderList
        v-if="!selectedFolder"
        :folders="store.folders"
        @select-folder="handleFolderSelect"
      />

      <!-- 2. FOLDER DETAIL VIEW (Shows when a folder is selected) -->
      <FolderDetail v-else :folder="selectedFolder" @back-to-list="backToList" />
    </div>

    <!-- Add Folder Modal -->
    <div
      v-if="showAddFolderModal"
      class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showAddFolderModal = false"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md" @click.stop>
        <h3 class="text-xl font-bold mb-4 text-gray-800">Create New Planner Folder</h3>
        <form @submit.prevent="createFolder" class="space-y-5">
          <div>
            <label for="newFolderName" class="block text-base font-medium text-gray-700">Folder Name</label>
            <input
              id="newFolderName"
              v-model="newFolder.name"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base mt-1"
            />
          </div>
          <div>
            <label
              for="newFolderColor"
              class="block text-base font-medium text-gray-700"
            >Folder Color</label>
            <select
              id="newFolderColor"
              v-model="newFolder.color"
              class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base mt-1"
            >
              <option value="bg-gray-400">Gray (Default)</option>
              <option value="bg-red-600">Red</option>
              <option value="bg-blue-600">Blue</option>
              <option value="bg-indigo-600">Indigo</option>
              <option value="bg-green-600">Green</option>
              <option value="bg-purple-600">Purple</option>
            </select>
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="showAddFolderModal = false"
              class="py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 hover:bg-gray-100 transition"
            >Cancel</button>
            <button
              type="submit"
              class="py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition"
            >Create Folder</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { store } from "../eventStore.js"; // MUST match your store file name
// UPDATED to use the new composable name
import { usePlannerLogic } from "../composables/usePlannerLogic.js";

// Import Components (ensure these files exist in src/components/)
import FolderList from "../components/FolderList.vue";
import FolderDetail from "../components/FolderDetail.vue";

// Use the Composable to get state and methods
const {
  selectedFolder,
  showAddFolderModal,
  newFolder,
  handleFolderSelect,
  backToList,
  createFolder,
} = usePlannerLogic(); // UPDATED to use the new function name

// MANDATORY: Lifecycle hook to ensure data is loaded
onMounted(() => {
  // Only load data if the store is currently empty to prevent unnecessary API calls
  if (store.folders.length === 0) {
    store.loadData();
  }
});
</script>
