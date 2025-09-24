<template>
  <div class="relative p-6">
    <!-- Header with "SCHEDULE" and the "add schedule" button -->
    <div class="flex justify-between items-center border-b pb-4 mb-6">
      <h1 class="text-3xl font-bold">SCHEDULE</h1>
      <button class="text-sm font-medium hover:underline">+ add schedule</button>
    </div>

    <!-- "WEEK 1" heading -->
    <div class="flex flex-col items-start mb-6">
      <h1 class="text-3xl font-normal text-gray-800">WEEK 1</h1>
      <div class="flex items-center mt-2"></div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 bg-[#192E47] p-2 rounded-md font-bold text-center text-sm">
      <!-- Weekday headers -->
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

      <!-- Grid cells -->
      <template v-for="row in 3" :key="row">
        <div
          v-for="day in 7"
          :key="day"
          :class="{'bg-white border-b': row < 3, 'border-r': day < 7}"
          class="col-span-1 h-20 border-l border-[#8192A9] p-2"
        ></div>
      </template>
    </div>

    <!-- Watermark area -->
    <div
      class="absolute w-full h-full flex justify-center items-center pointer-events-none opacity-10"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-96" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Schedule",
};
</script>