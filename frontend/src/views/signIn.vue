<template>
  <div class="flex h-screen w-full">
    <!-- Left side with blue background image -->
    <div class="w-1/2">
      <img src="../laptopBg.jpg" alt="Background" class="w-full h-full object-cover" />
    </div>

    <!-- Right side with laptop + notebook image -->
    <div class="w-1/2">
      <img src="../blueBg.jfif" alt="Laptop" class="w-full h-full object-cover" />
    </div>

    <!-- Sign up form (absolute positioned over right side) -->
    <div class="absolute inset-0 flex items-center justify-end pr-45">
      <div class="ml-[8%] bg-[#dcebf5]/95 p-8 rounded-lg shadow-xl w-[580px] text-center">
        
        <!-- Logo -->
        <div class="flex flex-col items-center gap-0">
          <img src="../dmLogo.png" alt="Logo" class="h-[200px] w-auto" />
          <h2 class="text-xl font-bold text-gray-800 -mt-10 mb-4">SIGN UP</h2>
        </div>

        <!-- Actual form -->
        <form @submit.prevent="handleSignUp" class="space-y-4">
          
          <!-- First and Last Name -->
          <div class="flex gap-4">
            <input type="text" v-model="firstName" placeholder="First Name"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <input type="text" v-model="lastName" placeholder="Last Name"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <!-- Gender & Contact -->
          <div class="flex gap-4">
            <select v-model="gender"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="" disabled selected>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input type="text" v-model="contactNumber" placeholder="Contact Number"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <!-- Address -->
          <input type="text" v-model="address" placeholder="Address"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <!-- Date of Birth & Username -->
          <div class="flex gap-4">
            <input v-mask="'##/##/####'" type="text" v-model="birthDate" placeholder="MM/DD/YYYY"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <input type="text" v-model="username" placeholder="Username"
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>

          <!-- Password -->
          <input type="password" v-model="password" placeholder="Password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-[#f2f5e8] focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <!-- Reset & Create Account buttons -->
          <div class="flex gap-4">
            <button type="reset"
              class="w-1/2 bg-[#f2f2f2] text-gray-700 py-2 rounded-md border border-gray-300 hover:bg-gray-200 font-bold">
              Reset
            </button>
            
            <button type="submit"
              class="w-1/2 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-700 font-bold">
              Create Account
            </button>
          </div>

          <!-- Log In link -->
          <p class="text-center text-gray-700 text-sm mt-6">
            Already have an account?
            <a href="/login" class="font-semibold text-blue-600 hover:underline">Log In</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      gender: '',
      contactNumber: '',
      address: '',
      birthDate: '',
      username: '',
      password: ''
    }
  },
  methods: {
    handleSignUp() {
      console.log("Form submitted!", this.$data)
    }
  }
}
</script>
