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

    <!-- Responsive Layout -->
    <div class="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
      <!-- Profile Section (desktop only) -->
      <div
        class="hidden lg:flex flex-1 flex-col items-center justify-center relative 
               text-white bg-[#1E293B] rounded-2xl p-6 shadow-md"
      >
        <div class="relative w-32 h-32">
          <!-- Profile Picture -->
          <div
            class="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white"
          >
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

        <h2 class="mt-4 text-xl font-semibold">First Name and Last Name</h2>
        <p class="text-sm text-gray-200">user@email.com</p>
      </div>

      <!-- Editable Fields Section -->
      <form
        class="flex-1 space-y-5 bg-white shadow-md rounded-2xl p-6 
               lg:shadow-none lg:bg-transparent lg:p-0"
      >
        <!-- Profile Section (mobile only, inside form) -->
        <div class="flex flex-col items-center lg:hidden">
          <div class="relative w-24 h-24">
            <div
              class="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-[#1E293B]"
            >
              <img
                :src="profileImage"
                alt="User Photo"
                class="w-full h-full object-cover"
              />
            </div>
            <label
              for="profileUploadMobile"
              class="absolute bottom-0 right-0 bg-white text-[#1E3A8A] rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200 transition"
            >
              ✎
            </label>
            <input
              id="profileUploadMobile"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleProfileImageUpload"
            />
          </div>
          <h2 class="mt-3 text-lg font-semibold text-[#1E3A8A]">
            First Name and Last Name
          </h2>
          <p class="text-sm text-[#1E3A8A]">user@email.com</p>
        </div>

        <!-- Fields -->
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

        <!-- Change Password Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-[#1E293B] hover:bg-[#162032] transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Change Password
          </button>
        </div>
      </form>
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
