<template>
  <nav
    class="py-4 bg-[#f0efed] sticky top-0 w-full lg:px-[70px] xl:px-[90px] md:px-[35px] sm:px-[30px] px-[15px] text-[#333333] flex items-center max-md:justify-between"
  >
    <div class="text-xl mr-auto font-semibold">
      <span v-if="isAuthenticated">Welcome, {{ user?.username }}</span>
    </div>

    <div class="sticky left-1/2 transform -translate-x-1/2">
      <button
        @click="home"
        class="text-3xl cursor-pointer font-doodle font-bold"
      >
        Note with Jess
      </button>
    </div>

    <button
      v-if="!isAuthenticated"
      @click="login"
      class="bg-[#333333] text-lg text-white px-[20px] cursor-pointer py-[6px] ml-auto w-fit rounded-md hover:bg-gray-700 transition"
    >
      Login
    </button>

    <button
      v-else
      @click="logout"
      class="bg-[#333333] text-lg text-white px-[20px] cursor-pointer py-[6px] ml-auto w-fit rounded-md hover:bg-[#444444] transition"
    >
      Logout
    </button>
  </nav>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, watchEffect } from "vue";
import { useAuthStore } from "../store/auth.ts";

const router = useRouter();
const store = useAuthStore();

const isAuthenticated = ref(store.isAuthenticated);
const user = ref(store.user);

watchEffect(() => {
  isAuthenticated.value = store.isAuthenticated;
  user.value = store.user;
});

const home = () => {
  router.push("/");
};

const login = () => {
  router.push("/login");
};

const logout = () => {
  store.logout();
};
</script>
