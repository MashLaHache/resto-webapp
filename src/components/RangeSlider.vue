<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: "1,2,3,4,5",
  },
});

const emit = defineEmits(["update:modelValue"]);

const min = ref (0);
const max = ref (4);
const minValue = ref (0);
const maxValue = ref (4);
const minGap = 0;
const displayMin = ref ("$");
const displayMax = ref ("$$$$$");
const style = ref ({});

const updateMin = () => {
  if (maxValue.value - minValue.value <= minGap) {
    maxValue.value = minValue.value - minGap;
  }
  updateInput();
};

const updateMax = () => {
  if (maxValue.value - minValue.value <= minGap) {
    minValue.value = maxValue.value - minGap;
  }
  updateInput();
};

const updateInput = () => {
  const percentMin = (minValue.value / max.value) * 100;
  const percentMax = (maxValue.value / max.value) * 100;
  displayMin.value = "$" + "$".repeat(minValue.value);
  displayMax.value = "$" + "$".repeat(maxValue.value);
  style.value = {
    background: `linear-gradient(to right, rgba(0,0,0,0) ${percentMin}% , #666666 ${percentMin}% , #666666 ${percentMax}%, rgba(0,0,0,0) ${percentMax}%)`,
    color:"#3264fe",
  };
  let rangeString = "";
  const range = [(parseInt(minValue.value) + 1), (parseInt(maxValue.value) + 1)];
  if (range) {
    rangeString = range[0].toString();
    for (let index = range[0] + 1; index <= range[1]; index++) {
      rangeString = rangeString + "," + index;
    }
  }
  emit("update:modelValue", rangeString);
};

const updateSliderFromValueString = () => {
  const values = props.modelValue.split(",");
  if (props.modelValue) {
    minValue.value = values[0] - 1;
    maxValue.value = values[values.length - 1] - 1;
  }
  updateInput();
};

watch(() => props.modelValue, updateSliderFromValueString);
updateSliderFromValueString();
updateInput();
</script>

<template>
  <div class="flex flex-row min-w-[12rem]">
    <div class="px-1 flex flex-col w-full">
      <div class="px-1 flex flex-row justify-between text-xs text-accent-content">
        <span>
          {{ displayMin }}
        </span>
        <span>
          {{ displayMax }}
        </span>
      </div>
      <div class="relative m-auto top-0 bottom-0 h-4 w-full">
        <input
          v-model="minValue"
          class="w-full absolute h-1 appearance-none outline-none m-auto top-0 bottom-0 pointer-events-none"
          type="range"
          :min="min"
          :max="max"
          step="1"
          :style="style"
          @input="updateMin()"
        >
        <input
          v-model="maxValue"
          class="w-full absolute h-1 appearance-none outline-none m-auto top-0 bottom-0 pointer-events-none"
          type="range"
          :min="min"
          :max="max"
          step="1"
          :style="style"
          @input="updateMax()"
        >
      </div>
    </div>
  </div>
</template>

<style>
input[type="range"] {
  appearance: none;
  height: 7px;
  border-radius: 7px;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 15px;
  background: #ffffff;
  cursor: pointer;
  pointer-events: auto;
}

input[type=range]::-webkit-slider-runnable-track  {
  appearance: none;
  box-shadow: none;
  z-index: 10;
  border: none;
  background: transparent;
}
</style>