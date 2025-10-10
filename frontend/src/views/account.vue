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
        <!-- Username -->
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

        <!-- Email -->
        <div>
          <label class="block text-gray-500 text-sm mb-1">Email</label>
          <div
            :class="['flex items-center px-3 py-2 shadow-sm bg-gray-50 hover:bg-white transition', editEmail ? 'border' : 'border-0']"
          >
            <input
              v-model="user.email"
              type="text"
              :disabled="!editEmail"
              @keyup.enter="updateUser"
              placeholder="your@email.com"
              class="flex-1 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="button"
              @click="editEmail = !editEmail"
              class="ml-2 text-gray-500 hover:text-gray-700"
            >✎</button>
          </div>
        </div>

        <!-- Update button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-[#1E293B] hover:bg-[#162032] transition text-white font-semibold py-2 shadow-md"
          >Update Profile</button>
        </div>

        <!-- Change Password button -->
        <div class="pt-4">
          <button
            type="button" @click="showChangePasswordModal = true" class="w-full bg-[#1E293B] hover:bg-[#162032] transition text-white font-semibold py-2 shadow-md"
          >Change password</button>
        </div>

        <!-- Delete Account button -->
        <div class="pt-4 md:pr-80 ">
          <button
            type="button" @click="deleteAccount" class="w-full bg-red-600 hover:shadow-lg hover:from-red-500 transition-all text-white font-semibold py-2 shadow-md "
          >Delete Account</button>
        </div>
      </form>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showChangePasswordModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button
          @click="showChangePasswordModal = false"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
          title="Close"
        >
          ✕
        </button>

        <h3 class="text-xl font-bold text-gray-800 mb-6 text-center">Change Password</h3>

        <form @submit.prevent="handleChangePassword" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
              required
              class="w-full p-3 border border-gray-300 rounded-none shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              required
              class="w-full p-3 border border-gray-300 rounded-none shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="showChangePasswordModal = false"
              class="py-3 px-6 border border-gray-300 rounded-none shadow-sm text-base font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="py-3 px-6 border border-transparent rounded-none shadow-md text-base font-medium text-white bg-green-600 hover:bg-green-700 transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAccountLogic } from "../composables/useAccountLogic.js";

const { user, loadUser, uploadAvatar, updateUser, deleteAccount, changePassword } = useAccountLogic();

onMounted(() => {
  loadUser();
});

const editUsername = ref(false);
const editEmail = ref(false);
const showChangePasswordModal = ref(false);
const currentPassword = ref('');
const newPassword = ref('');

const handleChangePassword = async () => {
  try {
    await changePassword(currentPassword.value, newPassword.value);
    showChangePasswordModal.value = false;
    currentPassword.value = '';
    newPassword.value = '';
  } catch (error) {
    // Error handling is already in changePassword
    console.error('Password change failed:', error);
  }
};

function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    uploadAvatar(file);
  }
}
</script>
