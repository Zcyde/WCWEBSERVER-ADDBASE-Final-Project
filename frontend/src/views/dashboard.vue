<template>
  <div class="flex-1 p-6 relative bg-gray-50 min-h-screen">
    <!-- Header: Reverted to high-contrast, rounded style -->
    <div class="relative z-10 p-4 mb-8 bg-gray-300 rounded-full border-2 border-black shadow-md">
      <h1 class="text-2xl font-bold text-center text-gray-900">Dashboard</h1>
    </div>

    <!-- Top section: Profile & Planners (grid layout) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- 1. Profile section (Reverted to original style) -->
      <div class="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 col-span-1">
        <div
          class="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-gray-200"
        >
          <!-- User Icon: Reverted to gray icon -->
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
          <!-- Keeping size consistency from the latest version -->
          <h2 class="text-xl text-gray-500 font-medium">Welcome Back,</h2>
          <h1 class="text-3xl font-bold text-gray-800">{{ firstName }} {{ lastName }}</h1>
        </div>
      </div>

      <!-- 2. Planners section (Interactive Folders) -->
      <div class="bg-white p-4 rounded-lg shadow-md col-span-2">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Planners</h2>
        <div v-if="displayedFolders.length" class="flex flex-wrap gap-4">
          <div
            v-for="folder in displayedFolders"
            :key="folder.id"
            class="flex flex-col items-center p-2 rounded-lg cursor-pointer transition duration-150 transform hover:scale-105"
            @click="selectFolder(folder.id)"
            :class="{ 'border-2 border-indigo-600 shadow-xl': folder.id === selectedFolderId, 'opacity-70 hover:opacity-100': folder.id !== selectedFolderId }"
          >
            <!-- Folder Icon -->
            <div
              :class="[folder.color]"
              class="w-16 h-14 rounded-md shadow-lg flex items-center justify-center text-white text-xl font-extrabold"
            >{{ folder.name.substring(0, 1) }}</div>
            <span
              class="mt-2 text-sm font-medium text-gray-700 truncate max-w-[4rem]"
            >{{ folder.name }}</span>
          </div>
          <p
            v-if="displayedFolders.length < plannerFolders.length"
            class="text-sm mt-4 text-gray-500 self-end ml-4"
          >+ {{ plannerFolders.length - displayedFolders.length }} more...</p>
        </div>
        <p v-else class="text-gray-500 text-sm py-4">No planners created yet.</p>
      </div>
    </div>

    <!-- Consolidated Task List Widget -->
    <div class="bg-white p-6 rounded-lg shadow-xl mb-8">
      <!-- Dynamic Title -->
      <h2 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{{ activeTaskTitle }}</h2>

      <div v-if="activeTasks.length" class="space-y-3">
        <!-- Task Item Loop -->
        <div
          v-for="plan in activeTasks"
          :key="plan.id"
          class="bg-gray-50 p-3 rounded-lg shadow-sm border-l-4 transition hover:shadow-md flex justify-between items-center"
          :class="[plan.color.replace('bg-', 'border-')]"
        >
          <p class="text-lg font-semibold text-gray-700 truncate mr-4">{{ plan.title }}</p>
          <div class="flex-shrink-0 flex items-center space-x-3">
            <!-- Date badge reverted to gray scheme -->
            <span
              class="text-sm font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full"
            >{{ plan.date }}</span>
            <!-- Time display if available in event data -->
            <span v-if="plan.time" class="text-sm font-mono text-gray-500 ml-2">{{ plan.time }}</span>
          </div>
        </div>

        <!-- Show truncation message -->
        <div
          v-if="showTruncation"
          class="text-center pt-2 text-sm text-gray-500 font-medium bg-gray-50 p-2 rounded-lg border-dashed border-2"
        >
          <p>Viewing top 5 tasks. Access planner for + {{ truncationCount }} more...</p>
        </div>
      </div>
      <div
        v-else
        class="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
      >
        <p>{{ selectedFolderId ? 'This planner has no tasks scheduled.' : 'You have no upcoming tasks scheduled.' }}</p>
      </div>
    </div>

    <!-- Weekly Schedule Overview -->
    <div class="bg-white p-4 rounded-lg shadow-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Weekly Schedule Overview</h2>

      <div class="grid grid-cols-7 gap-1 text-center font-semibold">
        <!-- Day Headers (Dynamically generated for the next 7 days) -->
        <div
          v-for="day in weeklyTaskSummary"
          :key="day.date"
          class="p-2 rounded-t-lg transition duration-200 shadow-md"
          :class="[day.isToday ? 'bg-indigo-500 text-white shadow-lg' : 'bg-gray-200 text-gray-700']"
        >
          <span class="text-sm font-bold block">{{ day.dayOfWeek }}</span>
          <span class="text-xs block opacity-80">{{ day.dayOfMonth }}</span>
        </div>

        <!-- Day Cells (Display Task Count) -->
        <div
          v-for="day in weeklyTaskSummary"
          :key="day.date"
          class="min-h-[5rem] p-2 border-b border-r border-l border-gray-100 flex flex-col justify-center items-center rounded-b-lg transition duration-150 hover:bg-gray-50"
          :class="[day.isToday ? 'bg-indigo-50' : 'bg-white']"
        >
          <div v-if="day.tasks.length" class="text-center">
            <span
              class="text-2xl font-extrabold"
              :class="[day.isToday ? 'text-indigo-700' : 'text-green-600']"
            >{{ day.tasks.length }}</span>
            <p class="text-xs text-gray-500 mt-1">{{ day.tasks.length === 1 ? 'task' : 'tasks' }}</p>
          </div>
          <div v-else class="text-xs text-gray-400 italic">Free</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDashboardLogic } from "../composables/useDashboardLogic.js";

// Destructure consolidated values from the logic composable
const {
  firstName,
  lastName,
  displayedFolders,
  plannerFolders,
  selectedFolderId,
  selectFolder,
  activeTasks,
  activeTaskTitle,
  showTruncation,
  truncationCount,
  weeklyTaskSummary,
} = useDashboardLogic();
</script>
