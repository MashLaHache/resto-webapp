import { smartFetch, URL, testInput } from "./api.js";

export const getUserVisits = async (token, userId, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}/restaurants/visits`, requestOptions, params);
};


export const getUserVisit = async (token, userId, visitId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}/restaurants/visits/${visitId}`, requestOptions);
};

export const createUserVisit = async (token, userId, { restaurant_id, comment, rating, date }) => {
  testInput(comment);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("restaurant_id", restaurant_id);
  urlencoded.append("comment", comment);
  urlencoded.append("rating", rating);
  urlencoded.append("date", date);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}/restaurants/visits`, requestOptions);
};

export const getUserVisitsToRestaurant = async (token, userId, restaurantId, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}/restaurants/${restaurantId}/visits`, requestOptions, params);
};
