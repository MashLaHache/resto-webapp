<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["update:modelValue", "update"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    required: false,
    default: "Search",
  },
  zone: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const remainingOptions = ref([]);
const optionsVisible = ref(false);

// same as created hook
window.addEventListener("click", (event) => {
  if (!document.querySelector(`.${props.zone}`)?.contains(event.target)) {
    optionsVisible.value = false;
  }
});

const filter = () => {
  remainingOptions.value = props.options.filter(option => option.toLowerCase().includes(props.modelValue.toLowerCase())).slice(0, 30);
  if (remainingOptions.value.length === 0) {
    optionsVisible.value = false;
  } else {
    optionsVisible.value = true;
  }
};

watch(() => props.modelValue, () => {
  filter();
});

const selectItem = (text) => {
  emit("update:modelValue", text);
  emit("update", text);
  optionsVisible.value = false;
};

const updateModel = (text) => {
  emit("update:modelValue", text);
  if (text == "") {
    selectItem(text);
  }
};

</script>

<template>
  <div class="flex flex-col justify-center relative items-center">
    <form :class="zone">
      <input
        :value="modelValue"
        class="input w-[260px] text-neutral-content bg-neutral"
        type="search"
        name="search"
        :placeholder="placeholder"
        @input="updateModel($event.target.value)"
        @keydown.enter.prevent="selectItem(modelValue)"
        @emptied="selectItem(modelValue)"
      >
      <div v-if="optionsVisible" class="w-[260px] border-2 border-solid rounded-xl absolute z-20 text-left overflow-y-auto overflow-hidden max-h-[340px] bg-neutral text-neutral-content no-scrollbar">
        <div
          v-for="(option, index) in remainingOptions"
          :key="index"
          class="w-[256px] p-1 rounded-sm cursor-pointer"
          @click="selectItem($event.target.innerText)"
        >
          {{ option }}
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
          display: none;
}
</style>