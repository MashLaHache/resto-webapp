<script setup>
import { ref, watch } from "vue";
import UserProfileTab from "../components/UserProfileTab.vue";
import UserFavoritesTab from "../components/UserFavoritesTab.vue";
import UserVisitsTab from "../components/UserVisitsTab.vue";
import UserPeopleTab from "../components/UserPeopleTab.vue";
import { deleteFavoritesList, createFavoritesList, updateFavoritesList, deleteFavorite } from "../api/favorites.js";
import { getUserFavoritesFormated, getUserVisitsFormated } from "../api/custom.js";
import { getUsers, getUser, createUserFollow, deleteUserFollow } from "../api/users.js";
import { userCredentials } from "../composables/useCredentials.js";
import { useRoute } from "vue-router";
import { toasts, Toast, miniToasts, MiniToast } from "../composables/useToasts";
import { validateCredentials } from "../router/index.js";
import IconLoading from "../icons/IconLoading.vue";

const route = useRoute();
const viewedUser = ref();
const loggedUser = ref();
const favoritesLists = ref();
const visitsList = ref();
const users = ref({});
const loading = ref(true);
const readOnly = ref(true);
const activeTab = ref("Profile");

const setReadOnlyStatus = async () => {
  if (loggedUser.value.id === viewedUser.value.id) {
    readOnly.value = false;
  } else {
    readOnly.value = true;
  }
};

const getUserData = async (id) => {
  let value;
  try {
    const response = await getUser(userCredentials.token, id);
    if (response.ok) {
      value = await response.json();
    } else {
      toasts.push(new Toast("This page is not currently available.\nPlease try again later.", "OK", "/", "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`This page is not currently available.\nPlease try again later.\n${error}`, "OK", "/", "error", 5));
  }
  return value;
};

const searchUsers = async ({ name, page }) => {
  if (name === "") {
    users.value = { items:[], total:0 };
    return;
  }
  try {
    const response = await getUsers(userCredentials.token, { q:name, page:page });
    if (response.ok) {
      users.value = await response.json();
    } else {
      toasts.push(new Toast("Unable to complete this search at this time\nPlease try again later", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to complete this search at this time\nPlease try again later\n${error}`, "OK", undefined, "error", 5));
  }
};

// Following
const toggleFollow = async ({ person, following }) => {
  if (following) {
    // unfollow
    try {
      const response = await deleteUserFollow(userCredentials.token, person.id);
      if (response.ok) {
        miniToasts.push(new MiniToast(`You are no longer following: ${person.name}`, "warning"));
        updatePageData();
      } else {
        toasts.push(new Toast(`Unable to unfollow: ${person.name} at this time\nPlease try again later`, "OK", undefined, "error", 5));
      }
    } catch (error) {
      toasts.push(new Toast(`Unable to unfollow: ${person.name} at this time\nPlease try again later\n${error}`, "OK", undefined, "error", 5));
    }
  } else {
    try {
      const response = await createUserFollow(userCredentials.token, person.id);
      if (response.ok) {
        miniToasts.push(new MiniToast(`You are now following: ${person.name}`, "success"));
        updatePageData();
      } else {
        toasts.push(new Toast(`Unable to follow: ${person.name} at this time\nPlease try again later`, "OK", undefined, "error", 5));
      }
    } catch (error) {
      toasts.push(new Toast(`Unable to follow: ${person.name} at this time\nPlease try again later\n${error}`, "OK", undefined, "error", 5));
    }
  }
};

// Favorites //
const addFavoritesList = async (listName) => {
  if (readOnly.value) return;
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
  updatePageData();
};

const removeFavoritesList = async (listId) => {
  if (readOnly.value) return;
  try {
    const response = await deleteFavoritesList(userCredentials.token, listId);
    if (response.ok) {
      miniToasts.push(new MiniToast("Favorites list deleted.", "warning"));
    } else {
      toasts.push(new Toast("Unable to delete this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to delete this list.\nPlease try again later.\n${error}`, "OK", undefined, "error", 5));
  }
  updatePageData();
};

const renameFavoritesList = async ({ listId, listName }) => {
  if (readOnly.value) return;
  try {
    const response = await updateFavoritesList(userCredentials.token, listId, listName);
    if (response.ok) {
      miniToasts.push(new MiniToast(`Favorites list renamed to: ${listName}.`, "success"));
    } else {
      toasts.push(new Toast("Unable to rename this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to rename this list.\n${error}`, "OK", undefined, "error", 5));
  }
  updatePageData();
};

const removeFavoriteRestaurant = async ({ listId, restaurantId }) => {
  if (readOnly.value) return;
  try {
    const response = await deleteFavorite(userCredentials.token, listId, restaurantId);
    if (response.ok) {
      miniToasts.push(new MiniToast("Favorite restaurant removed.", "warning"));
    } else {
      toasts.push(new Toast("Unable to remove this restaurant from this list.\nPlease try again later.", "OK", undefined, "error", 5));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to remove this restaurant from this list.\n${error}`, "OK", undefined, "error", 5));
  }
  updatePageData();
};


// Page functions
const updatePageData = async () => {
  await validateCredentials();
  viewedUser.value = await getUserData(route.params.id);
  loggedUser.value = await getUserData(userCredentials.id);
  await setReadOnlyStatus();
  visitsList.value = await getUserVisitsFormated(userCredentials.token, viewedUser.value.id); // won't throw and returns json or nothing.
  favoritesLists.value = await getUserFavoritesFormated(userCredentials.token, viewedUser.value.id); // won't throw and returns json or nothing.
  loading.value = false;
};

const softRefreshPage = async () => {
  loading.value = true;
  await updatePageData();
  users.value = {};
  loading.value = false;
};


watch(() => route.params.id, softRefreshPage);
await updatePageData();
</script>

<template>
  <div class="tabs justify-center tabs-boxed bg-accent text-accent-content">
    <a :class="activeTab === 'Profile' ? 'tab-active' : ''" class="tab text-accent-content tab-lg" @click="activeTab='Profile'">Profile</a>
    <a :class="activeTab === 'Favorites' ? 'tab-active' : ''" class="tab text-accent-content tab-lg" @click="activeTab='Favorites'">Favorites</a>
    <a :class="activeTab === 'Visits' ? 'tab-active' : ''" class="tab text-accent-content tab-lg" @click="activeTab='Visits'">Visits</a>
    <a :class="activeTab === 'People' ? 'tab-active' : ''" class="tab text-accent-content tab-lg" @click="activeTab='People'">People</a>
  </div>
  <div :hidden="loading">
    <UserProfileTab
      v-if="activeTab==='Profile'"
      :logged-user="loggedUser"
      :viewed-user="viewedUser"
      :read-only="readOnly"
      @set-active-tab="activeTab = $event"
      @toggle-follow="toggleFollow($event)"
    />
    <UserFavoritesTab
      v-if="activeTab==='Favorites'"
      :logged-user="loggedUser"
      :viewed-user="viewedUser"
      :read-only="readOnly"
      :favorites-lists="favoritesLists"
      @add-favorites-list="addFavoritesList($event)"
      @remove-favorites-list="removeFavoritesList($event)"
      @rename-favorites-list="renameFavoritesList($event)"
      @remove-favorite-restaurant="removeFavoriteRestaurant($event)"
    />
    <UserVisitsTab
      v-if="activeTab==='Visits'"
      :read-only="readOnly"
      :visits-list="visitsList"
    />
    <UserPeopleTab
      v-if="activeTab==='People'"
      :logged-user="loggedUser"
      :viewed-user="viewedUser"
      :read-only="readOnly"
      :users="users"
      @toggle-follow="toggleFollow($event)"
      @set-active-tab="activeTab = $event"
      @search-users="searchUsers($event)"
    />
  </div>
  <div :hidden="!loading">
    <IconLoading />
  </div>
</template>
