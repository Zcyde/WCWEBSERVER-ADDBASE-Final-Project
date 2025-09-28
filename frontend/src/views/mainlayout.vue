<template>
  <div class="flex h-screen">
    <!-- Sidebar (desktop only) -->
    <aside
      class="hidden md:flex w-56 bg-[#162238] text-white flex-col items-start p-4 space-y-6"
    >
      <div class="flex items-center space-x-2">
        <img src="../dmLogo.png" alt="Logo" class="w-10 h-10 rounded-full" />
        <span class="font-bold text-lg">Domore</span>
      </div>

      <nav class="flex flex-col space-y-4 w-full">
        <router-link
          to="/account"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">👤</span>
          <span>Account</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">🔲</span>
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/planner"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📄</span>
          <span>Planner</span>
        </router-link>

        <router-link
          to="/schedule"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📅</span>
          <span>Schedule</span>
        </router-link>

        <router-link
          to="/portfolio"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📁</span>
          <span>Portfolio</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 relative p-6 pb-20 md:pb-6">
      <router-view />
    </main>

    <!-- Bottom navigation (mobile only) -->
    <nav
      class="fixed bottom-0 left-0 w-full bg-[#162238] text-white flex justify-around items-center py-2 md:hidden shadow-lg"
    >
      <router-link to="/account" class="flex flex-col items-center">
        <span class="text-xl">👤</span>
        <span class="text-xs">Account</span>
      </router-link>

      <router-link to="/" class="flex flex-col items-center">
        <span class="text-xl">🔲</span>
        <span class="text-xs">Dashboard</span>
      </router-link>

      <router-link to="/planner" class="flex flex-col items-center">
        <span class="text-xl">📄</span>
        <span class="text-xs">Planner</span>
      </router-link>

      <router-link to="/schedule" class="flex flex-col items-center">
        <span class="text-xl">📅</span>
        <span class="text-xs">Schedule</span>
      </router-link>

      <router-link to="/portfolio" class="flex flex-col items-center">
        <span class="text-xl">📁</span>
        <span class="text-xs">Portfolio</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
// No script logic needed
</script>
