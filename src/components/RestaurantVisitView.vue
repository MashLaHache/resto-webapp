<script setup>
import StarScore from "./StarScore.vue";
import IconX from "../icons/IconX.vue";
import { formatDate } from "../composables/useFormatDate.js";

const emit = defineEmits(["hide-modal"]);

defineProps({
  visit: {
    type:Object,
    required: true,
  },
  visible: {
    type:Boolean,
    required: true,
  },
});

</script>

<template>
  <!-- Main modal -->
  <div
    v-if="visible"
    id="modal-main"
    tabindex="-1"
    class="fixed bg-black bg-opacity-50 z-20 w-full inset-0 grid place-items-center"
    @click="if($event.target.id === 'modal-main') {emit('hide-modal')};"
  >
    <!-- Modal content -->
    <div class="card w-96 glass relative rounded-lg shadow input-group text-secondary-content">
      <!-- X button -->
      <button class="absolute top-3 right-2.5 hover:bg-red rounded-lg p-1.5" @click="emit('hide-modal');">
        <IconX class="h-8 w-8 stroke-2" />
      </button>
      <!-- Title -->
      <div class="py-6 px-6 lg:px-8 ">
        <h2 class="mb-4 text-xl font-medium mr-6">
          Visit at {{ visit.restaurant_name }}
        </h2>
        <div>
          <!-- Visit Date -->
          <div class="text-xs">
            Date:
          </div>
          <div class="mb-4">
            {{ formatDate(visit.date) }}
          </div>

          <!-- Review -->
          <div class="text-xs">
            Comment:
          </div>
          <div class="mb-4">
            {{ visit.comment }}
          </div>

          <!-- Score -->
          <div class="text-xs">
            Rating:
          </div>
          <div class="mb-4">
            <StarScore read-only :rating="visit.rating" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>