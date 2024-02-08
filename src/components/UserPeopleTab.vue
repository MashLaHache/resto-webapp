<script setup>
import IconHeart from "../icons/IconHeart.vue";
import IconBolt from "../icons/IconBolt.vue";
import AutoPagination from "./AutoPagination.vue";
import { router } from "../router/index.js";
import { ref } from "vue";
import { gravatar } from "../composables/useGravatar.js";


const emit = defineEmits(["setActiveTab", "toggleFollow", "searchUsers"]);

const props = defineProps({
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
  users:{
    type: Object,
    required: true,
  },
});

const page = ref(0);
const name = ref("");

const goToPage = (pageNumber) => {
  page.value = pageNumber;
  search(name.value, page.value);
};

const isFollowing = (id) => {
  if (props.loggedUser.following.length === 0) {return false;}
  return props.loggedUser.following.some(user => { return user.id === id; });
};

const goToUser = (id) => {
  router.push(`/user/${id}`);
  emit("setActiveTab", "Profile");
};

const search = (queryName, queryPage) => {

  if (queryName !== undefined) {
    name.value = queryName;
  }
  if (queryPage !== undefined) {
    page.value = queryPage;
  } else {
    page.value = 0;
  }
  emit("searchUsers", { name: name.value, page:page.value });
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
  <div class="grid lg:grid-cols-3 items-start gap-2 pt-2 max-w-6xl mx-auto">
    <!-- Find People -->
    <div class="flex flex-col pb-2 w-full break-inside-avoid-column">
      <!-- List -->
      <div
        class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded-t"
      >
        <div class="text-xl pl-3 my-0.5 w-full">
          Find People
        </div>
      </div>
      <!-- input -->
      <div
        class="bg-secondary p-2"
        :class="(users?.total || users?.total === 0) ? '' : 'rounded-b'"
      >
        <input
          class="input input-sm input-primary text-xl pl-3 my-0.5 w-full text-ellipsis ...  "
          @focusout="search($event.target.value)"
          @keyup.enter="$event.target.blur()"
        >
      </div>
      <div
        v-for="person, index in users.items"
        :key="person.id"
      >
        <!-- User -->
        <div
          class="flex flex-row text-base-content pl-6 pr-2 py-1 justify-between"
          :class="getRowClass(index, users.total)"
        >
          <div class="m-auto pr-2 min-w-fit min-h-fit cursor-pointer" @click="goToUser(person.id)">
            <img :src="gravatar(person.email)" class="avatar ring ring-secondary rounded-full h-8 w-8">
          </div>
          <div
            class="text-xl pl-3 my-0.5 text-ellipsis ... cursor-pointer break-all"
            @click="goToUser(person.id)"
          >
            {{ person.name }}
          </div>
          <div class="flex-grow" />
          <div class="px-3 my-auto text-xl font-bold text-secondary-content min-w-fit">
            {{ person.rating }}
            <IconBolt class="inline-block w-6 h-6 pb-0.5 stroke-current stroke-2 my-auto" />
          </div>

          <div
            v-if="person.id !== loggedUser.id"
            class="text-primary tooltip cursor-pointer my-auto"
            :data-tip="isFollowing(person.id) ? 'Unfollow' : 'Follow!'"
          >
            <IconHeart
              class="inline-block w-8 h-8 stroke-current stroke-2 hover:scale-110 ease-in duration-100"
              :class="isFollowing(person.id) ? 'fill-primary' : 'fill-none'"
              @click="emit('toggleFollow', {person: person, following: isFollowing(person.id)});"
            />
          </div>
        </div>
      </div>
      <div
        class="justify-center rounded-b"
        :class="getRowClass(users.total + 1 , users.total)"
      >
        <AutoPagination :total="users?.total || 0" :page="page" @go-to-page="goToPage($event)" />
      </div>
      <!-- No Results -->
      <div
        v-if="users?.total === 0"
        class="flex flex-row pl-6 pr-2 justify-center py-2 bg-base-200 rounded-b"
      >
        No one was found.
      </div>
    </div>


    <!-- Following -->
    <div v-if="(viewedUser.following?.length > 0)" class="flex flex-col pb-2 w-full break-inside-avoid-column">
      <!-- List -->

      <div
        class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded-t"
        :class="(viewedUser.following?.length === 0) ? 'rounded-b' : ''"
      >
        <div class="text-xl  pl-3 my-0.5 w-full">
          Following
        </div>
      </div>
      <div
        v-for="person, index in viewedUser.following"
        :key="person.id"
      >
        <!-- User -->
        <div
          class="flex flex-row text-base-content pl-6 pr-2 py-1 justify-between"
          :class="getRowClass(index, viewedUser.following.length)"
        >
          <div class="m-auto pr-2 min-w-fit min-h-fit cursor-pointer" @click="goToUser(person.id)">
            <img :src="gravatar(person.email)" class="avatar ring ring-secondary rounded-full h-8 w-8">
          </div>
          <div
            class="text-xl pl-3 my-0.5 text-ellipsis ... cursor-pointer"
            @click="goToUser(person.id)"
          >
            {{ person.name }}
          </div>
          <div class="flex-grow" />
          <div
            v-if="person.id !== loggedUser.id"
            class="text-primary tooltip cursor-pointer my-auto"
            :data-tip="isFollowing(person.id) ? 'Unfollow' : 'Follow!'"
          >
            <IconHeart
              class="inline-block w-8 h-8 stroke-current stroke-2 hover:scale-110 ease-in duration-100"
              :class="isFollowing(person.id) ? 'fill-primary' : 'fill-none'"
              @click="emit('toggleFollow', {person: person, following: isFollowing(person.id)});"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col pb-2 w-full break-inside-avoid-column">
      <div class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded">
        <div v-if="readOnly" class="text-xl  pl-3 my-0.5 w-full">
          {{ viewedUser.name }} is not following anyone
        </div>
        <div v-else class="text-xl  pl-3 my-0.5 w-full">
          You are not following anyone
        </div>
      </div>
    </div>


    <!-- Followers -->
    <div v-if="(viewedUser.followers?.length > 0)" class="flex flex-col pb-2 w-full break-inside-avoid-column">
      <!-- List -->

      <div
        class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded-t"
        :class="(viewedUser.followers?.length === 0) ? 'rounded-b' : ''"
      >
        <div class="text-xl  pl-3 my-0.5 w-full">
          Followers
        </div>
      </div>
      <div
        v-for="person, index in viewedUser.followers"
        :key="person.id"
      >
        <!-- User -->
        <div
          class="flex flex-row text-base-content pl-6 pr-2 py-1 justify-between"
          :class="getRowClass(index, viewedUser.followers.length)"
        >
          <div class="m-auto pr-2 min-w-fit min-h-fit cursor-pointer" @click="goToUser(person.id)">
            <img :src="gravatar(person.email)" class="avatar ring ring-secondary rounded-full h-8 w-8">
          </div>
          <div
            class="text-xl pl-3 my-0.5 text-ellipsis ... cursor-pointer"
            @click="goToUser(person.id)"
          >
            {{ person.name }}
          </div>
          <div class="flex-grow" />
          <div
            v-if="person.id !== loggedUser.id"
            class="text-primary tooltip cursor-pointer my-auto"
            :data-tip="isFollowing(person.id) ? 'Unfollow' : 'Follow!'"
          >
            <IconHeart
              class="inline-block w-8 h-8 stroke-current stroke-2 hover:scale-110 ease-in duration-100"
              :class="isFollowing(person.id) ? 'fill-primary' : 'fill-none'"
              @click="emit('toggleFollow', {person: person, following: isFollowing(person.id)});"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col pb-2 w-full break-inside-avoid-column">
      <div class="flex flex-row bg-secondary text-secondary-content font-black text-xl p-2 rounded">
        <div v-if="readOnly" class="text-xl  pl-3 my-0.5 w-full">
          No one is following {{ viewedUser.name }}
        </div>
        <div v-else class="text-xl  pl-3 my-0.5 w-full">
          No one is following you
        </div>
      </div>
    </div>
  </div>
</template>
