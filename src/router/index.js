import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import UserPage from "../pages/UserPage.vue";
import RestaurantPage from "../pages/RestaurantPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import PageNotFound from "../pages/PageNotFound.vue";
import { userCredentials, useCredentials } from "../composables/useCredentials.js";
import { Toast, toasts } from "../composables/useToasts.js";
import { tokenInfo } from "../api/login.js";
import { query } from "../composables/useQuery";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
    beforeEnter: () => {
      query.map = false;
    },
  },
  {
    path: "/user/:id",
    name: "UserPage",
    component: UserPage,
    beforeEnter: () => {
      return validateCredentials();
    },
  },
  {
    path: "/restaurant/:id",
    name: "RestaurantPage",
    component: RestaurantPage,
    beforeEnter: () => {
      return validateCredentials();
    },
  },
  {
    path: "/login/",
    name: "LoginPage",
    component: LoginPage,
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: PageNotFound },
];

export const validateCredentials = async () => {
  if (!userCredentials.token) {
    toasts.push(new Toast("Please login to access this page.", "OK", "/login", "warning", "3"));
    return false;
  } else {
    try {
      const response = await tokenInfo(userCredentials.token);
      if (!response?.ok) {
        toasts.push(new Toast("Please login to access this page.", "OK", "/login", "warning", "3"));
        invalidateCredentials();
        return false;
      }
    } catch (error) {
      toasts.push(new Toast("Please login to access this page.", "OK", "/login", "warning", "3"));
      invalidateCredentials();
      return false;
    }
  }
  return true;
};

const invalidateCredentials = async () => {
  useCredentials("");
};

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError((error) => {
  console.error(error);
});

export default router;
