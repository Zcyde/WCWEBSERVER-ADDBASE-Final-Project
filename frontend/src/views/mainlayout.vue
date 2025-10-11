<template>
  <div class="flex h-screen bg-white">
    <aside
      class="hidden md:flex w-64 bg-slate-800 text-white flex-col items-start p-4 pt-6 space-y-6 shadow-xl transition-all duration-300"
    >
      <div class="flex items-center justify-center pb-4 border-b border-gray-700/50 w-full mb-2">
        <span class="font-extrabold text-xl text-white">Domore</span>
      </div>

      <nav class="flex flex-col space-y-2 w-full">
        <router-link
          to="/"
          class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
          exact-active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
        >
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/planner"
          class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
        >
          
          <span>Planner</span>
        </router-link>

        <router-link
          to="/schedule"
          class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
        >
          
          <span>Schedule</span>
        </router-link>

        <router-link
          to="/library"
          class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
        >
          
          <span>Library</span>
        </router-link>

        <div class="pt-6 mt-auto border-t-2 border-gray-500 w-full">
          <router-link
            to="/account"
            class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200 mt-2"
            active-class="bg-slate-100 font-semibold text-slate-900 shadow-md"
          >
            
            <span>Account</span>
          </router-link>

          <button
            @click="logout"
            class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 mt-2 w-full text-left"
          >
            
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
<!--Mobile Viewport-->
    <main class="flex-1 relative p-6 bg-white overflow-y-auto"> 
      <router-view />
    </main>

    <nav
      class="fixed bottom-0 left-0 w-full bg-slate-800 text-white flex justify-around items-center py-2 md:hidden shadow-xl z-10"
    >
      <router-link
        to="/account"
        class="flex flex-col items-center p-1 rounded-md text-gray-300 hover:text-indigo-400 transition-colors"
        active-class="text-indigo-400"
      >
        <span class="text-xl">👤</span>
        <span class="text-xs">Account</span>
      </router-link>

      <router-link
        to="/"
        class="flex flex-col items-center p-1 rounded-md text-gray-300 hover:text-indigo-400 transition-colors"
        active-class="text-indigo-400"
        exact-active-class="text-indigo-400"
      >
        <span class="text-xl">📊</span>
        <span class="text-xs">Dashboard</span>
      </router-link>

      <router-link
        to="/planner"
        class="flex flex-col items-center p-1 rounded-md text-gray-300 hover:text-indigo-400 transition-colors"
        active-class="text-indigo-400"
      >
        <span class="text-xl">📝</span>
        <span class="text-xs">Planner</span>
      </router-link>

      <router-link
        to="/schedule"
        class="flex flex-col items-center p-1 rounded-md text-gray-300 hover:text-indigo-400 transition-colors"
        active-class="text-indigo-400"
      >
        <span class="text-xl">📅</span>
        <span class="text-xs">Schedule</span>
      </router-link>

      <router-link
        to="/library"
        class="flex flex-col items-center p-1 rounded-md text-gray-300 hover:text-indigo-400 transition-colors"
        active-class="text-indigo-400"
      >
        <span class="text-xl">📁</span>
        <span class="text-xs">Library</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useAccountLogic } from "../composables/useAccountLogic.js";

const { logout, user } = useAccountLogic();
</script>
