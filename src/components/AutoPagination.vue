<script setup>

defineProps({
  total:{
    type: Number,
    required: true,
  },
  page:{
    type: Number,
    required: false,
    default: 0,
  },
});

const emit = defineEmits(["goToPage"]);

const calculatePages = (total, limit = 10) => {
  let pages = 1;
  if (total && total > limit) {
    pages = Math.ceil(total / limit);
  }
  return (pages);
};

</script>

<template>
  <div v-if="total && total !== 0" class="flex flex-row pl-6 pr-2 justify-center rounded-b py-2">
    <!-- Pagination 7 pages or less -->
    <div v-if="calculatePages(total) < 7" class="btn-group">
      <button
        v-for="index of calculatePages(total)"
        :key="index"
        class="btn"
        :class="(page === index-1) ? 'btn-active' : ''"
        @click="emit('goToPage',(index-1))"
      >
        {{ index }}
      </button>
    </div>
    <!-- Pagination more than 7 pages -->
    <div v-else class="btn-group">
      <button
        class="btn"
        :class="page === 0 ? 'btn-disabled' : ''"
        @click="emit('goToPage',(page-1))"
      >
        «
      </button>
      <button class="btn">
        Page {{ page + 1 }}
      </button>
      <button
        class="btn"
        :class="page === calculatePages(total) - 1 ? 'btn-disabled' : ''"
        @click="emit('goToPage',(page + 1))"
      >
        »
      </button>
    </div>
  </div>
</template>
