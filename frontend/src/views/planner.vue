<template>
  <div class="relative min-h-screen bg-white">
    <div class="p-8">
      <div class="flex justify-end items-center pb-6 mb-8 pr-4 border-b border-black-400">
        <div
          class="absolute left-1/2 transform -translate-x-1/2 py-3 px-10 rounded-full border-2 border-black-600 font-sans text-2xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"
        >Planner</div>

        <button
          @click="showAddFolderModal = true"
          class="py-2 px-4 rounded-full text-base font-medium bg-gradient-to-b from-gray-100 to-gray-300 border border-black-500 shadow-md text-black-700 hover:shadow-lg"
        >+ add planner</button>
      </div>

      <div class="flex space-x-8 z-10 relative mt-20 justify-start flex-wrap">
        <div
          v-for="folder in store.folders"
          :key="folder.id"
          class="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-150"
          @click="openPlanModal(folder)"
        >
          <div
            :class="[folder.color]"
            class="w-28 h-24 rounded-md shadow-md flex items-center justify-center text-white text-sm font-semibold p-3 text-center"
          >{{ folder.name }}</div>
          <span class="mt-3 text-base font-medium">{{ folder.name.split(' ')[0] }}</span>
        </div>
      </div>
    </div>

    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10"
    >
      <img src="../test.png" alt="watermark" class="w-[28rem]" />
    </div>

    <PlanInputModal
      :is-visible="showPlanModal"
      :folder="selectedFolder"
      @close="showPlanModal = false"
    />

    <div
      v-if="showAddFolderModal"
      class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="showAddFolderModal = false"
    >
      <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
        <h3 class="text-2xl font-bold mb-6 text-gray-800">Create New Folder</h3>

        <form @submit.prevent="createFolder" class="space-y-5">
          <div>
            <label for="newFolderName" class="block text-base font-medium text-gray-700">Folder Name</label>
            <input
              id="newFolderName"
              v-model="newFolder.name"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <div>
            <label for="newFolderColor" class="block text-base font-medium text-gray-700">Folder Color</label>
            <select
              id="newFolderColor"
              v-model="newFolder.color"
              class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
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
              class="py-3 px-6 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 hover:bg-gray-50"
            >Cancel</button>
            <button
              type="submit"
              class="py-3 px-6 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700"
            >Create Folder</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { store } from "../eventStore.js";
import PlanInputModal from "../components/PlanInputModal.vue";

// --- State for Plan Input Modal (Clicked Folder) ---
const showPlanModal = ref(false);
const selectedFolder = ref({});

const openPlanModal = (folder) => {
  selectedFolder.value = folder;
  showPlanModal.value = true;
};

// --- State and Logic for Add Folder Modal ---
const showAddFolderModal = ref(false);
const newFolder = reactive({
  name: "",
  color: "bg-gray-400",
});

const createFolder = () => {
  if (!newFolder.name.trim()) {
    alert("Please enter a folder name.");
    return;
  }

  store.addFolder(newFolder.name.trim(), newFolder.color);

  newFolder.name = "";
  newFolder.color = "bg-gray-400";
  showAddFolderModal.value = false;
};
</script>
