<script setup>

const emit = defineEmits(["update:rating"]);

const props = defineProps({
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  readOnly: {
    type: Boolean,
    required: false,
    default: true,
  },
});


const isChecked = (value) => {
  return value >= props.rating ? true : false;
};

const returnRating = (value) => {
  if (props.readOnly) return;
  emit("update:rating", Math.round(value));
};

</script>

<template>
  <div class="inline-flex align-middle items-center">
    <div v-if="readOnly" class="rating rating-half">
      <input
        type="radio"
        :checked="isChecked(0.5)"
        disabled
        class="mask mask-heart cursor-default mask-half-1 bg-red-400"
      >
      <input
        type="radio"
        :checked="isChecked(1.0)"
        disabled
        class="mask mask-heart cursor-default mask-half-2 bg-red-400 mr-1"
      >
      <input
        type="radio"
        :checked="isChecked(1.5)"
        disabled
        class="mask mask-heart cursor-default mask-half-1 bg-orange-400"
      >
      <input
        type="radio"
        :checked="isChecked(2.0)"
        disabled
        class="mask mask-heart cursor-default mask-half-2 bg-orange-400 mr-1"
      >
      <input
        type="radio"
        :checked="isChecked(2.5)"
        disabled
        class="mask mask-heart cursor-default mask-half-1 bg-yellow-400"
      >
      <input
        type="radio"
        :checked="isChecked(3.0)"
        disabled
        class="mask mask-heart cursor-default mask-half-2 bg-yellow-400 mr-1"
      >
      <input
        type="radio"
        :checked="isChecked(3.5)"
        disabled
        class="mask mask-heart cursor-default mask-half-1 bg-lime-400"
      >
      <input
        type="radio"
        :checked="isChecked(4.0)"
        disabled
        class="mask mask-heart cursor-default mask-half-2 bg-lime-400 mr-1"
      >
      <input
        type="radio"
        :checked="isChecked(4.5)"
        disabled
        class="mask mask-heart cursor-default mask-half-1 bg-green-400"
      >
      <input
        type="radio"
        :checked="isChecked(5.0)"
        disabled
        class="mask mask-heart cursor-default mask-half-2 bg-green-400 mr-1"
      >
    </div>
    <div v-if="!readOnly" class="rating">
      <input
        type="radio"
        :checked="isChecked(1.0)"
        class="mask mask-heart bg-red-400 mr-1"
        @click="returnRating(1.0)"
      >
      <input
        type="radio"
        :checked="isChecked(2.0)"
        class="mask mask-heart bg-orange-400 mr-1"
        @click="returnRating(2.0)"
      >
      <input
        type="radio"
        :checked="isChecked(3.0)"
        class="mask mask-heart bg-yellow-400 mr-1"
        @click="returnRating(3.0)"
      >
      <input
        type="radio"
        :checked="isChecked(4.0)"
        class="mask mask-heart bg-lime-400 mr-1"
        @click="returnRating(4.0)"
      >
      <input
        type="radio"
        :checked="isChecked(5.0)"
        class="mask mask-heart bg-green-400 mr-1"
        @click="returnRating(5.0)"
      >
    </div>
    <span class="inline-block align-middle px-2 py-1 rounded font-bold my-auto">{{ props.rating.toFixed(2) }}</span>
  </div>
</template>