<script setup>
import { router } from "../router/index.js";

const goHome = () => {
  router.push("/");
};

</script>

<template>
  <div class="hero min-h-screen rounded-xl" style="background-image: url(src/assets/lost.jpg);">
    <div class="hero-overlay bg-opacity-60 rounded-xl" />
    <div class="hero-content text-center text-white">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">
          Hello there !
        </h1>
        <p class="mb-5">
          Looks like you got lost. Click the button below to go back home.
        </p>
        <button class="btn btn-primary" @click="goHome()">
          Bring me back home !
        </button>
      </div>
    </div>
  </div>
</template>