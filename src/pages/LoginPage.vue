<script setup>
import { ref } from "vue";
import { signup, login, logout } from "../api/login.js";
import { useCredentials, userCredentials } from "../composables/useCredentials.js";
import { Toast, toasts } from "../composables/useToasts.js";
import Joi from "joi";

const registrationSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(64)
    .required(),

  email: Joi.string()
    .email({ tlds:{ allow: false } })
    .required(),

  password: Joi.string()
    .min(12)
    .max(128)
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds:{ allow: false } })
    .required(),

  password: Joi.string()
    .min(12)
    .max(128)
    .required(),
});

const registerMode = ref(false);
const name = ref();
const email = ref();
const password = ref();

const inputsAreValid = () => {
  let validation = {};
  if (registerMode.value) {
    validation = registrationSchema.validate({
      name: name.value,
      email: email.value,
      password: password.value,
    });
  } else {
    validation = loginSchema.validate({
      email: email.value,
      password: password.value,
    });
  }
  if (validation.error) {
    toasts.push(new Toast(validation.error, "OK", undefined, "error"));
    return false;
  }
  return true;
};

const registerUser = async () => {
  if (!inputsAreValid()) return;
  try {
    const response = await signup(name.value, email.value, password.value);
    if (response.ok) {
      password.value = "";
      name.value = "";
      registerMode.value = false;
      toasts.push(new Toast("Registration Successful", "OK", "/login", "success", 2));
    } else {
      toasts.push(new Toast(`Unable to register:\n${response.statusText}`, "OK", undefined, "error"));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to register:\n${error}`, "OK", undefined, "error"));
  }
};

const loginUser = async () => {
  if (!inputsAreValid()) return;
  try {
    const response = await login(email.value, password.value);
    if (response.ok) {
      const userInfo = await response.json();
      useCredentials(userInfo);
      toasts.push(new Toast("Login Successful", "OK", "/", "success", 2));
    } else {
      toasts.push(new Toast(`Unable to login:\n${response.statusText}`, "OK", undefined, "error"));
    }
  } catch (error) {
    toasts.push(new Toast(`Unable to login:\n${error}`, "OK", undefined, "error"));
  }
};

const logoutUser = async () => {
  const response = await logout(userCredentials?.token);
  useCredentials("");
  if (response.ok) {
    toasts.push(new Toast("You are logged out", "OK", "/login", "success", 2));
  } else {
    toasts.push(new Toast(`Unable to logout from server.\nLogged out locally.\n${response.statusText}`, "OK", undefined, "error"));
  }
};

</script>

<template>
  <div class="flex items-center justify-center pt-10">
    <div v-if="!userCredentials.id" class="card w-96 p-6 bg-accent text-accent-content shadow-xl">
      <h1 v-if="registerMode" class="text-xl font-bold md:text-2xl pb-4 text-center">
        Sign up for an account
      </h1>
      <h1 v-if="!registerMode" class="text-xl font-bold md:text-2xl pb-4 text-center">
        Sign in to your account
      </h1>
      <form class="form-control space-y-4">
        <div v-if="registerMode">
          <label for="name" class="input-group">
            <span class="w-36">Name</span>
            <input
              v-model="name"
              type="name"
              class="input input-bordered w-full"
              required
            >
          </label>
        </div>
        <div>
          <label for="email" class="input-group">
            <span class="w-36">Email</span>
            <input
              v-model="email"
              type="email"
              class="input input-bordered w-full"
              required
            >
          </label>
        </div>
        <div>
          <label for="password" class="input-group">
            <span class="w-36">Password</span>
            <input
              v-model="password"
              type="password"
              class="input input-bordered w-full"
              required
            >
          </label>
        </div>
        <div v-if="registerMode" class="flex flex-col w-full space-y-4">
          <button type="submit" class="btn btn-primary" @click.prevent="registerUser">
            Register
          </button>
          <button class="btn btn-secondary btn-sm" @click.prevent="(registerMode = false)">
            Sign In Instead
          </button>
        </div>
        <div v-if="!registerMode" class="flex flex-col w-full space-y-4">
          <button type="submit" class="btn btn-primary" @click.prevent="loginUser">
            Sign in
          </button>
          <button class="btn btn-secondary btn-sm" @click.prevent="registerMode = true">
            No Account ?
          </button>
        </div>
      </form>
    </div>
    <div v-if="userCredentials.id" class="card w-96 p-6 bg-accent text-accent-content shadow-xl">
      <button class="btn btn-primary" @click.prevent="logoutUser">
        Sign Out
      </button>
    </div>
  </div>
</template>

<style>
</style>