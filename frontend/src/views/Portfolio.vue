<template>
  <div class="relative p-4 md:p-8 min-h-screen bg-white">
    <div
      class="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6 space-y-4 md:space-y-0 relative z-10"
    >
      <h1
        class="py-2 px-6 rounded-full border-2 border-black font-sans text-xl md:text-2xl font-bold text-black bg-gradient-to-b from-gray-300 to-gray-400 shadow-lg"
      >PORTFOLIO</h1>

      <div class="flex items-center space-x-2 md:space-x-4">
        <label
          for="file-upload"
          class="cursor-pointer bg-gray-200 px-4 py-2 rounded-md text-sm md:text-base font-medium text-gray-700 hover:bg-gray-300 border border-gray-400 shadow-sm"
        >Click here to choose files</label>
        <input
          id="file-upload"
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileSelection"
        />

        <button
          @click="submitFiles"
          class="bg-blue-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold hover:bg-blue-700 disabled:opacity-50"
          :disabled="selectedFiles.length === 0"
        >Upload</button>
      </div>
    </div>

    <div v-if="uploadedFiles.length > 0" class="flex flex-wrap gap-6 relative z-10">
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="flex flex-col items-center mb-4"
      >
        <div
          class="w-20 h-16 md:w-28 md:h-24 bg-blue-400 rounded-lg shadow-md flex justify-center items-center text-2xl"
        >📄</div>
        <span class="mt-2 text-sm md:text-base text-center truncate max-w-[6rem]">{{ file.name }}</span>
        <a
          :href="`http://localhost:3000${file.path}`"
          :download="file.name"
          class="mt-1 text-xs md:text-sm text-blue-600 hover:underline"
        >Download</a>
      </div>
    </div>
    <p v-else class="text-gray-500 text-base md:text-lg relative z-10">No files uploaded yet.</p>

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

const selectedFiles = ref([]);
const uploadedFiles = ref([]);
const fileInput = ref(null);

const loadFiles = async () => {
  try {
    const response = await api.get("/files");
    uploadedFiles.value = response.data;
  } catch (error) {
    console.error("Failed to load files:", error);
  }
};

function handleFileSelection(event) {
  selectedFiles.value = Array.from(event.target.files);
}

async function submitFiles() {
  if (selectedFiles.value.length === 0) return;

  const formData = new FormData();
  selectedFiles.value.forEach((file) => {
    formData.append("files", file);
  });

  try {
    await api.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    await loadFiles(); // Refresh the list
  } catch (error) {
    console.error("Failed to upload files:", error);
  }

  // reset selection
  selectedFiles.value = [];
  if (fileInput.value) {
    fileInput.value.value = ""; // clears input so user can reselect same file
  }
}

onMounted(() => {
  loadFiles();
});
</script>