<template>
  <div class="flex-1 p-10 flex flex-col items-center bg-gray-50">

    <!-- Page Heading -->
    <div class="mb-10">
      <h1 class="text-3xl font-semibold text-gray-800 tracking-wide">
        User Profile
      </h1>
    </div>

    <!-- Profile & Info Section -->
    <div class="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">

      <!-- Profile Card -->
      <div class="flex-1 bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center">
        <div class="w-32 h-32 rounded-full overflow-hidden shadow-lg border">
          <img
            src="https://placehold.co/200x200?text=User"
            alt="User Photo"
            class="w-full h-full object-cover"
          />
        </div>
        <h2 class="mt-4 text-xl font-semibold text-gray-800">
          First Name and Last Name
        </h2>
        <p class="text-gray-500 text-sm">user@email.com</p>
      </div>

      <!-- Editable Fields Card -->
      <div class="flex-1 bg-white shadow-lg rounded-2xl p-8 relative">
        <form class="space-y-6">

          <!-- Row -->
          <div>
            <label class="block text-gray-500 text-sm mb-1">Username</label>
            <div class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition">
              <input
                type="text"
                class="flex-1 bg-transparent focus:outline-none text-gray-700"
              />
              <button
                type="button"
                class="text-gray-500 hover:text-blue-600 transition"
                @click="handleEdit('username')"
              >
                ✎
              </button>
            </div>
          </div>

          <!-- Row -->
          <div>
            <label class="block text-gray-500 text-sm mb-1">Contact No.</label>
            <div class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition">
              <input
                type="text"
                class="flex-1 bg-transparent focus:outline-none text-gray-700"
              />
              <button
                type="button"
                class="text-gray-500 hover:text-blue-600 transition"
                @click="handleEdit('contact')"
              >
                ✎
              </button>
            </div>
          </div>

          <!-- Row -->
          <div>
            <label class="block text-gray-500 text-sm mb-1">Gender</label>
            <div class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition">
              <input
                type="text"
                class="flex-1 bg-transparent focus:outline-none text-gray-700"
              />
              <button
                type="button"
                class="text-gray-500 hover:text-blue-600 transition"
                @click="handleEdit('gender')"
              >
                ✎
              </button>
            </div>
          </div>

          <!-- Row -->
          <div>
            <label class="block text-gray-500 text-sm mb-1">Address</label>
            <div class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition">
              <input
                type="text"
                class="flex-1 bg-transparent focus:outline-none text-gray-700"
              />
              <button
                type="button"
                class="text-gray-500 hover:text-blue-600 transition"
                @click="handleEdit('address')"
              >
                ✎
              </button>
            </div>
          </div>
        </form>

        <!-- Change Password Button -->
        <div class="mt-8">
          <button
            class="w-full bg-[#1E293B] hover:bg-[#162032] transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
function handleEdit(field) {
  alert(`Edit ${field} clicked!`);
}
</script>
