<template>
  <div class="flex-1 p-10 flex flex-col items-center bg-gray-50">
    <!-- Page Heading -->
    <div class="mb-10">
      <h1
        class="py-2 px-8 rounded-full border-2 border-black-600 font-sans text-xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
      >
        User Profile
      </h1>
    </div>

    <!-- Profile & Info Section -->
    <div class="flex flex-col lg:flex-row gap-10 w-full max-w-5xl">
      <!-- Profile Card (Dark Blue) -->
      <div
        class="flex-1 bg-[#1E293B] shadow-lg rounded-2xl p-8 flex flex-col items-center justify-center text-white relative"
      >
        <div class="relative w-32 h-32">
          <!-- Profile Picture -->
          <div class="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img
              :src="profileImage"
              alt="User Photo"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Edit Button Overlay -->
          <label
            for="profileUpload"
            class="absolute bottom-0 right-0 bg-white text-[#1E3A8A] rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200 transition"
          >
            ✎
          </label>
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleProfileImageUpload"
          />
        </div>

        <h2 class="mt-4 text-xl font-semibold">
          First Name and Last Name
        </h2>
        <p class="text-gray-200 text-sm">user@email.com</p>
      </div>

      <!-- Editable Fields Card -->
      <div class="flex-1 bg-white shadow-lg rounded-2xl p-8 relative">
        <form class="space-y-6">
          <!-- Row -->
          <div>
            <label class="block text-gray-500 text-sm mb-1">Username</label>
            <div
              class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition"
            >
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
            <div
              class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition"
            >
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
            <div
              class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition"
            >
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
            <div
              class="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition"
            >
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
import { ref } from "vue";

const profileImage = ref("https://placehold.co/200x200?text=User");

function handleEdit(field) {
  alert(`Edit ${field} clicked!`);
}

function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    profileImage.value = URL.createObjectURL(file);
  }
}
</script>
