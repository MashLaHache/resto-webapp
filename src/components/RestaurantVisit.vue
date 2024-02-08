<script setup>
import { ref } from "vue";
import "v-calendar/dist/style.css";
import { DatePicker } from "v-calendar";
import { createUserVisit } from "../api/visits.js";
import { userCredentials } from "../composables/useCredentials.js";
import { toasts, Toast } from "../composables/useToasts.js";
import StarScore from "./StarScore.vue";
import IconX from "../icons/IconX.vue";

const date = ref(new Date());
const review = ref("");
const rating = ref(5);


const props = defineProps({
  restaurant: {
    type:Object,
    required: true,
  },
  visitModalVisible:{
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["toggleVisits"]);

const resetValue = () => {
  date.value = new Date();
  review.value = "";
  rating.value = 5;
};

const toggleModal = () => {
  emit("toggleVisits");
  resetValue();
};

const inputsAreValid = () => {
  if (!date.value) {
    toasts.push(new Toast("Please select the date of you visit", "OK", undefined, "warning"));
    return false;
  }
  if (!review.value) {
    toasts.push(new Toast("Please enter your a comment about your visit.", "OK", undefined, "warning"));
    return false;
  }
  if (!rating.value) {
    toasts.push(new Toast("Please enter the rating of your visit.", "OK", undefined, "warning"));
    return false;
  }
  return true;
};

const add = async () => {
  if (!inputsAreValid()) return;
  const reviewObject = {
    restaurant_id: props.restaurant.id,
    comment: review.value,
    rating: rating.value,
    date: date.value,
  };
  try {
    const response = await createUserVisit(userCredentials?.token, userCredentials?.id, reviewObject);
    if (response.ok) {
      toasts.push(new Toast("Review posted.", "OK", undefined, "success", 1));
    } else {
      toasts.push(new Toast(`Unable to to post review:\n${response.statusText}`, "OK", undefined, "error"));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to post review:\n${error}`, "OK", undefined, "error"));
  }
  toggleModal();
};

</script>

<template>
  <!-- Main modal -->
  <div
    v-if="visitModalVisible"
    id="modal-main"
    tabindex="-1"
    class="fixed bg-black bg-opacity-50 z-20 w-full inset-0 grid place-items-center"
    @click="if($event.target.id === 'modal-main') {toggleModal()};"
  >
    <!-- Modal content -->
    <div class="card w-96 glass relative rounded-lg shadow input-group text-secondary-content">
      <!-- X button -->
      <button class="absolute top-3 right-2.5 hover:bg-red rounded-lg p-1.5" @click="toggleModal">
        <IconX class="h-8 w-8 stroke-2" />
      </button>
      <div class="py-6 px-6 lg:px-8">
        <!-- Restaurant Name -->
        <h2 class="mb-4 text-xl mr-6">
          Review: {{ restaurant.name }}
        </h2>
        <form class="space-y-4" @submit.prevent="add">
          <!-- Date Picker -->
          <div class="block mb-2 text-xs">
            Date of your visit:
          </div>
          <div>
            <DatePicker
              v-model="date"
              format="dd-MM-YYYY"
              is24hr
              :max-date="new Date()"
            >
              <template #default="{ inputValue, inputEvents }">
                <input
                  class="input"
                  :value="inputValue"
                  v-on="inputEvents"
                >
              </template>
            </DatePicker>
          </div>
          <!-- Review -->
          <div class="block mb-2 text-xs">
            Comments:
          </div>
          <div>
            <textarea
              v-model="review"
              placeholder="How was your visit ?"
              rows="5"
              class="w-full textarea"
            />
          </div>
          <!-- Score -->
          <div>
            <StarScore :rating="rating" :read-only="false" @update:rating="(rating=$event)" />
          </div>
          <!-- Submit button -->
          <div class="flex justify-between">
            <button type="submit" class="btn btn-primary flex-grow">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>