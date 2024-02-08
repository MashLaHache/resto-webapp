<script setup>
import { createFavorite, deleteFavorite, createFavoritesList } from "../api/favorites.js";
import { ref } from "vue";
import { toasts, Toast, miniToasts, MiniToast } from "../composables/useToasts";
import { userCredentials } from "../composables/useCredentials.js";
import AddToFavorites from "./AddToFavorites.vue";
import IconStar from "../icons/IconStar.vue";
import RestaurantOpenHour from "../components/RestaurantOpenHour.vue";
import RestaurantVisitModal from "./RestaurantVisit.vue";
import StarScore from "./StarScore.vue";
import TagList from "./TagList.vue";
import RestaurantMap from "./RestaurantMap.vue";

const props = defineProps({
  restaurant: {
    type: Object,
    required: true,
  },
  favoritesLists: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    required: true,
  },
  extended: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["requestUpdate"]);

const favoritesModalVisible = ref(false);
const visitModalVisible = ref(false);
const trimmedPictures = ref();
const routeMode = ref(false);

const formatAddress = (address) => {
  const blocks = [];
  for (const block of address.split(",")) {
    blocks.push(block.trim());
  }
  return blocks.join("\n");
};

const toggleVisits = () => {
  visitModalVisible.value = !visitModalVisible.value;
};

const toggleFavorites = () => {
  favoritesModalVisible.value = !favoritesModalVisible.value;
};

const addFavoritesList = async (listName) => {
  try {
    const response = await createFavoritesList(userCredentials.token, listName);
    if (response.ok) {
      miniToasts.push(new MiniToast(`Created favorites list: ${listName}.`, "success"));
    } else {
      toasts.push(new Toast("Unable to create this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to create this list.\n${error}`, "OK", undefined, "error", 5));
  }
  emit("requestUpdate");
};

const addRestaurantToList = async (list, restaurant) => {
  try {
    const response = await createFavorite(userCredentials.token, list.id, restaurant.id);
    if (response.ok) {
      miniToasts.push(new MiniToast(`${restaurant.name} was added to ${list.name}`, "success"));
    } else {
      toasts.push(new Toast("Unable to add this restaurant to this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to add this restaurant to this list.\n${error}`, "OK", undefined, "error", 5));
  }
  emit("requestUpdate");
};

const removeFavoriteRestaurant = async (list, restaurant) => {
  try {
    const response = await deleteFavorite(userCredentials.token, list.id, restaurant.id);
    if (response.ok) {
      miniToasts.push(new MiniToast(`${restaurant.name} was removed from ${list.name}`, "warning"));
    } else {
      toasts.push(new Toast("Unable to remove this restaurant from this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to remove this restaurant from this list.\n${error}`, "OK", undefined, "error", 5));
  }
  emit("requestUpdate");
};

const getFavoriteState = (list, restaurant) => {
  return list.restaurants.some(item => item.id === restaurant.id);
};

const toggleRestaurant = async ({ list, restaurant }) => {
  const isFavorite = getFavoriteState(list, restaurant);
  if (isFavorite) {
    await removeFavoriteRestaurant(list, restaurant);
  } else {
    await addRestaurantToList(list, restaurant);
  }
};

const removeFirstPicture = () => {
  const pictures = [...props.restaurant.pictures];
  trimmedPictures.value = pictures.splice(1);
};
removeFirstPicture();

const scrollTo = (id) => {
  if (id === "map") { routeMode.value = true;}
  document.getElementById(id).scrollIntoView({
    behavior: "smooth",
  });
};
</script>

<template>
  <div class="w-full mx-auto rounded-xl">
    <AddToFavorites
      :restaurant="restaurant"
      :favorites-modal-visible="favoritesModalVisible"
      :favorites-lists="favoritesLists"
      @toggle-favorites="toggleFavorites"
      @add-favorites-list="addFavoritesList"
      @toggle-restaurant="toggleRestaurant"
    />
    <RestaurantVisitModal
      :restaurant="restaurant"
      :visit-modal-visible="visitModalVisible"
      @toggle-visits="toggleVisits"
    />

    <div
      class="rounded-xl"
      :class="extended ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto gap-2':'flex flex-col md:flex-row'"
    >
      <!-- B1 Image -->
      <div class="flex-none">
        <img
          class="object-cover max-h-80 w-full md:h-80 md:w-96 "
          :class="extended ? 'rounded-xl': 'md:rounded-l-xl rounded-xl md:rounded-none'"
          :src="restaurant.pictures[0]"
          alt=""
        >
      </div>
      <!-- B2 Info main -->
      <div class="flex flex-col space-y-2 my-2 mx-3 overflow-hidden flex-grow">
        <!-- Restaurant Name -->
        <div class="inline-flex space-x-2 my-2 tooltip tooltip-info tooltip-bottom z-10" :data-tip="(restaurant.name)">
          <IconStar
            v-if="userCredentials?.token"
            class="h-8 w-8 min-w-fit stroke-2 stroke-primary cursor-pointer hover:stroke-primary-focus hover:scale-110 ease-in duration-100"
            :class="isFavorite ? 'fill-primary hover:fill-primary-focus' : 'fill-none'"
            @click="toggleFavorites"
          />
          <router-link class="text-left text-2xl text-accent hover:text-accent-focus font-bold text-ellipsis ... whitespace-nowrap overflow-hidden" :to="`/restaurant/${restaurant.id}`">
            {{ restaurant.name }}
          </router-link>
        </div>

        <!-- Restaurant Score -->
        <div>
          <StarScore :rating="restaurant.rating" />
        </div>

        <!-- Restaurant Address -->
        <pre class="text-left flex-grow">{{ formatAddress(restaurant.address) }}</pre>

        <!-- Restaurant Tags -->
        <TagList :tags="restaurant.genres" :range="restaurant.price_range" />
        <button
          v-if="userCredentials?.token"
          class="btn btn-sm btn-accent mt-4"
          @click="toggleVisits"
        >
          Write a review
        </button>
      </div>
      <!-- B3 Info -->
      <div v-if="extended" class="">
        <div class="flex-grow p-1 space-y-1">
          <div class="">
            <a :href="`tel:+${restaurant.tel}`">
              <button class="btn btn-sm btn-accent text-accent-content w-full">
                📞 Call {{ restaurant.tel }}
              </button>
            </a>
          </div>
          <div>
            <button class="btn btn-sm btn-accent text-accent-content w-full" @click="scrollTo('map')">
              📍 Navigate to
            </button>
          </div>
        </div>
        <div class="w-full">
          <RestaurantOpenHour :opening-hours="restaurant.opening_hours" class="w-full" />
        </div>
      </div>
      <!-- BX Images -->
      <div v-for="(picture, index) in trimmedPictures" :key="index">
        <img
          v-if="extended"
          class="h-80 w-full md:h-80 md:w-96 object-cover rounded-xl"
          :src="`${picture}`"
          alt=""
        >
      </div>
    </div>

    <div v-if="extended" class="max-w-6xl mx-auto pt-2">
      <button class="btn btn-sm btn-accent text-accent-content w-full" @click="scrollTo('map')">
        📍 Navigate to
      </button>
      <RestaurantMap
        :restaurant="restaurant"
        :single="!routeMode"
        :route="routeMode"
      />
    </div>
    <div id="map" />
  </div>
</template>