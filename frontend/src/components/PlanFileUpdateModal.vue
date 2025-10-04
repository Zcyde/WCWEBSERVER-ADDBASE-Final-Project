<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg" @click.stop>
      <h3 class="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        Update Files for:
        <span class="text-indigo-600">{{ plan.title }}</span>
      </h3>

      <div class="space-y-4">
        <div v-if="plan.plannerFiles && plan.plannerFiles.length" class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Attached Files ({{ plan.plannerFiles.length }})</h4>
          <ul class="space-y-2 max-h-40 overflow-y-auto pr-2 border p-2 rounded-md bg-gray-50">
            <li v-for="(file, index) in plan.plannerFiles" :key="file.url || file" 
              class="flex items-center justify-between text-sm text-gray-600 bg-white p-2 rounded-md shadow-sm border"
            >
              <span class="truncate pr-4">{{ file.name || file.split('/').pop() }}</span>
              <button
                @click="$emit('remove-file', plan._id, index)"
                class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition"
                title="Remove file"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
        <div v-else class="text-center text-sm text-gray-500 mb-4 py-4 border-2 border-dashed border-gray-300 rounded-lg">
          No files currently attached.
        </div>

        <div>
          <label for="fileUpload" class="block text-sm font-medium text-gray-700 mb-2">Upload New File(s)</label>
          <input
            id="fileUpload"
            type="file"
            multiple
            @change="handleFileUpload"
            class="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 transition duration-150"
          />
        </div>

        <div v-if="uploadingFiles.length" class="mt-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Files to Upload:</h4>
            <ul class="space-y-1">
                <li v-for="(file, index) in uploadingFiles" :key="index" class="text-sm flex justify-between items-center text-gray-600 bg-yellow-50 p-2 rounded-md">
                    <span>{{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</span>
                    <button @click="removeUploadingFile(index)" class="text-red-500 hover:text-red-700 text-xs ml-2">Remove</button>
                </li>
            </ul>
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          @click="$emit('close')"
          class="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="uploadFiles"
          :disabled="!uploadingFiles.length || isProcessing"
          :class="{'opacity-50 cursor-not-allowed': !uploadingFiles.length || isProcessing}"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition"
        >
          <span v-if="isProcessing">Uploading...</span>
          <span v-else>Upload & Save Plan</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from "vue";
import { store } from "../eventStore.js";
const props = defineProps({
  isVisible: { type: Boolean, required: true },
  plan: { type: Object, required: true },
});
const emit = defineEmits(["close", "update-plan", "remove-file"]);
const uploadingFiles = ref([]);
const isProcessing = ref(false);
const handleFileUpload = (event) => {
  uploadingFiles.value = [...uploadingFiles.value, ...Array.from(event.target.files)];
  // Clear the input field so the same file can be selected again
  event.target.value = '';
};
const removeUploadingFile = (index) => {
  uploadingFiles.value.splice(index, 1);
};
const uploadFiles = async () => {
  if (!uploadingFiles.value.length || isProcessing.value) return;
  isProcessing.value = true;

  // 1. Create a FormData object.
  const formData = new FormData();

  // 2. Append new files to the FormData object under the key 'files'.
  uploadingFiles.value.forEach((file) => {
      formData.append(`files`, file);
  });

  // 3. Convert the reactive plan object to a clean, non-reactive JavaScript object.
  const planData = toRaw(props.plan);

  // 4. Construct the final update object for the backend JSON payload.
  const updateObject = {
      // Spread the clean object to include all event fields (title, date, color, etc.)
      ...planData,
      // Ensure the plannerFiles array is correct (it holds the retained files as URLs)
      plannerFiles: (planData.plannerFiles || []).map(f => f.url),
  };

  // Clean up temporary/Mongoose properties before sending
  // These properties should come from the URL/DB, not the body data.
  delete updateObject.id;
  delete updateObject._id;

  // 5. Append the FULL event object as a JSON string under the key 'data'.
  formData.append('data', JSON.stringify(updateObject));

  // 6. Call the store function with the Plan ID and the FormData object.
  try {
      await store.updateEventWithFiles(props.plan._id, formData);

      console.log('Plan updated successfully with new files.');
      uploadingFiles.value = []; // Clear pending uploads
      emit("close");
  } catch (error) {
      console.error("Error updating plan with files:", error);
      alert("Failed to upload files and update plan. See console for details.");
  } finally {
      isProcessing.value = false;
  }
};
</script>
