import { storage } from "../composables/useStorage.js";
import { getRestaurants } from "./restaurants.js";
import { getUserFavorites } from "./users.js";
import { getUserVisits } from "./visits.js";

// return all restaurants and cache them for future requests.
export const getAllRestaurants = async (token) => {
  let restaurants = storage("restaurants");
  if (!restaurants) {
    try {
      const response = await getRestaurants(token);
      if (response.ok) {
        restaurants = await response.json();
      } else {
        return;
      }
    } catch (error) {
      return;
    }

    try {
      const response = await getRestaurants(token, { limit: restaurants.total });
      if (response.ok) {
        restaurants = await response.json();
      } else {
        return;
      }
    } catch (error) {
      return;
    }
    storage("restaurants", restaurants);
  }
  return restaurants;
};

// return a list of all restaurants genres. *(This would normally be handled by the backend but rebuilding the backend was to much trouble for now.)
export const getRestaurantsGenres = async (token) => {
  const restaurants = await getAllRestaurants(token);
  if (!restaurants) return;
  return Array.from(new Set(restaurants.items.map(restaurant => { return restaurant.genres; }).flat())).sort();
};

// return a list of all restaurants names. *(This would normally be handled by the backend but rebuilding the backend was to much trouble for now.)
export const getRestaurantsNames = async (token) => {
  const restaurants = await getAllRestaurants(token);
  if (!restaurants) return;
  return restaurants.items.map(restaurant => { return restaurant.name; }).sort();
};

// return a usable list of user favorites.
export const getUserFavoritesFormated = async (token, userId) => {
  let favorites;
  try {
    const response = await getUserFavorites(token, userId);
    if (response.ok) {
      favorites = await response.json();
    } else {
      return;
    }
  } catch (error) {
    return;
  }

  try {
    const response = await getUserFavorites(token, userId, { limit: favorites.total });
    if (response.ok) {
      favorites = await response.json();
    } else {
      return;
    }
  } catch (error) {
    return;
  }

  const restaurants = await getAllRestaurants(token);
  if (!restaurants) return;
  for (const favorite of favorites.items) {
    delete favorite.owner;
    for (const restaurant of favorite.restaurants) {
      restaurant.name = restaurants.items.find(resto => resto.id === restaurant.id)?.name;
    }
  }
  return favorites;
};

// return a usable list of user visits.
export const getUserVisitsFormated = async (token, userId, params = {}) => {
  let visits;
  try {
    const response = await getUserVisits(token, userId, params);
    if (response.ok) {
      visits = await response.json();
    } else {
      return;
    }
  } catch (error) {
    return;
  }
  try {
    const response = await getUserVisits(token, userId, { limit: visits.total });
    if (response.ok) {
      visits = await response.json();
    } else {
      return;
    }
  } catch (error) {
    return;
  }
  const restaurants = await getAllRestaurants(token);
  if (!restaurants) return;

  const formatedVisits = [];

  for (const visit of visits.items) {
    const index = formatedVisits.findIndex(item => item.id === visit.restaurant_id);
    const restaurant = restaurants.items.find(item => item.id === visit.restaurant_id);
    if (!restaurant) continue;
    visit.restaurant_name = restaurant.name;
    if (index == -1) {
      formatedVisits.push(
        {
          id: visit.restaurant_id,
          name: restaurant.name,
          count: 1,
          visits: [visit],
        },
      );
    } else {
      formatedVisits[index].count++;
      formatedVisits[index].visits.push(visit);
    }
  }
  for (const restaurant of formatedVisits) {
    restaurant.visits = restaurant.visits.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return formatedVisits;
};
