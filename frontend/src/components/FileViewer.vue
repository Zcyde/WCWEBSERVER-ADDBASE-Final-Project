<template>
  <div v-if="file" class="w-full h-full">
    <iframe
      v-if="file.type === 'application/pdf'"
      :src="`${file.url}?#view=fitH`"
      class="w-full h-full border-0"
      frameborder="0"
    ></iframe>

    <div v-else-if="isImage(file.type)" class="flex justify-center items-center h-full p-4">
      <img :src="file.url" :alt="file.name" class="max-w-full max-h-full object-contain">
    </div>
    
    </div>
</template>

<script setup>
const props = defineProps({
  // Expects a file object like: { name: 'file.pdf', url: '/uploads/file.pdf', type: 'application/pdf' }
  file: { type: Object, required: true },
});

const isImage = (mimeType) => mimeType && mimeType.startsWith('image/');
</script>