<template>
  <div class="relative p-4 md:p-8 min-h-screen bg-white">
    <!-- HEADER -->
    <div class="flex justify-between items-center border-b pb-4 mb-6 relative z-10">
      <h1
        class="py-2 px-6 rounded-full border-2 border-black font-sans text-xl md:text-2xl font-bold text-black bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"
      >
        LIBRARY
      </h1>

      <button
        @click="loadFiles"
        :disabled="isLoading"
        class="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-300 border border-gray-400 shadow-sm disabled:opacity-50"
      >
        {{ isLoading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- FILE GRID -->
    <div
      v-if="uploadedFiles.length > 0"
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10"
    >
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="flex flex-col items-center text-center bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200"
      >
        <!-- FILE ICON -->
        <div class="w-20 h-20 bg-blue-400 rounded-lg shadow-md flex justify-center items-center text-3xl">
          📄
        </div>

        <!-- FILE NAME -->
        <span class="mt-3 text-sm md:text-base font-semibold text-gray-800 truncate w-40">
          {{ file.name }}
        </span>

        <!-- FILE DETAILS -->
        <span class="text-gray-400 text-xs mt-1">
          {{ formatDate(file.createdAt) }} | {{ formatSize(file.size) }}
        </span>

        <!-- FILE ACTIONS -->
        <div class="flex justify-center gap-4 mt-2">
          <a
            :href="fileUrl(file)"
            target="_blank"
            class="text-blue-600 text-sm hover:underline"
          >
            View
          </a>
          <a
            :href="fileUrl(file)"
            :download="file.name"
            class="text-green-600 text-sm hover:underline"
          >
            Download
          </a>
          <button
            @click="deleteFile(file)"
            class="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <p
      v-else-if="!isLoading"
      class="text-gray-500 text-base md:text-lg text-center mt-10 relative z-10"
    >
      No files uploaded yet.
    </p>

    <!-- WATERMARK -->
    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10 z-0"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-60 sm:w-96" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api.js";

const uploadedFiles = ref([]);
const isLoading = ref(false);

// Load library files
const loadFiles = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("authToken");
    const response = await api.get("/files", {
      headers: { Authorization: `Bearer ${token}` },
    });
    uploadedFiles.value = response.data || [];
  } catch (error) {
    console.error("Failed to load files:", error);
  } finally {
    isLoading.value = false;
  }
};

// Build full URL for viewing/downloading
const fileUrl = (file) => (file.path ? `http://localhost:3000${file.path}` : "");

// Format upload date
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
};

// Format file size
const formatSize = (size) => {
  if (!size) return "";
  if (size < 1024) return size + " B";
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
  return (size / (1024 * 1024)).toFixed(1) + " MB";
};

// Delete file
const deleteFile = async (file) => {
  if (!confirm(`Delete ${file.name}? This will remove it from all events too.`)) return;
  try {
    const token = localStorage.getItem("authToken");
    await api.delete(`/files/${file._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert(`Deleted ${file.name}`);
    await loadFiles(); // reload library
    // Optionally, also refresh planner if you have a method to do so
    // await loadPlannerEvents();
  } catch (err) {
    console.error("Failed to delete file:", err);
    alert("Failed to delete file");
  }
};

onMounted(() => {
  loadFiles();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
