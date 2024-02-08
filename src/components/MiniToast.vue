<script setup>
import { watch } from "vue";
import { miniToasts } from "../composables/useToasts.js";

const getClass = (type) => {
  let alertType;
  switch (type) {
    case "info":
      alertType = "alert-info alert-info-content";
      break;
    case "success":
      alertType = "alert-success alert-success-content";
      break;
    case "warning":
      alertType = "alert-warning alert-warning-content";
      break;
    case "error":
      alertType = "alert-error alert-error-content";
      break;
    default:
      alertType = "alert-error alert-error-content";
      break;
  }
  return alertType;
};

let lastUUID;

const clear = async (uuid) => {
  const index = miniToasts.findIndex(toast => toast.uuid === uuid);
  if (index === -1) return;
  miniToasts.splice(index, 1);
};

watch(miniToasts, async (newToast) => {
  if (newToast.length === 0) return;
  const uuid = newToast[newToast.length - 1].uuid;
  if (uuid === lastUUID) return;
  lastUUID = uuid;
  setTimeout(() => {clear(uuid);}, 3000);
});

</script>

<template>
  <div v-if="(miniToasts.length > 0)" class="toast toast-end z-50">
    <div v-for="toasts of miniToasts" :key="toasts.uuid">
      <div class="alert cursor-pointer" :class="getClass(toasts.type)" @click="clear(toasts.uuid)">
        <span>{{ toasts.message }}</span>
      </div>
    </div>
  </div>
</template>

<style></style>