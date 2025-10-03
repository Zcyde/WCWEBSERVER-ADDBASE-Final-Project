<template>
  <div class="flex-1 p-3 sm:p-6 relative bg-white min-h-screen">
    <div
      class="relative z-10 p-2 sm:p-4 mb-4 sm:mb-8 bg-gray-300 rounded-full border-2 border-black shadow-md"
    >
      <h1 class="text-lg sm:text-2xl font-bold text-center text-gray-900">Dashboard</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div
        class="bg-white p-3 sm:p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:items-start sm:space-x-4 space-y-2 sm:space-y-0 col-span-1"
      >
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
        >
          <svg
            class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
        </div>
        <div class="text-center sm:text-left">
          <h2 class="text-sm sm:text-xl text-gray-500 font-medium">Welcome Back,</h2>
          <h1 class="text-base sm:text-3xl font-bold text-gray-800">{{ firstName }} {{ lastName }}</h1>
        </div>
      </div>

      <div class="bg-white p-3 sm:p-4 rounded-lg shadow-md col-span-2">
        <h2
          class="text-base sm:text-xl font-semibold mb-2 sm:mb-4 text-gray-700 border-b pb-1 sm:pb-2"
        >Planners</h2>
        <div v-if="displayedFolders.length" class="flex flex-wrap gap-2 sm:gap-4">
          <div
            v-for="folder in displayedFolders"
            :key="folder.id"
            class="flex flex-col items-center p-2 rounded-lg cursor-pointer transition transform hover:scale-105 w-16 sm:w-20"
            @click="selectFolder(folder.id)"
            :class="{ 'border-2 border-indigo-600 shadow-xl': folder.id === selectedFolderId, 'opacity-70 hover:opacity-100': folder.id !== selectedFolderId }"
          >
            <div
              :class="[folder.color]"
              class="w-10 h-8 sm:w-16 sm:h-14 rounded-md shadow-lg flex items-center justify-center text-white text-sm sm:text-xl font-extrabold"
            >{{ folder.name.substring(0, 1) }}</div>
            <span
              class="mt-1 sm:mt-2 text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[3rem] sm:max-w-[4rem]"
            >{{ folder.name }}</span>
          </div>
          <p
            v-if="displayedFolders.length < plannerFolders.length"
            class="text-xs sm:text-sm mt-2 sm:mt-4 text-gray-500"
          >+ {{ plannerFolders.length - displayedFolders.length }} more...</p>
        </div>
        <p v-else class="text-gray-500 text-sm py-3 sm:py-4">No planners created yet.</p>
      </div>
    </div>

    <div class="bg-white p-3 sm:p-6 rounded-lg shadow-xl mb-6 sm:mb-8">
      <h2
        class="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 border-b pb-1 sm:pb-2"
      >{{ activeTaskTitle }}</h2>

      <div v-if="activeTasks.length" class="space-y-2 sm:space-y-3">
        <div
          v-for="plan in activeTasks"
          :key="plan.id"
          class="bg-gray-50 p-2 sm:p-3 rounded-lg shadow-sm border-l-4 transition hover:shadow-md flex justify-between items-center"
          :class="[plan.color.replace('bg-', 'border-')]"
        >
          <p
            class="text-sm sm:text-lg font-semibold text-gray-700 truncate mr-2 sm:mr-4"
          >{{ plan.title }}</p>
          <div class="flex-shrink-0 flex items-center space-x-1 sm:space-x-3">
            <span
              class="text-xs sm:text-sm font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full"
            >{{ plan.date }}</span>
            <span
              v-if="plan.time"
              class="text-xs sm:text-sm font-mono text-gray-500"
            >{{ plan.time }}</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-center py-4 sm:py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <p>{{ selectedFolderId ? 'This planner has no tasks scheduled.' : 'You have no upcoming tasks scheduled.' }}</p>
      </div>
    </div>

    <div class="bg-white p-3 sm:p-4 rounded-lg shadow-xl">
      <h2
        class="text-base sm:text-2xl font-bold mb-2 sm:mb-4 text-gray-800 border-b pb-1 sm:pb-2"
      >Weekly Schedule Overview</h2>

      <div class="flex flex-col sm:grid sm:grid-cols-7 gap-2 font-semibold">
        <div
          v-for="day in weeklyTaskSummary"
          :key="day.date"
          class="rounded-lg overflow-hidden shadow-md"
        >
          <div
            class="p-2 text-center text-xs sm:text-sm"
            :class="[day.isToday ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700']"
          >
            <span class="block">{{ day.dayOfWeek }}</span>
            <span class="opacity-80">{{ day.dayOfMonth }}</span>
          </div>

          <div
            class="min-h-[3rem] sm:min-h-[5rem] p-2 border border-gray-100 flex flex-col justify-center items-center bg-white"
            :class="[day.isToday ? 'bg-indigo-50' : 'bg-white']"
          >
            <div v-if="day.tasks.length" class="text-center">
              <span
                class="text-sm sm:text-2xl font-extrabold"
                :class="[day.isToday ? 'text-indigo-700' : 'text-green-600']"
              >{{ day.tasks.length }}</span>
              <p
                class="text-[0.65rem] sm:text-xs text-gray-500"
              >{{ day.tasks.length === 1 ? 'task' : 'tasks' }}</p>
            </div>
            <div v-else class="text-[0.65rem] sm:text-xs text-gray-400 italic">Free</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none opacity-10 z-0"
    >
      <img src="../dmLogo.png" alt="watermark" class="w-60 sm:w-96" />
    </div>
  </div>
</template>

<script setup>
import { useDashboardLogic } from "../composables/useDashboardLogic.js";

const {
  firstName,
  lastName,
  displayedFolders,
  plannerFolders,
  selectedFolderId,
  selectFolder,
  activeTasks,
  activeTaskTitle,
  weeklyTaskSummary,
} = useDashboardLogic();
</script>