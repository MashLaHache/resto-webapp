<script setup>
import { ref } from "vue";
defineProps({
  openingHours: {
    type: Object,
    required: true,
  },
});

const daysOfTheWeek = ref(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

</script>

<template>
  <div class="flex flex-col justify-between p-0.5">
    <div
      v-for="day of daysOfTheWeek"
      :key="day"
      class="flex flex-row border rounded-lg m-0.5 px-1"
    >
      <div class="w-24 p-0.5">
        {{ capitalizeFirstLetter(day) }}
      </div>
      <div class="w-full text-right p-0.5">
        {{ openingHours?.[day] }}
      </div>
    </div>
  </div>
</template>
