import { smartFetch, URL, testInput } from "./api.js";

export const getFavorites = async (token, params) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites`, requestOptions, params);
};

export const getFavoritesList = async (token, listId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);


  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites/${listId}`, requestOptions);
};

export const createFavoritesList = async (token, listName) => {
  testInput(listName);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  const urlencoded = new URLSearchParams();
  urlencoded.append("name", listName);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites`, requestOptions);
};

export const updateFavoritesList = async (token, listId, listName) => {
  testInput(listName);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("name", listName);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites/${listId}`, requestOptions);
};

export const deleteFavoritesList = async (token, listId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites/${listId}`, requestOptions);
};

export const createFavorite = async (token, listId, restaurantId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", restaurantId);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites/${listId}/restaurants`, requestOptions);
};

export const deleteFavorite = async (token, listId, restaurantId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}favorites/${listId}/restaurants/${restaurantId}`, requestOptions);
};