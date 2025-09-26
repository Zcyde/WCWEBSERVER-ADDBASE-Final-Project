<template>
  <div class="flex h-screen w-full">
    <!-- Left side with blue background image -->
    <div class="w-1/2">
      <img src="../blueBg.jfif" alt="Background" class="w-full h-full object-cover" />
    </div>

    <!-- Right side with laptop + notebook image -->
    <div class="w-1/2">
      <img src="../laptopBg.jpg" alt="Laptop" class="w-full h-full object-cover" />
    </div>

    <!-- Login form (absolute positioned over left side) -->
    <div class="absolute inset-0 flex items-center justify-start">
        <div class="ml-[8%] bg-[#dcebf5]/95 p-8 rounded-lg shadow-xl w-[580px] text-center">
            <!-- Logo -->
            <div class="flex flex-col items-center gap-0">
                <img 
                    src="../dmLogo.png" 
                    alt="Logo" 
                    class="h-[200px] w-auto block align-top m-0 p-0" 
                />
                <h2 class="text-xl font-bold text-gray-800 -mt-10 mb-4 leading-tight">LOG IN</h2>
            </div>

            <!-- Actual form -->
            <form @submit.prevent="handleLogin">
            <!-- Username -->
            <input
                type="text"
                v-model="username"
                placeholder="Username"
                class="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            
            <!-- Password -->
            <input
                type="password"
                v-model="password"
                placeholder="Password"
                class="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <!-- Links row -->
            <div class="w-full flex justify-between text-sm mb-4">
                <!-- Create an account (left) -->
                <p class="text-gray-600">
                    Create an account?
                    <a href="/sign-in" class="font-semibold text-blue-600 hover:underline">Sign up</a>
                </p>
                <!-- Forgot password (right) -->
                <a href="#" class="text-blue-600 font-semibold hover:underline">
                    Forgot password?
                </a>
            </div>

            <!-- Buttons -->
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
</template>
