import { smartFetch, URL, UNSECUREURL } from "./api.js";

export const getRestaurants = async (token, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  return smartFetch(`${token ? URL : UNSECUREURL}restaurants`, requestOptions, params);
};

export const getRestaurant = async (token, restaurantId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  // return smartFetch(`${token ? URL : UNSECUREURL}restaurants/${restaurantId}`, requestOptions);
  return smartFetch(`${URL}restaurants/${restaurantId}`, requestOptions);
};

export const getRestaurantVisits = async (token, restaurantId, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}restaurants/${restaurantId}/visits`, requestOptions, params);
};
