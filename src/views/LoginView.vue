<template>
  <div class="py-8 max-w-md mx-auto">
    <form @submit="handleSubmit" class="border border-[#333] rounded-lg p-6 shadow-md space-y-4">
      <h2 class="text-2xl text-[#333] font-semibold text-center">Login</h2>

      <div>
        <label for="username" class="text-sm text-[#333] block mb-1">Username</label>
        <input v-model="username" type="text" id="username" placeholder="Enter your username"
          class="w-full px-4 py-2 border border-[#333] focus:ring-0 focus:outline-0 rounded-lg transition-all" />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">
          {{ errors.username }}
        </p>
      </div>

      <div>
        <label for="password" class="block text-sm text-[#333] mb-1">Password</label>
        <div class="relative">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
            class="w-full px-4 py-2 border border-[#333] rounded-lg focus:ring-0 focus:outline-0"
            placeholder="Enter your password" />
          <button type="button" @click="togglePassword"
            class="absolute cursor-pointer right-3 top-2/4 transform -translate-y-1/2">
            <img v-if="showPassword" src="../assets/images/eye-open.png" alt="Hide" class="w-6 h-6" />
            <img v-else src="../assets/images/eye-closed.png" alt="Show" class="w-6 h-6" />
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <button type="submit"
        class="bg-[#333333] text-lg text-white p-[10px] cursor-pointer mt-4 w-full rounded-md hover:bg-gray-700 transition"
        :disabled="loading">
        {{ loading ? "Logging in..." : "Login" }}
      </button>

      <p class="text-center text-sm text-gray-600">
        Don't have an account?
        <span @click="register" class="text-[#333] cursor-pointer hover:underline">Sign up</span>
      </p>
    </form>
  </div>

  <transition name="toast">
    <div v-if="showToast"
      class="fixed top-5 right-5 z-[99999] bg-[#f0efed] text-black px-4 py-3 rounded-md border border-gray-300 shadow-lg pointer-events-auto">
      Login successful!
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import { useAuthStore } from "../store/auth.ts";

const store = useAuthStore();
const router = useRouter();

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const errors = ref({});
const loading = ref(false);
const showToast = ref(false);
const register = () => {
  router.push("/register");
};
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(12, "Password must be at least 12 characters")
    .matches(/[A-Z]/, "Password must have at least one uppercase letter")
    .matches(/\d/, "Password must have at least one digit (0-9)")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must have at least one special character"
    )
    .required("Password is required"),
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  errors.value = {};

  try {
    await schema.validate(
      { username: username.value, password: password.value },
      { abortEarly: false }
    );

    loading.value = true;

    const response = await store.login(username.value, password.value);

    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push("/");
    }, 1000);
  } catch (err) {
    if (err.response?.data) {
      const errorMessage = err.response.data;

      if (errorMessage === "Invalid username!") {
        errors.value.username = "Username does not exist";
      } else if (
        errorMessage === "Username not found and/or password incorrect"
      ) {
        errors.value.password = "Incorrect password";
      }
    } else if (err.inner) {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    } else {
      console.error("Unexpected error:", err);
    }
  } finally {
    loading.value = false;
  }
};
</script>
