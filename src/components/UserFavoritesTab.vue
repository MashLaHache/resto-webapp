<script setup>
import { router } from "../router/index.js";
import IconX from "../icons/IconX.vue";

defineProps({
  viewedUser: {
    type: Object,
    required: true,
  },
  loggedUser:{
    type: Object,
    required: true,
  },
  readOnly:{
    type: Boolean,
    required: false,
    default: true,
  },
  favoritesLists:{
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["add-favorites-list", "remove-favorites-list", "rename-favorites-list", "remove-favorite-restaurant"]);

const goToRestaurant = (id) => {
  router.push(`/restaurant/${id}`);
};

const addFavoritesList = (listName) => {
  emit("add-favorites-list", listName);
};

const removeFavoritesList = (listId) => {
  emit("remove-favorites-list", listId);
};

const renameFavoritesList = (listId, listName) => {
  emit("rename-favorites-list", { listId, listName });
};

const removeFavoriteRestaurant = (listId, restaurantId) => {
  emit("remove-favorite-restaurant", { listId, restaurantId });
};

const getRowClass = (index, length) => {
  let value;
  (index % 2 === 0) ? value = "bg-base-200" : value = "bg-base-300";
  (index === length - 1) ? value += " rounded-b" : "";
  return value;
};

</script>

<template>
  <!-- Lists -->
  <div class="column-1 xl:columns-3 md:columns-2 items-start gap-2 pt-2">
    <div v-if="(favoritesLists?.total > 0)">
      <!-- List -->
      <div
        v-for="list in favoritesLists.items"
        :key="list.id"
        class="flex flex-col pb-2 w-full break-inside-avoid-column"
      >
        <!-- Title -->
        <div class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded-t" :class="(list.restaurants?.length === 0) ? 'rounded-b' : ''">
          <div v-if="readOnly" class="text-xl pl-3 my-0.5 w-full text-ellipsis ... ">
            {{ list.name }}
          </div>
          <input
            v-if="!readOnly"
            class="input input-sm input-ghost hover:input-primary text-xl pl-3 my-0.5 w-full text-ellipsis ...  "
            :value="list.name"
            required
            @focusout="renameFavoritesList(list.id, $event.target.value)"
            @keyup.enter="$event.target.blur()"
          >
          <button v-if="!readOnly" @click="removeFavoritesList(list.id)">
            <IconX class="h-8 w-8 stroke-2" />
          </button>
        </div>
        <!-- Items -->
        <div v-if="(list.restaurants.length > 0)">
          <!-- Item -->
          <div
            v-for="restaurant, index of list.restaurants"
            :key="restaurant.id"
          >
            <div
              class="flex flex-row text-base-content pl-6 pr-2 py-1 justify-between"
              :class="getRowClass(index, list.restaurants.length)"
            >
              <div class="link" @click="goToRestaurant(restaurant.id)">
                {{ restaurant.name }}
              </div>
              <button v-if="!readOnly" @click="removeFavoriteRestaurant(list.id, restaurant.id)">
                <IconX class="h-5 w-5 stroke-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex flex-row cursor-pointer bg-secondary text-secondary-content font-black text-xl p-2 rounded">
        <div v-if="readOnly" class="text-xl  pl-3 my-0.5 w-full text-ellipsis ... " @click="router.push('/');">
          This user does not have any favorite restaurants.
        </div>
        <div v-else class="text-xl  pl-3 my-0.5 w-full text-ellipsis ... " @click="router.push('/');">
          Go find some favorite restaurants !
        </div>
      </div>
    </div>
    <div v-if="!readOnly" class="flex flex-col items-center justify-center">
      <div class="w-full">
        <div class="flex flex-row bg-secondary text-secondary-content rounded font-black text-xl pl-4 pr-2 pt-2.5 pb-2.5 justify-between">
          <input
            class="text-xl input input-sm input-ghost hover:input-primary w-full text-ellipsis ..."
            required
            placeholder="Add a new list !"
            @focusout="addFavoritesList($event.target.value);$event.target.value=''"
            @keyup.enter="$event.target.blur()"
          >
        </div>
      </div>
    </div>
  </div>
</template>
