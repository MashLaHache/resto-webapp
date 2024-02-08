<script setup>
import MenuBar from "./components/MenuBar.vue";
import ToastModal from "./components/ToastModal.vue";
import MiniToast from "./components/MiniToast.vue";
import { theme } from "./composables/useTheme.js";
</script>

<template>
  <Suspense>
    <div :data-theme="theme.current">
      <ToastModal />
      <MiniToast />
      <main class="container min-h-screen px-1">
        <MenuBar />
        <router-view />
      </main>
    </div>
  </Suspense>
</template>
