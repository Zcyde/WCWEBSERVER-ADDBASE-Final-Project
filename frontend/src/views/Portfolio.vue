<template>
  <div class="relative p-8"> <!-- slightly bigger padding -->
    <!-- Header with title + upload button -->
    <div class="flex justify-between items-center border-b pb-6 mb-8">
      <h1
        class="py-3 px-10 rounded-full border-2 border-black-600 font-sans text-2xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"
      >
        PORTFOLIO
      </h1>

      <!-- Upload form -->
      <form @submit.prevent="submitFiles" class="flex items-center space-x-4">
        <input
          type="file"
          multiple
          @change="handleFileSelection"
          class="text-base text-gray-600"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-base font-semibold hover:bg-blue-700"
          :disabled="selectedFiles.length === 0"
        >
          Upload
        </button>
      </form>
    </div>

    <!-- Uploaded Files as folder cards -->
    <div v-if="uploadedFiles.length > 0" class="flex space-x-8 z-10 relative flex-wrap">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="flex flex-col items-center mb-8"
      >
        <!-- Folder-style box -->
        <div class="w-28 h-24 bg-blue-400 rounded-lg shadow-md flex justify-center items-center text-2xl">
          📄
        </div>
        <span class="mt-3 text-base text-center">{{ file.name }}</span>

        <!-- Download button -->
        <a
          :href="file.url"
          :download="file.name"
          class="mt-2 text-sm text-blue-600 hover:underline"
        >
          Download
        </a>
      </div>
    </div>
    <p v-else class="text-gray-500 text-lg">No files uploaded yet.</p>

    <!-- Watermark -->
    <div
      class="absolute w-full h-full flex justify-center items-center pointer-events-none opacity-10"
    >
      <img src="../test.png" alt="watermark" class="w-[30rem]" />
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
