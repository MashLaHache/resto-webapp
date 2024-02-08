<script setup>
import { getRestaurants } from "../api/restaurants.js";
import { getRestaurantsGenres } from "../api/custom.js";
import { getUserFavoritesFormated } from "../api/custom.js";
import { query } from "../composables/useQuery.js";
import { ref, watch, onMounted } from "vue";
import { userCredentials } from "../composables/useCredentials.js";
import IconLoading from "../icons/IconLoading.vue";
import RangeSlider from "../components/RangeSlider.vue";
import RestaurantCard from "../components/RestaurantCard.vue";
import RestaurantMap from "../components/RestaurantMap.vue";
import SearchBar from "../components/SearchBar.vue";

const restaurants = ref();
const allGenres = await getRestaurantsGenres();
let page = 0;
let added = -1;
const loading = ref(false);
const favoritesLists = ref({ items:[], total:0 });
const favoriteRestaurants = ref(new Set);

const updateFavoritesList = async () => {
  if (userCredentials.token) {
    favoritesLists.value = await getUserFavoritesFormated(userCredentials.token, userCredentials.id); // won't throw and returns json or nothing.
  }
  getFavoriteRestaurants();
};

const getFavoriteRestaurants = () => {
  favoriteRestaurants.value.clear();
  for (const list of favoritesLists.value.items) {
    for (const restaurant of list.restaurants) {
      favoriteRestaurants.value.add(restaurant.id);
    }
  }
};
await updateFavoritesList();


const getQueryObject = () => {
  const queryObject = {
    ...(query.genre) && { genres: query.genre },
    ...(query.range) && { price_range: query.range },
    ...(query.search) && { q: query.search },
    ...(page) && { page: page },
  };
  if (query.search) {query.nearby = false;}
  if (query.nearby || query.map) {
    queryObject.lon = query.lon;
    queryObject.lat = query.lat;
    queryObject.limit = query.limit;
  }
  return queryObject;
};

const updateRestaurants = async () => {
  if (!query.map) {
    loading.value = true;
    page = 0;
    added = -1;
  }
  restaurants.value = await (await getRestaurants(undefined, getQueryObject()))?.json();
  if (!query.map) loading.value = false;
};

const addRestaurants = async () => {
  if (restaurants.value?.items.length === 0) return;
  const newRestaurants = await (await getRestaurants(undefined, getQueryObject()))?.json();
  if (newRestaurants?.items && newRestaurants?.items.length > 0) {
    restaurants.value.items = restaurants.value.items.concat(newRestaurants.items);
  }
  return newRestaurants.items.length;
};

onMounted(() => {
  document.addEventListener("scroll", (e) => onScroll(e));
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        query.lon = pos.coords.longitude;
        query.lat = pos.coords.latitude;
      },
      () => {
        query.nearby = false;
        updateRestaurants();
      }
      ,
    );
  }
});

const onScroll = async (event) => {
  if (query.map) return;
  const { scrollTop, clientHeight, scrollHeight } = event.target.scrollingElement;
  if ((scrollTop + clientHeight) >= (scrollHeight - 10)) {
    if (added !== 0) {
      page++;
      loading.value = true;
      added = await addRestaurants();
      loading.value = false;
    }
  }
};

watch(() => query, updateRestaurants, { deep:true });
await updateRestaurants();
</script>

<template>
  <!-- filter bar -->
  <div class="flex bg-accent text-accent-content justify-center m-auto flex-col md:flex-row w-full rounded-lg mb-2">
    <div class="flex justify-center m-auto flex-col md:flex-row w-full space-x-2 p-1">
      <!-- near me toggle -->
      <div class="form-control my-auto self-center">
        <label class="cursor-pointer label">
          <span class="label-text text-accent-content pr-1">Nearby : </span>
          <input
            v-model="query.nearby"
            type="checkbox"
            class="toggle toggle-primary"
            checked
          >
        </label>
      </div>
      <!-- map toggle -->
      <div class="form-control my-auto self-center">
        <label class="cursor-pointer label">
          <span class="label-text text-accent-content pr-1">Map : </span>
          <input
            v-model="query.map"
            type="checkbox"
            class="toggle toggle-primary"
            checked
          >
        </label>
      </div>
      <!-- tag search bar -->
      <div class="my-auto self-center">
        <SearchBar
          v-model="query.genre"
          placeholder="Genres"
          :options="allGenres"
          zone="tags-search"
          @update="updateRestaurants"
        />
      </div>
      <!-- price range slider -->
      <div class="my-2 self-center w-64">
        <RangeSlider v-model="query.range" @input="updateRestaurants" />
      </div>
    </div>
  </div>

  <!-- Restaurant Map -->

  <RestaurantMap
    v-if="restaurants?.items && query.map"
    :restaurants="restaurants"
    proximity
  />

  <!-- Restaurant List -->
  <div v-if="restaurants?.items && !query.map" class="grid 2xl:grid-cols-2 grid-cols-1 gap-2">
    <RestaurantCard
      v-for="restaurant in restaurants.items"
      :key="restaurant.id"
      class="bg-neutral text-neutral-content"
      :restaurant="restaurant"
      :favorites-lists="favoritesLists"
      :is-favorite="(favoriteRestaurants.has(restaurant.id))"
      @request-update="updateFavoritesList"
    />
  </div>
  <!-- Loading Icon -->
  <div v-if="!restaurants?.items || loading">
    <IconLoading />
  </div>
</template>

<style>
</style>