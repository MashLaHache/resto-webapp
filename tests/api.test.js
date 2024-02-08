import * as api from "../src/api.js";
import { test, beforeAll, expect } from "vitest";
import { generateName, generateEmail, generatePassword } from "./gen.js";

let token;
let currentUser;
let restaurantId;
let visitId;
let favoriteListId;
let userId;
let loginInfo;
const name = generateName();
const email = generateEmail();
const password = generatePassword();

const getValues = async () => {
  await api.signup(name, email, password);
  loginInfo = await api.login(email, password);
  token = loginInfo.token;
  currentUser = loginInfo.id;
  const restaurants = await api.getRestaurants(token);
  restaurantId = restaurants.items[0].id;
  const users = await api.getUsers(token);
  userId = users.items[0].id;
  await api.createUserVisit(token, userId, {
    restaurant_id: restaurantId,
    comment: "This is a comment",
    rating: "3",
    date: "Sun Nov 28 2021 13:43:12 GMT-0500 (Eastern Standard Time)",
  });
  const favoriteList = await api.createFavoritesList(token, generateName());
  favoriteListId = favoriteList.id;
  await api.createFavorite(token, favoriteListId, restaurantId);
  const visits = await api.getUserVisits(token, userId);
  visitId = visits.items[0].id;
};

beforeAll(async () => {
  await getValues();
});

test("test login", async () => {
  expect(token).toBeDefined();
});

test("test tokenInfo", async () => {
  const tokenInfo = await api.tokenInfo(token);
  expect(tokenInfo.token).toBe(token);
});

test("test getRestaurants", async () => {
  const restaurants = await api.getRestaurants(token);
  expect(restaurants.items.length).toBeGreaterThan(0);
});

test("test getRestaurants no token", async () => {
  const restaurants = await api.getRestaurants();
  expect(restaurants.items.length).toBeGreaterThan(0);
});

test("test getRestaurant", async () => {
  const restaurant = await api.getRestaurant(token, restaurantId);
  expect(restaurant.id).toBe(restaurantId);
});

test("test getRestaurantVisits", async () => {
  const visits = await api.getRestaurantVisits(token, restaurantId);
  expect(visits.items.length).toBeGreaterThan(0);
});

test("test getUsers", async () => {
  const users = await api.getUsers(token);
  expect(users.items.length).toBeGreaterThan(0);
});

test("test getUser", async () => {
  const user = await api.getUser(token, userId);
  expect(user.id).toBe(userId);
});

test("test getUserFavorites", async () => {
  const favorites = await api.getUserFavorites(token, currentUser);
  expect(favorites.items.length).toBeGreaterThan(0);
});

test("test createUserFollow", async () => {
  const user = await api.getUser(token, currentUser);
  const newUser = await api.createUserFollow(token, userId);
  expect(newUser.following.length).toBeGreaterThan(user.following.length);
});

test("test deleteUserFollow", async () => {
  const user = await api.getUser(token, currentUser);
  const newUser = await api.deleteUserFollow(token, userId);
  expect(newUser.following.length).toBeLessThan(user.following.length);
});

test("test getUserVisits", async () => {
  const visits = await api.getUserVisits(token, userId);
  expect(visits.items.length).toBeGreaterThan(0);
});

test("test getUserVisit", async () => {
  const visit = await api.getUserVisit(token, userId, visitId);
  expect(visit.id).toBe(visitId);
});

test("test createUserVisit", async () => {
  const visit = await api.createUserVisit(token, userId, {
    restaurant_id: restaurantId,
    comment: "This is a comment",
    rating: "3",
    date: "Sun Nov 28 2021 13:43:12 GMT-0500 (Eastern Standard Time)",
  });
  expect(visit.restaurant_id).toBe(restaurantId);
});

test("test getUserVisitsToRestaurant", async () => {
  const visit = await api.getUserVisitsToRestaurant(token, userId, restaurantId);
  expect(visit.items.length).toBeGreaterThan(0);
});

test("test getFavorites", async () => {
  const favorites = await api.getFavorites(token);
  expect(favorites.items.length).toBeGreaterThan(0);
});

test("test getFavoritesList", async () => {
  const favorites = await api.getFavoritesList(token, favoriteListId);
  expect(favorites.id).toBe(favoriteListId);
});


test("test createFavoritesList", async () => {
  const listName = generateName();
  const favorites = await api.createFavoritesList(token, listName);
  expect(favorites.name).toBe(listName);
});

test("test updateFavoritesList", async () => {
  const listName = generateName();
  const favorites = await api.createFavoritesList(token, listName);
  const newListName = generateName();
  const newFavorites = await api.updateFavoritesList(token, favorites.id, newListName);
  expect(newFavorites.name).toBe(newListName);
});

test("test deleteFavoritesList", async () => {
  const listName = generateName();
  const favorites = await api.createFavoritesList(token, listName);
  await api.deleteFavoritesList(token, favorites.id);
  const deleteFavorites = await api.getFavoritesList(token, favorites.id);
  expect(deleteFavorites).toBeUndefined();
});

test("test createFavorite", async () => {
  const favorite = await api.createFavorite(token, favoriteListId, restaurantId);
  expect(favorite.restaurants.length).toBeGreaterThan(0);
});

test("test deleteFavorite", async () => {
  const favorite = await api.deleteFavorite(token, favoriteListId, restaurantId);
  expect(favorite.restaurants.length).toBe(0);
});