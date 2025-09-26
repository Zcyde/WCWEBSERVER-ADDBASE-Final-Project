<template>
  <div class="flex-1 p-6 relative">
    <!-- Header with "Dashboard" and curved border -->
    <div class="relative z-10 p-4 mb-8 bg-gray-300 rounded-full border-2 border-black shadow-md">
      <h1 class="text-xl font-bold text-center">Dashboard</h1>
    </div>

    <!-- Main content container -->
    <div class="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      <!-- Profile section -->
      <div class="flex-1 bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div
          class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
        >
          <svg
            class="w-12 h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Placeholder for profile picture (File handling or backend upload can be done) -->
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <!-- This is a placeholder for the user's full name from the backend -->
        <div>
          <h2 class="text-xl font-semibold">{{ firstName }},</h2>
          <h2 class="text-xl font-semibold">{{ lastName }}</h2>
        </div>
      </div>

      <!-- Planners section -->
      <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Planners</h2>
        <div class="flex space-x-4">
          <!-- Placeholder for planner folders from the BACKEND CONNECTION -->
          <div class="flex flex-col items-center">
            <div class="w-20 h-16 bg-blue-400 rounded-md shadow-md"></div>
            <span class="mt-2 text-sm">Week #</span>
            <!-- Reflect based on the backend -->
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar grid -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <div
        class="grid grid-cols-8 gap-1 text-center font-bold text-sm border border-gray-300 rounded-md overflow-hidden"
      >
        <!-- Time and weekday headers -->
        <!-- Insert info here based from backend -->
        <div class="col-span-1 bg-white text-gray-800 py-4"></div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Sunday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Monday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Tuesday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Wednesday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Thursday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2 border-r">Friday</div>
        <div class="col-span-1 bg-gray-200 py-4 px-2">Saturday</div>

        <!-- Time rows and grid cells -->
        <!-- These will be dynamically populated based on the selected planner from the backend -->
        <template v-for="hour in 7" :key="hour">
          <div
            class="col-span-1 bg-white text-sm font-normal py-4 border-r border-b"
          >{{ hour + 5 }} am</div>
          <div v-for="day in 7" :key="day" class="col-span-1 h-16 border-r border-b"></div>
        </template>
      </div>
    </div>
  </div>
</template>


<!-- DI KO GETS TO BAHALA NA KAYO -->
<script setup>
// This is where you would handle the backend connection.
// You can use a library like axios to fetch data.
import { ref } from "vue";

// Placeholders for data that will come from the backend.
const firstName = ref("Marlon");
const lastName = ref("Garcia Michael");

// You would add a function here to fetch the data.
// For example:
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

// You can add similar functions to fetch planner and schedule data.
</script>