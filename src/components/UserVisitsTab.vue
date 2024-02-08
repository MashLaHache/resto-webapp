<script setup>
import { ref } from "vue";
import { router } from "../router/index.js";
import StarScore from "./StarScore.vue";
import RestaurantVisitView from "./RestaurantVisitView.vue";
import { formatDate } from "../composables/useFormatDate.js";

defineProps({
  visitsList:{
    type: Object,
    required: true,
  },
  readOnly:{
    type: Boolean,
    required: false,
    default: true,
  },
});

const viewedVisit = ref({});
const modalVisible = ref(false);

const goToRestaurant = (id) => {
  router.push(`/restaurant/${id}`);
};

const getRowClass = (index, length) => {
  let value;
  (index % 2 === 0) ? value = "bg-base-200" : value = "bg-base-300";
  (index === length - 1) ? value += " rounded-b" : "";
  return value;
};

</script>

<template>
  <RestaurantVisitView :visit="viewedVisit" :visible="modalVisible" @hide-modal="modalVisible=false" />
  <!-- List -->
  <div class="column-1 xl:columns-3 md:columns-2 items-start gap-2 pt-2">
    <div v-if="(visitsList?.length > 0)">
      <!-- Restaurants  -->
      <div
        v-for="restaurant of visitsList"
        :key="restaurant.id"
        class="flex flex-col pb-2 w-full break-inside-avoid-column"
      >
        <!-- Restaurant Name -->
        <div class="flex flex-row cursor-pointer bg-secondary text-secondary-content font-black text-xl p-2 rounded-t" :class="(restaurant.visits?.length === 0) ? 'rounded-b' : ''">
          <div class="text-xl  pl-3 my-0.5 w-full text-ellipsis ... " @click="goToRestaurant(restaurant.id)">
            {{ restaurant.name }}
          </div>
          <div class="pr-2">
            {{ restaurant.visits.length }}
          </div>
        </div>
        <!-- Items -->
        <div
          v-for="visit,index, of restaurant.visits"
          :key="visit.id"
        >
          <div
            class="flex flex-row text-base-content pl-6 pr-2 py-1 justify-between cursor-pointer"
            :class="getRowClass(index, restaurant.visits.length)"
            @click="modalVisible=true;viewedVisit=visit"
          >
            <div class="flex-grow my-auto">
              {{ formatDate(visit.date) }}
            </div>
            <StarScore :read-only="true" :rating="visit.rating" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-row cursor-pointer bg-secondary text-secondary-content font-black text-xl p-2 rounded">
        <div v-if="readOnly" class="text-xl  pl-3 my-0.5 w-full text-ellipsis ... " @click="router.push('/');">
          This user did not review any restaurants.
        </div>
        <div v-else class="text-xl  pl-3 my-0.5 w-full text-ellipsis ... " @click="router.push('/');">
          Go review some restaurants !
        </div>
      </div>
    </div>
  </div>
</template>
