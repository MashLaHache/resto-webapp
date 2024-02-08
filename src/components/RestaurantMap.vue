<script setup>
import { query } from "../composables/useQuery";
import { ref, watch } from "vue";
import { MapboxMap, MapboxMarker } from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import StarScore from "./StarScore.vue";
import { smartFetch } from "../api/api.js";
import { Toast, toasts } from "../composables/useToasts";


const props = defineProps({
  single: {
    type:Boolean,
    required: false,
    default: false,
  },
  route: {
    type:Boolean,
    required: false,
    default: false,
  },
  proximity: {
    type:Boolean,
    required: false,
    default: false,
  },
  restaurant: {
    type:Object,
    required: false,
    default: undefined,
  },
  restaurants: {
    type:Object,
    required: false,
    default: undefined,
  },
});

const token = ref("pk.eyJ1IjoibWFyaW9jb3RldWxhdmFsIiwiYSI6ImNsOGtwZ2M2MTAwcDIzdW53ajc2MmY4OHcifQ.1-PuX-alAdesfu2hxBLU4A");

const map = ref();
const setMap = (mapCreated) => {
  map.value = mapCreated;
};

const updateMapData = async () => {
  if (props.proximity) {
    const center = map.value.getCenter();
    query.lat = center.lat;
    query.lon = center.lng;
    const zoom = map.value.getZoom();
    if (zoom < 9) query.limit = 160;
    if (zoom >= 9 && zoom < 10) query.limit = 100;
    if (zoom >= 10 && zoom < 11) query.limit = 80;
    if (zoom >= 11 && zoom < 12) query.limit = 60;
    if (zoom >= 12) query.limit = 40;
  }
};

const getContextualCenter = () => {
  if (props.proximity || props.route) return [query.lon, query.lat];
  if (props.single) return props.restaurant.location.coordinates;
};

const getRoute = async () => {
  let value;
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  let url = "https://api.mapbox.com/directions/v5/mapbox/driving/";
  const params = {};
  params.access_token = token.value;
  params.steps = "true";
  params.geometries = "geojson";
  const coordinates = `${query.lon},${query.lat};${props.restaurant.location.coordinates[0]},${props.restaurant.location.coordinates[1]}`;
  url = url + coordinates;
  try {
    const response = await smartFetch(url, requestOptions, params);
    if (response.ok) {
      value = await response.json();
    } else {
      toasts.push(new Toast("Unable to retrieve a route for this restaurant.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to retrieve a route for this restaurant.\n${error}`, "OK", undefined, "error", 5));
  }
  return value.routes[0].geometry;
};

const setRoute = async () => {
  if (!props.route) return;
  const route = await getRoute();
  if (!route) return;
  map.value.addLayer({
    id: "route",
    type: "line",
    source: {
      type: "geojson",
      data: route,
    },
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#3887be",
      "line-width": 5,
      "line-opacity": 0.75,
    },
  });
};

watch(() => [props.proximity, props.single], updateMapData);
watch(() => props.route, setRoute);

</script>

<template>
  <MapboxMap
    id="map"
    class="overflow-hidden relative py-2 my-2 rounded"
    :class="proximity ? 'min-h-[calc(100vh-164px)]' : 'min-h-[calc(100vh-62px)]'"
    :access-token="token"
    map-style="mapbox://styles/mapbox/streets-v12"
    :zoom="proximity ? 10 : 12"
    :min-zoom="9"
    :center="getContextualCenter()"
    @mb-created="setMap"
    @mb-idle="updateMapData"
  >
    <MapboxMarker
      v-if="!proximity"
      :lng-lat="restaurant.location.coordinates"
      popup
    >
      <template #popup>
        <div class="flex flex-col">
          <router-link
            class="text-left text-2xl text-accent hover:text-accent-focus font-bold text-ellipsis ... whitespace-nowrap overflow-hidden"
            :to="`/restaurant/${restaurant.id}`"
          >
            {{ restaurant.name }}
          </router-link>
          <div class="w-48">
            <StarScore :rating="restaurant.rating" />
          </div>
        </div>
      </template>
    </MapboxMarker>
    <MapboxMarker
      v-for="restaurantPin in restaurants.items"
      v-else
      :key="restaurantPin.id"
      :lng-lat="restaurantPin.location.coordinates"
      popup
    >
      <template #popup>
        <div class="flex flex-col">
          <router-link class="text-left text-2xl text-accent hover:text-accent-focus font-bold text-ellipsis ... whitespace-nowrap overflow-hidden" :to="`/restaurant/${restaurantPin.id}`">
            {{ restaurantPin.name }}
          </router-link>
          <div class="w-48">
            <StarScore :rating="restaurantPin.rating" />
          </div>
        </div>
      </template>
    </MapboxMarker>
  </MapboxMap>
</template>

<style>
.mapboxgl-popup {
  max-width: 100% !important;
}
.mapboxgl-popup-content {
  padding: 2rem;
  font-size: large;
}
.mapboxgl-popup-close-button {
  padding-right: 4px;
  padding-left: 4px;
  padding-top: 2px;
  margin: 0px;
  font-size:x-large;
}
</style>