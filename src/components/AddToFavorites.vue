<script setup>
import IconX from "../icons/IconX.vue";

defineProps({
  restaurant:{
    type: Object,
    required: true,
  },
  favoritesLists: {
    type: Object,
    required: true,
  },
  favoritesModalVisible:{
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggleFavorites", "addFavoritesList", "toggleRestaurant", "goToPage"]);

const getFavoriteState = (list, restaurant) => {
  return list.restaurants.some(item => item.id === restaurant.id);
};

</script>

<template>
  <!-- Main modal -->
  <div
    v-if="favoritesModalVisible"
    id="modal-main"
    tabindex="-1"
    class="fixed bg-black bg-opacity-50 z-20 w-full inset-0 grid place-items-center"
    @click="if($event.target.id === 'modal-main') {emit('toggleFavorites')};"
  >
    <!-- Modal content -->
    <div class="card w-96 glass relative rounded-lg shadow input-group text-secondary-content">
      <!-- X button -->
      <button class="absolute top-3 right-2.5 hover:bg-red rounded-lg p-1.5" @click="emit('toggleFavorites')">
        <IconX class="h-8 w-8 stroke-2" />
      </button>
      <div class="py-6 px-6 lg:px-8">
        <!-- Restaurant Name -->
        <h2 class="mb-4 text-xl text-primary mr-6">
          Add or remove {{ restaurant.name }} from your favorites.
        </h2>
      </div>
      <div v-if="!favoritesLists || !favoritesLists?.total || favoritesLists.total === 0" class="p-4">
        <div class="text-center">
          You don't have any favorites lists.
        </div>
      </div>
      <div v-else>
        <div
          v-for="list in favoritesLists.items"
          :key="list.id"
          class="flex flex-row px-4 py-1 my-1 mx-2 rounded font-bold text-base-content bg-base-300 bg-opacity-80"
        >
          <div class="flex-grow text-base-content">
            {{ list.name }}
          </div>
          <input
            type="checkbox"
            :checked="getFavoriteState(list, restaurant)"
            class="checkbox checkbox-primary"
            @change="emit('toggleRestaurant',{list, restaurant})"
          >
        </div>
      </div>
      <div class="p-2">
        <input
          class="text-xl input input-sm input-primary w-full mt-1 hover:input-primary text-ellipsis ..."
          required
          placeholder="Create a new list!"
          @focusout="emit('addFavoritesList',$event.target.value);$event.target.value=''"
          @keyup.enter="$event.target.blur()"
        >
      </div>
    </div>
  </div>
</template>