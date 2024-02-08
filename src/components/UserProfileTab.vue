<script setup>
import { ref, watch } from "vue";
import IconHeart from "../icons/IconHeart.vue";
import IconBolt from "../icons/IconBolt.vue";
import IconUser from "../icons/IconUser.vue";
import IconPerson from "../icons/IconPerson.vue";
import { gravatar } from "../composables/useGravatar.js";

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
});

const emit = defineEmits(["setActiveTab", "toggleFollow"]);

const loggedUserFollowsViewedUser = ref();
const viewedUserFollowsLoggedUser = ref();

// return true if A follows B
const getFollowingStatus = (userA, userB) => {
  if (userA.following.length === 0) {return false;}
  return userA.following.some(user => { return user.id === userB.id; });
};

const updateTabData = () => {
  loggedUserFollowsViewedUser.value = getFollowingStatus(props.loggedUser, props.viewedUser);
  viewedUserFollowsLoggedUser.value = getFollowingStatus(props.viewedUser, props.loggedUser);
};

watch(() => [props.loggedUser.following, props.loggedUser.followers], updateTabData);
updateTabData();

</script>

<template>
  <div class="flex flex-col lg:flex-row items-center justify-center lg:space-x-2 lg:space-y-0 space-y-2 p-4">
    <!-- Name -->
    <div class="relative flex flex-row shadow-xl w-96 h-24 p-4 rounded-xl border">
      <div class="my-auto min-w-fit min-h-fit pr-4">
        <img :src="gravatar(viewedUser.email)" class="avatar ring ring-primary rounded-full h-16 w-16">
      </div>
      <div class="flex flex-col flex-grow overflow-hidden">
        <div class="stat-title">
          Name
        </div>
        <div class="stat-value text-primary overflow-hidden text-ellipsis ...">
          {{ viewedUser.name }}
        </div>
        <div v-if="(viewedUserFollowsLoggedUser && readOnly)" class="absolute stat-desc text-primary bottom-0 right-3">
          {{ viewedUser.name }} is following you !
        </div>
      </div>
      <div v-if="readOnly" class="text-primary tooltip cursor-pointer" :data-tip="loggedUserFollowsViewedUser ? 'Unfollow' : 'Follow!'">
        <IconHeart
          class="inline-block w-12 h-12 stroke-current stroke-2 hover:scale-110 ease-in duration-100"
          :class="loggedUserFollowsViewedUser ? 'fill-primary' : 'fill-none'"
          @click="emit('toggleFollow',{person:viewedUser,following:loggedUserFollowsViewedUser})"
        />
      </div>
    </div>
    <!-- Rating -->
    <div class="flex flex-row shadow-xl w-96 lg:w-48 h-24 p-4 rounded-xl border">
      <div class="flex flex-col flex-grow overflow-hidden">
        <div class="stat-title">
          Rating
        </div>
        <div class="stat-value text-secondary overflow-hidden text-ellipsis ...">
          {{ viewedUser.rating }}
        </div>
      </div>
      <div class="text-secondary">
        <IconBolt class="inline-block w-8 h-8 stroke-current stroke-2" />
      </div>
    </div>

    <!-- Followers -->
    <div class="flex flex-row shadow-xl w-96 lg:w-48 h-24 p-4 rounded-xl border cursor-pointer" @click="emit('setActiveTab','People');">
      <div class="flex flex-col flex-grow overflow-hidden">
        <div class="stat-title">
          Followers
        </div>
        <div class="stat-value text-accent overflow-hidden text-ellipsis ...">
          {{ viewedUser.followers?.length }}
        </div>
      </div>
      <div class="text-accent">
        <IconUser class="inline-block w-8 h-8 stroke-2 my-auto" />
      </div>
    </div>

    <!-- Following -->
    <div class="flex flex-row shadow-xl w-96 lg:w-48 h-24 p-4 rounded-xl border cursor-pointer" @click="emit('setActiveTab','People');">
      <div class="flex flex-col flex-grow overflow-hidden">
        <div class="stat-title">
          Following
        </div>
        <div class="stat-value text-secondary overflow-hidden text-ellipsis ...">
          {{ viewedUser.following?.length }}
        </div>
      </div>
      <div class="text-secondary">
        <IconPerson class="inline-block w-8 h-8 stroke-2 my-auto" />
      </div>
    </div>
  </div>
</template>
