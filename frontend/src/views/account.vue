<template>
  <!-- Main content area -->
  <div class="flex-1 p-6 flex flex-col items-center">
    <!-- Detached Top Heading with shadow -->
    <div class="p-4 mb-8 bg-gray-300 rounded-full border-2 border-black shadow-lg">
      <h1 class="text-xl font-bold">User's Profile</h1>
    </div>

    <!-- Profile Card with shadow -->
    <div class="bg-[#191919] text-white p-8 rounded-3xl shadow-xl w-full max-w-sm mb-6">
      <!-- Profile Picture -->
      <div class="flex flex-col items-center mb-6">
        <div class="w-32 h-32 rounded-full border-4 border-[#191919] overflow-hidden shadow-md">
          <img
            src="https://placehold.co/128x128/333333/fff?text=User"
            alt="User Profile Picture"
            class="object-cover w-full h-full"
          />
          <!-- ED KABIT FILEHANDLING DITO-->
        </div>
        <h2 class="mt-4 text-lg font-semibold">First Name and Last Name</h2>
        <!-- First Name and Last Name from database -->
        <p class="text-sm text-gray-400">user@email.com</p>
        <!-- Email from database -->
      </div>
    </div>

    <!-- Form Card with watermark -->
    <div class="relative bg-[#191919] text-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
      <!-- Watermark area -->
      <div class="absolute inset-0 flex justify-center items-center pointer-events-none opacity-10">
        <img src="../dmLogo.png" alt="watermark" class="w-64" />
      </div>

      <!-- Form fields -->
      <form class="space-y-6 relative z-10">
        <!-- Username -->
        <div>
          <label class="text-xs text-gray-400">Username</label>
          <div class="flex items-center space-x-2 mt-1">
            <input
              type="text"
              class="bg-transparent border-b border-gray-500 w-full focus:outline-none"
              value="Add Username Here"
            />
            <button type="button" class="text-sm cursor-pointer" onclick="handleEdit('username')">✏️</button>
          </div>
        </div>

        <!-- Contact -->
        <div>
          <label class="text-xs text-gray-400">Contact</label>
          <div class="flex items-center space-x-2 mt-1">
            <input
              type="text"
              class="bg-transparent border-b border-gray-500 w-full focus:outline-none"
              value="Add Contact Here"
            />
            <button type="button" class="text-sm cursor-pointer" onclick="handleEdit('contact')">✏️</button>
          </div>
        </div>

        <!-- Gender -->
        <div>
          <label class="text-xs text-gray-400">Gender</label>
          <div class="flex items-center space-x-2 mt-1">
            <input
              type="text"
              class="bg-transparent border-b border-gray-500 w-full focus:outline-none"
              value="Add Gender Here"
            />
            <button type="button" class="text-sm cursor-pointer" onclick="handleEdit('gender')">✏️</button>
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="text-xs text-gray-400">Address</label>
          <div class="flex items-center space-x-2 mt-1">
            <input
              type="text"
              class="bg-transparent border-b border-gray-500 w-full focus:outline-none"
              value="Add Address Here"
            />
            <button type="button" class="text-sm cursor-pointer" onclick="handleEdit('address')">✏️</button>
          </div>
        </div>
      </form>

      <!-- Buttons -->
      <div class="mt-8 flex flex-col space-y-4 relative z-10">
        <button
          class="bg-[#4C8BF5] text-white font-semibold py-2 rounded-md shadow-lg hover:shadow-xl transition"
        >Change Password</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Placeholder edit handler
function handleEdit(field) {
  alert(`Edit ${field} clicked!`);
}
</script>
