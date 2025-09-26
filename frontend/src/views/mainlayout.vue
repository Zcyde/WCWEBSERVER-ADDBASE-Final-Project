<template>
  <div class="flex h-screen">
    <aside
      class="w-20 md:w-56 bg-[#162238] text-white flex flex-col items-center md:items-start p-4 space-y-6"
    >
      <div class="flex items-center space-x-2">
        <img src="../dmLogo.png" alt="Logo" class="w-10 h-10 rounded-full" />
        <span class="hidden md:block font-bold text-lg">Domore</span>
      </div>

      <nav class="flex flex-col space-y-4 w-full">
        <router-link
          to="/account"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">👤</span>
          <span class="hidden md:block">Account</span>
        </router-link>

        <router-link
          to="/"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">🔲</span>
          <span class="hidden md:block">Dashboard</span>
        </router-link>

        <router-link
          to="/planner"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📄</span>
          <span class="hidden md:block">Planner</span>
        </router-link>

        <router-link
          to="/schedule"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📅</span>
          <span class="hidden md:block">Schedule</span>
        </router-link>

        <!-- Portfolio link added -->
        <router-link
          to="/portfolio"
          class="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-md"
        >
          <span class="text-xl">📁</span>
          <span class="hidden md:block">Portfolio</span>
        </router-link>
      </nav>
    </aside>

    <main class="flex-1 relative p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No script logic needed for this component.
</script>