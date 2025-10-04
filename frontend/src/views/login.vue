<template>
    <div class="flex flex-col md:flex-row h-screen w-full">

      <!-- LEFT SIDE (Always visible) -->
      <div class="relative w-full md:w-1/2 h-full">
        <img src="../blueBg.jfif" alt="Background" class="w-full h-full object-cover" />

        <!-- LOGIN FORM -->
        <div class="absolute inset-0 flex items-center justify-center md:justify-start">
          <div class="bg-[#dcebf5]/95 p-8 rounded-lg shadow-xl w-[90%] max-w-[580px] mx-auto md:ml-[8%] text-center">

            <!-- Logo -->
            <div class="flex flex-col items-center gap-0">
              <img
                src="../dmLogo.png"
                alt="Logo"
                class="h-[200px] w-auto block align-top m-0 p-0"
              />
              <h2 class="text-xl font-bold text-gray-800 -mt-10 mb-4 leading-tight">LOG IN</h2>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin">
              <input
                type="text"
                v-model="username"
                placeholder="Username"
                class="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                v-model="password"
                placeholder="Password"
                class="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <!-- Error message -->
              <p v-if="errorMessage" class="text-red-500 text-sm mb-2">{{ errorMessage }}</p>

              <!-- ✅ Links side by side -->
              <div class="w-full text-xs mb-4 flex justify-between">
                <a href="#" class="text-blue-600 font-semibold hover:underline">
                  Forgot Password?
                </a>
                <p class="text-gray-600">
                  Don’t have an account?
                  <a href="/sign-in" class="font-semibold text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </div>

              <div class="flex gap-2">
                <button
                  type="submit"
                  class="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 font-bold"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE IMAGE (DESKTOP ONLY) -->
      <div class="hidden md:block w-1/2 h-full">
        <img src="../laptopBg.jpg" alt="Laptop" class="w-full h-full object-cover" />
      </div>

    </div>
  </template>

  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '../services/api.js';

  export default {
    setup() {
      const username = ref('');
      const password = ref('');
      const router = useRouter();
      const errorMessage = ref('');

      const handleLogin = async () => {
        try {
          const response = await api.post('/login', {
            username: username.value,
            password: password.value,
          });

          // Store token and user in localStorage
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));

          // Redirect to root instead of /dashboard
          router.push('/');
        } catch (error) {
          errorMessage.value = error.response?.data?.error || 'Login failed';
        }
      };

      return {
        username,
        password,
        handleLogin,
        errorMessage,
      };
    },
  };
  </script>
