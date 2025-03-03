<template>
  <div class="py-8 max-w-md mx-auto">
    <form
      @submit="handleSubmit"
      class="border border-[#333] rounded-lg p-6 shadow-md space-y-4"
    >
      <h2 class="text-2xl text-[#333] font-semibold text-center">Register</h2>

      <div>
        <label for="name" class="text-sm text-[#333] block mb-1"
          >Username</label
        >
        <input
          v-model="username"
          type="text"
          id="name"
          placeholder="Enter your full name"
          class="w-full px-4 py-2 border border-[#333] focus:ring-0 focus:outline-0 rounded-lg transition-all"
        />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">
          {{ errors.username }}
        </p>
      </div>

      <div>
        <label for="email" class="text-sm text-[#333] block mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          placeholder="Enter your email"
          class="w-full px-4 py-2 border border-[#333] focus:ring-0 focus:outline-0 rounded-lg transition-all"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">
          {{ errors.email }}
        </p>
      </div>

      <div>
        <label class="block text-sm text-gray-700">Password</label>
        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full px-4 py-2 border border-[#333] rounded-lg focus:ring-0 focus:outline-0"
            placeholder="Enter your password"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 p-2"
          >
            <img
              v-if="showPassword"
              src="../assets/images/eye-open.png"
              alt="Hide"
              class="w-6 h-auto"
            />
            <img
              v-else
              src="../assets/images/eye-closed.png"
              alt="Show"
              class="w-6 h-auto"
            />
          </button>
        </div>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">
          {{ errors.password }}
        </p>
      </div>

      <button
        type="submit"
        class="bg-[#333333] text-lg text-white p-[10px] cursor-pointer mt-4 w-full rounded-md hover:bg-gray-700 transition"
        :disabled="loading"
      >
        {{ loading ? "Registering..." : "Register" }}
      </button>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <span @click="login" class="text-[#333] hover:underline">Login</span>
      </p>
    </form>
  </div>
  <transition name="toast">
    <div
      v-if="showToast"
      class="fixed top-5 right-5 z-[99999] bg-[#f0efed] text-black px-4 py-3 rounded-md border border-gray-300 pointer-events-auto"
    >
      Registration successful!
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
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errors = ref({});
const loading = ref(false);
const showToast = ref(false);

const schema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
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

const login = () => {
  router.push("/login");
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
const handleSubmit = async (event) => {
  event.preventDefault();
  errors.value = {};

  try {
    await schema.validate(
      {
        username: username.value,
        email: email.value,
        password: password.value,
      },
      { abortEarly: false }
    );

    loading.value = true;
    await store.register(email.value, username.value, password.value);

    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push("/login");
    }, 1000);
  } catch (error) {
    if (error.response && error.response.data) {
      const backendErrors = error.response.data;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          if (err.code === "DuplicateUserName") {
            errors.value.username = "This username is already taken.";
          }
          if (err.code === "PasswordRequiresNonAlphanumeric") {
            errors.value.password =
              "Password must have at least one special character.";
          }
          if (err.code === "PasswordRequiresDigit") {
            errors.value.password =
              "Password must have at least one digit (0-9).";
          }
          if (err.code === "PasswordRequiresUpper") {
            errors.value.password =
              "Password must have at least one uppercase letter.";
          }
        });
      }
    } else if (error.inner) {
      error.inner.forEach((err) => {
        errors.value[err.path] = err.message;
      });
    } else {
      console.error("Unexpected error:", error);
    }
  } finally {
    loading.value = false;
  }
};
</script>
