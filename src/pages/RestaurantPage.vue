<script setup>
import { ref, onMounted } from "vue";
import { getRestaurant } from "../api/restaurants.js";
import { getUserFavoritesFormated } from "../api/custom.js";
import { useRoute } from "vue-router";
import RestaurantCard from "../components/RestaurantCard.vue";
import { userCredentials } from "../composables/useCredentials.js";
import { Toast, toasts } from "../composables/useToasts.js";
import { query } from "../composables/useQuery.js";

const route = useRoute();
const restaurant = ref();
const favoritesLists = ref({ items:[], total:0 });
const favoriteRestaurants = ref(new Set);

const getCurrentRestaurant = async () => {
  try {
    const response = await getRestaurant(userCredentials.token, route.params.id);
    if (response.ok) {
      restaurant.value = await response.json();
    } else {
      toasts.push(new Toast("This page is not currently available.\nPlease try again later.", "OK", "/", "error", 5));
      return;
    }
  } catch (error) {
    toasts.push(new Toast(`This page is not currently available.\nPlease try again later.\n${error}`, "OK", "/", "error", 5));
    return;
  }
};
await getCurrentRestaurant();

onMounted(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        query.lon = pos.coords.longitude;
        query.lat = pos.coords.latitude;
      },
    );
  }
});

const updateFavoritesList = async () => {
  if (userCredentials.token) {
    favoritesLists.value = await getUserFavoritesFormated(userCredentials.token, userCredentials.id); // won't throw and returns json or nothing.
  }
  getFavoriteRestaurants();
};

const getFavoriteRestaurants = () => {
  favoriteRestaurants.value.clear();
  for (const list of favoritesLists.value.items) {
    for (const favoriteRestaurant of list.restaurants) {
      favoriteRestaurants.value.add(favoriteRestaurant.id);
    }
  }
};
await updateFavoritesList();
</script>

<template>
  <RestaurantCard
    :key="restaurant.id"
    :restaurant="restaurant"
    :favorites-lists="favoritesLists"
    :is-favorite="(favoriteRestaurants.has(restaurant.id))"
    :extended="true"
    @request-update="updateFavoritesList"
  />
</template>
