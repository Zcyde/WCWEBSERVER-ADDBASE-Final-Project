<template>
  <div class="relative p-6">
    <!-- Header with title + upload button -->
    <div class="flex justify-between items-center border-b pb-4 mb-6">
      <h1 class="text-3xl font-bold">PORTFOLIO</h1>

      <!-- Upload form -->
      <form @submit.prevent="submitFiles" class="flex items-center space-x-3">
        <input
          type="file"
          multiple
          @change="handleFileSelection"
          class="text-sm text-gray-600"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-blue-700"
          :disabled="selectedFiles.length === 0"
        >
          Upload
        </button>
      </form>
    </div>

    <!-- Uploaded Files as folder cards -->
    <div v-if="uploadedFiles.length > 0" class="flex space-x-6 z-10 relative flex-wrap">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="flex flex-col items-center mb-6"
      >
        <!-- Folder-style box -->
        <div class="w-24 h-20 bg-blue-400 rounded-md shadow-md flex justify-center items-center">
          📄
        </div>
        <span class="mt-2 text-sm text-center">{{ file.name }}</span>

        <!-- Download button -->
        <a
          :href="file.url"
          :download="file.name"
          class="mt-1 text-xs text-blue-600 hover:underline"
        >
          Download
        </a>
      </div>
    </div>
    <p v-else class="text-gray-500">No files uploaded yet.</p>

    <!-- Watermark -->
    <div
      class="absolute w-full h-full flex justify-center items-center pointer-events-none opacity-10"
    >
      <img src="../test.png" alt="watermark" class="w-96" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedFiles = ref([]);
const uploadedFiles = ref([]);

function handleFileSelection(event) {
  selectedFiles.value = Array.from(event.target.files);
}

function submitFiles() {
  selectedFiles.value.forEach((file) => {
    uploadedFiles.value.push({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
    });
  });
  selectedFiles.value = [];
}
</script>
