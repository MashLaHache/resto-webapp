<script setup>
import { watch } from "vue";
import { toasts } from "../composables/useToasts.js";
import { router } from "../router/index.js";

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

const navigateTo = async (uuid, target) => {
  const index = toasts.findIndex(toast => toast.uuid === uuid);
  if (index === -1) return;
  toasts.splice(index, 1);
  if (target) {
    await router.push(target);
  }
};

watch(toasts, async (newToast) => {
  // disable scrolling on parent
  if (toasts.length > 0) {
    document.querySelector("body").style.overflow = "hidden";
  } else {
    document.querySelector("body").style.overflow = "auto";
  }

  if (newToast.length === 0) return;
  const uuid = newToast[newToast.length - 1].uuid;
  const target = newToast[newToast.length - 1]?.target;
  if (uuid === lastUUID) return;
  lastUUID = uuid;
  setTimeout(() => {navigateTo(uuid, target);}, 3000);

});

watch(toasts, async () => {
  if (toasts[0]?.timeout) {
    setTimeout(() => {navigateTo(toasts[0]?.target);}, toasts[0].timeout * 1000);
  }
  // disable scrolling on parent
  if (toasts.length > 0) {
    document.querySelector("body").style.overflow = "hidden";
  } else {
    document.querySelector("body").style.overflow = "auto";
  }
});

</script>

<template>
  <div v-if="(toasts.length > 0)" class="bg-black bg-opacity-50 absolute z-50 flex items-center justify-center inset-0">
    <div class="flex flex-col w-fit min-w-[26rem] min-h-[10rem] alert shadow-lg font-bold" :class="getClass(toasts[0].type)">
      <pre>{{ toasts[0].message }}</pre>
      <button class="btn btn-active btn-primary self-end" @click="navigateTo(toasts[0].uuid, toasts[0]?.target)">
        {{ toasts[0].button }}
      </button>
    </div>
  </div>
</template>

<style></style>