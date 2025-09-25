<template>
  <div class="relative p-6">
    <!-- Header with "SCHEDULE" and the "add schedule" button -->
    <div class="flex justify-between items-center border-b pb-4 mb-6">
      <h1 class="text-3xl font-bold">PLANNERS</h1>
      <button class="text-sm font-medium hover:underline">+ add planner</button>
    </div>

    <!-- "WEEK 1" heading -->

    <!-- Folders -->
    <div class="flex space-x-6 z-10 relative">
      <div class="flex flex-col items-center">
        <div class="w-24 h-20 bg-blue-400 rounded-md shadow-md"></div>
        <span class="mt-2 text-sm">Week 1</span>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-24 h-20 bg-yellow-400 rounded-md shadow-md"></div>
        <span class="mt-2 text-sm">Week 2</span>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-24 h-20 bg-purple-600 rounded-md shadow-md"></div>
        <span class="mt-2 text-sm">Week 3</span>
      </div>
      <div class="flex flex-col items-center">
        <div class="w-24 h-20 bg-green-500 rounded-md shadow-md"></div>
        <span class="mt-2 text-sm">Week 4</span>
      </div>
    </div>

    <!-- Watermark -->
    <!-- Watermark area -->
    <div
      class="absolute w-full h-full flex justify-center items-center pointer-events-none opacity-10"
    >
      <img src="../test.png" alt="watermark" class="w-96" />
    </div>
  </div>
</template>

<script setup>
// No script logic is needed for this static content.
</script>