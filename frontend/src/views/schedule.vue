<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside
      class="w-20 md:w-56 bg-[#162238] text-white flex flex-col items-center md:items-start p-4 space-y-6"
    >
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <img src="./dmLogo.png" alt="Logo" class="w-10 h-10 rounded-full" />
        <span class="hidden md:block font-bold text-lg">domore</span>
      </div>

      <!-- Navigation -->
      <nav class="flex flex-col space-y-4 w-full">
        <a href="#" class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
          <span class="text-xl">👤</span>
          <span class="hidden md:block">Account</span>
        </a>
        <a href="#" class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
          <span class="text-xl">🔲</span>
          <span class="hidden md:block">Dashboard</span>
        </a>
        <a href="#" class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md">
          <span class="text-xl">📅</span>
          <span class="hidden md:block">Calendar</span>
        </a>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 relative p-6">
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h1 class="text-3xl font-bold">SCHEDULE</h1>
        <button class="text-sm font-medium hover:underline">+ add event</button>
        <!-- Placeholder for adding stuff sa sched -->
      </div>

      <div class="flex flex-col items-start mb-6">
        <h1 class="text-3xl font-normal text-gray-800">WEEK 1</h1>
        <div class="flex items-center mt-2"></div>
      </div>

      <div
        class="grid grid-cols-7 text-center border-2 border-[#8192A9] rounded-md overflow-hidden"
      >
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9] rounded-tl-md"
        >Sunday</div>
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9]"
        >Monday</div>
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9]"
        >Tuesday</div>
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9]"
        >Wednesday</div>
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9]"
        >Thursday</div>
        <div
          class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 border-r border-[#8192A9]"
        >Friday</div>
        <div class="col-span-1 bg-[#4C8BF5] text-white font-normal py-4 px-2 rounded-tr-md">Saturday</div>

        <template v-for="row in 3" :key="row">
          <div
            v-for="day in 7"
            :key="day"
            :class="{'bg-white border-b': row < 3, 'border-r': day < 7}"
            class="col-span-1 h-20 border-l border-[#8192A9] p-2"
          ></div>
        </template>
      </div>
      <div class="absolute inset-0 flex justify-center items-center pointer-events-none opacity-10">
        <img src="./dmLogo.png" alt="watermark" class="w-96" />
      </div>
    </main>
  </div>
</template>

<script setup>
// No logic needed, as the data for the time column has been removed.
</script>