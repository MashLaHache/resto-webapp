<script setup>
import SearchBar from "./SearchBar.vue";
import { getRestaurantsNames } from "../api/custom.js";
import { ref, watch } from "vue";
import { router } from "../router/index.js";
import { theme } from "../composables/useTheme.js";
import { useCredentials, userCredentials } from "../composables/useCredentials.js";
import { Toast, toasts } from "../composables/useToasts.js";
import { logout } from "../api/login.js";
import { query } from "../composables/useQuery";
import IconUser from "../icons/IconUser.vue";
import IconSun from "../icons/IconSun.vue";
import IconMoon from "../icons/IconMoon.vue";
import IconUfood from "../icons/IconUfood.vue";
import { gravatar } from "../composables/useGravatar.js";

useCredentials();

const restaurantsNames = ref(await getRestaurantsNames());
const isDropdownVisible = ref(false);
const toggleProfileDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const pushSearch = async () => {
  await router.push({ path: "/" });
};


const logoutUser = async () => {
  const response = await logout(userCredentials?.token);
  useCredentials("");
  if (response.ok) {
    toasts.push(new Toast("You are logged out", "OK", "/login", "success", 2));
  } else {
    toasts.push(new Toast(`Unable to logout from server.\nLogged out locally.\n${response.statusText}`, "OK", undefined, "error"));
  }
};

const darkmode = ref(true);

watch(darkmode, () => {
  if (darkmode.value) {
    theme.current = "coffee";
  } else {
    theme.current = "cupcake";
  }
});

</script>

<template>
  <nav class="mx-auto bg-primary relative rounded-b-lg mb-1 text-primary-content">
    <div class="flex flex-col md:flex-row items-center md:justify-end pb-4 md:pb-0">
      <!-- LOGO -->
      <router-link to="/" class="p-4" @click="query.search='';query.genre='';query.range='1,2,3,4,5';query.map=false">
        <IconUfood class="h-12 hover:scale-110 ease-in duration-100" />
      </router-link>

      <!-- SearchBar -->
      <div class="">
        <SearchBar
          v-model="query.search"
          placeholder="Search"
          :options="restaurantsNames"
          zone="main-search"
          @update="pushSearch"
        />
      </div>

      <!-- Spacer -->
      <div class="flex-grow" />

      <!-- Dark Mode -->
      <div class="w-10 mx-5 my-2">
        <label class="swap swap-rotate hover:scale-110 ease-in duration-100">
          <!-- this hidden checkbox controls the state -->
          <input v-model="darkmode" type="checkbox">
          <!-- sun icon -->
          <IconSun class="swap-off fill-current w-10 h-10" />
          <!-- moon icon -->
          <IconMoon class="swap-on fill-current w-10 h-10" />

        </label>
      </div>

      <!-- login Link -->
      <div v-if="!userCredentials.id" class="flex flex-row w-fit pt-2 md:pt-0 cursor-pointer" @click="router.push('/login')">
        <div class="my-auto text-md pr-3 font-bold">
          Login
        </div>
        <div class="my-auto md:pr-6">
          <IconUser class="h-10 w-10 stroke-2 hover:scale-110 ease-in duration-100" />
        </div>
      </div>

      <!-- UserName / Menu -->
      <div v-if="userCredentials.id" class="flex flex-row w-fit pt-2 md:pt-0 cursor-pointer" @click="toggleProfileDropdown">
        <div class="my-auto text-md pr-3 font-bold max-w-[12rem] text-ellipsis ... overflow-hidden whitespace-nowrap">
          {{ userCredentials?.name }}
        </div>
        <div class="my-auto md:pr-6">
          <img :src="gravatar(userCredentials.email)" class="avatar rounded-full ring h-10 w-10 hover:scale-110 ease-in duration-100">
        </div>
      </div>
    </div>

    <!-- User Popup -->
    <div v-if="isDropdownVisible" class="absolute left-0 md:left-auto right-2 w-fit mx-auto text-center z-20 rounded-xl bg-secondary text-secondary-content shadow-xl" @click="toggleProfileDropdown">
      <ul class="mx-auto text-center">
        <router-link :to="`/user/${userCredentials.id}`">
          <li class="block p-4 hover:bg-secondary-focus rounded-xl">
            Profile page
          </li>
        </router-link>
        <li class="block p-4 cursor-pointer hover:bg-secondary-focus rounded-xl" @click="logoutUser">
          Sign out
        </li>
      </ul>
    </div>
  </nav>
</template>

<style>

</style>