<template>
  <div class="flex-1 p-6 relative">
    <!-- Header with "Dashboard" and curved border -->
    <div class="relative z-10 p-4 mb-8 bg-gray-300 rounded-full border-2 border-black shadow-md">
      <h1 class="text-2xl font-bold text-center">Dashboard</h1>
    </div>

    <!-- Main content container -->
    <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      <!-- Profile section -->
      <div class="flex-1 bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div
          class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-semibold">{{ firstName }},</h2>
          <h2 class="text-2xl font-semibold">{{ lastName }}</h2>
        </div>
      </div>

      <!-- Planners section -->
      <div class="flex-1 bg-white p-4 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Planners</h2>
        <div class="flex space-x-4">
          <div class="flex flex-col items-center">
            <div class="w-20 h-16 bg-blue-400 rounded-md shadow-md"></div>
            <span class="mt-2 text-base">Week #</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="mt-0 bg-white p-4 rounded-lg shadow-md">
      <div class="grid grid-cols-8 text-center font-bold text-base border border-gray-300 rounded-md overflow-hidden">
        <!-- Empty top-left cell -->
        <div class="bg-white py-3 border-r"></div>

        <!-- Weekday headers -->
        <div class="bg-gray-200 py-3 border-r text-base">Sunday</div>
        <div class="bg-gray-200 py-3 border-r text-base">Monday</div>
        <div class="bg-gray-200 py-3 border-r text-base">Tuesday</div>
        <div class="bg-gray-200 py-3 border-r text-base">Wednesday</div>
        <div class="bg-gray-200 py-3 border-r text-base">Thursday</div>
        <div class="bg-gray-200 py-3 border-r text-base">Friday</div>
        <div class="bg-gray-200 py-3 text-base">Saturday</div>

        <!-- Time rows -->
        <template v-for="hour in 7" :key="hour">
          <div class="bg-white text-base font-normal py-4 border-r border-t">
            {{ hour + 5 }} am
          </div>
          <div
            v-for="day in 7"
            :key="day"
            class="h-16 border-r border-t"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const firstName = ref("Marlon");
const lastName = ref("Garcia Michael");

// Example of fetching data (not active yet)
// import axios from 'axios';
// async function fetchUserData() {
//   try {
//     const response = await axios.get('/api/user/profile');
//     firstName.value = response.data.firstName;
//     lastName.value = response.data.lastName;
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//   }
// }
// fetchUserData();
</script>
