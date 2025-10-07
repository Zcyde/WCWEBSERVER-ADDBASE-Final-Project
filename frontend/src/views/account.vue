<template>
  <div class="flex-1 p-10 flex flex-col items-center bg-white">
    <div class="mb-10">
      <h1
        class="py-2 px-8 border-2 border-black-600 font-sans text-xl font-bold text-black-800 bg-gradient-to-b from-gray-300 to-gray-400 shadow-md"
      >User Profile</h1>
    </div>

    <div class="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
      <div
        class="hidden lg:flex flex-1 flex-col items-center justify-center relative text-white bg-[#1E293B] p-6 shadow-md"
      >
        <!-- Profile Image (Circle) -->
        <div class="relative w-32 h-32">
          <div class="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
            <img :src="user.avatar" alt="User Photo" class="w-full h-full object-cover" />
          </div>

          <label
            for="profileUpload"
            class="absolute bottom-0 right-0 bg-white text-[#1E3A8A] rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200 transition"
          >✎</label>
          <input
            id="profileUpload"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleProfileImageUpload"
          />
        </div>

        <h2 class="mt-4 text-xl font-semibold">{{ user.firstName }} {{ user.lastName }}</h2>
        <p class="text-sm text-gray-200">{{ user.email }}</p>
      </div>

      <form
        class="flex-1 space-y-5 bg-white shadow-md p-6 lg:shadow-none lg:bg-transparent lg:p-0"
        @submit.prevent="updateUser"
      >
        <!-- Mobile Profile -->
        <div class="flex flex-col items-center lg:hidden">
          <div class="relative w-24 h-24">
            <div class="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-[#1E293B]">
              <img :src="user.avatar" alt="User Photo" class="w-full h-full object-cover" />
            </div>
            <label
              for="profileUploadMobile"
              class="absolute bottom-0 right-0 bg-white text-[#1E3A8A] rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-200 transition"
            >✎</label>
            <input
              id="profileUploadMobile"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleProfileImageUpload"
            />
          </div>
          <h2 class="mt-3 text-lg font-semibold text-[#1E3A8A]">{{ user.firstName }} {{ user.lastName }}</h2>
          <p class="text-sm text-[#1E3A8A]">{{ user.email }}</p>
        </div>

        <!-- Editable Fields -->
        <div>
          <label class="block text-gray-500 text-sm mb-1">Username</label>
          <div
            :class="['flex items-center px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition', editUsername ? 'border' : 'border-0']"
          >
            <input
              v-model="user.username"
              type="text"
              :disabled="!editUsername"
              @keyup.enter="updateUser"
              placeholder="johndoe"
              class="flex-1 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="button"
              @click="editUsername = !editUsername"
              class="ml-2 text-gray-500 hover:text-gray-700"
            >✎</button>
          </div>
        </div>

        <div>
          <label class="block text-gray-500 text-sm mb-1">Contact No.</label>
          <div
            :class="['flex items-center px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition', editContact ? 'border' : 'border-0']"
          >
            <input
              v-model="user.contact"
              type="text"
              :disabled="!editContact"
              @keyup.enter="updateUser"
              placeholder="09123456789"
              class="flex-1 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="button"
              @click="editContact = !editContact"
              class="ml-2 text-gray-500 hover:text-gray-700"
            >✎</button>
          </div>
        </div>

        <div>
          <label class="block text-gray-500 text-sm mb-1">Gender</label>
          <div
            :class="['flex items-center px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition', editGender ? 'border' : 'border-0']"
          >
            <input
              v-model="user.gender"
              type="text"
              :disabled="!editGender"
              @keyup.enter="updateUser"
              placeholder="Male"
              class="flex-1 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="button"
              @click="editGender = !editGender"
              class="ml-2 text-gray-500 hover:text-gray-700"
            >✎</button>
          </div>
        </div>

        <div>
          <label class="block text-gray-500 text-sm mb-1">Address</label>
          <div
            :class="['flex items-center px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition', editAddress ? 'border' : 'border-0']"
          >
            <input
              v-model="user.address"
              type="text"
              :disabled="!editAddress"
              @keyup.enter="updateUser"
              placeholder="123 Anywhere St."
              class="flex-1 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="button"
              @click="editAddress = !editAddress"
              class="ml-2 text-gray-500 hover:text-gray-700"
            >✎</button>
          </div>
        </div>

        <!-- Submit -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-[#1E293B] hover:bg-[#162032] transition text-white font-semibold py-2 shadow-md"
          >Update Profile</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAccountLogic } from "../composables/useAccountLogic.js";

const { user, loadUser, uploadAvatar, updateUser } = useAccountLogic();

onMounted(() => {
  loadUser();
});

const editUsername = ref(false);
const editContact = ref(false);
const editGender = ref(false);
const editAddress = ref(false);

function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    uploadAvatar(file);
  }
}
</script>
