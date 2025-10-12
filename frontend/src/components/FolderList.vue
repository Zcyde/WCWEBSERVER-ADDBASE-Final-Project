<template>
  <div class="flex space-x-8 z-10 justify-start flex-wrap gap-y-10">
    <div
      v-for="folder in folders"
      :key="folder._id" class="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-150 group"
    >
      <div
        @click="$emit('select-folder', folder)"
        class="flex flex-col items-center w-full"
      >
        <div
          :class="[folder.color]"
          class="w-32 h-24 rounded-none shadow-lg flex items-center justify-center text-white text-lg font-bold p-3 text-center transition-all group-hover:shadow-2xl group-hover:ring-4 ring-offset-2 ring-opacity-50"
        >
          <svg
            class="w-8 h-8 mr-2 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              fill="currentColor"
            />
          </svg>
          {{ folder.name.split(' ')[0] }}
        </div>
        <span class="mt-3 text-base font-medium text-gray-700">{{ folder.name }}</span>
      </div>
      
      <button
        @click.stop="$emit('delete-planner', folder._id, folder.name)"
        class="absolute top-0 right-[-10px] p-1 rounded-full bg-white/70 text-red-600 shadow-md hover:bg-white hover:text-red-800 transition opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
        title="Delete Planner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clip-rule="evenodd" />
        </svg>
      </button>

    </div>

    <p
      v-if="folders.length === 0"
      class="text-gray-500 text-lg w-full text-center mt-10"
    >Create your first planner!</p>
  </div>
</template>

<script setup>
defineProps({
  folders: {
    type: Array,
    required: true,
  },
});

defineEmits(["select-folder", "delete-planner"]);
</script>