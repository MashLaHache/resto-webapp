<script setup>
import { router } from "../router/index.js";
import { query } from "../composables/useQuery.js";

defineProps({
  tags: {
    type: Array,
    required: true,
  },
  range: {
    type: Number,
    required: true,
  },
});

const navigateToGenre = async (tag) => {
  query.genre = tag;
  await router.push({ path: "/" });
};

const navigateToRange = async (range) => {
  query.range = range.toString();
  await router.push({ path: "/" });
};

</script>

<template>
  <div class="mb-2 flex flex-row flex-wrap justify-items-start">
    <div
      class="btn btn-xs btn-secondary mr-2"
      @click="navigateToRange(range)"
    >
      {{ "$".repeat(range) }}
    </div>
    <div
      v-for="(tag,index) in tags"
      :key="index"
      class="btn btn-xs btn-secondary mr-2"
      @click="navigateToGenre(tag)"
    >
      {{ tag }}
    </div>
  </div>
</template>

<style></style>