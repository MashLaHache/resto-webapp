import { smartFetch, URL } from "./api.js";

export const getUsers = async (token, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users`, requestOptions, params);
};

export const getUser = async (token, userId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}`, requestOptions);
};

export const getUserFavorites = async (token, userId, params = {}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}users/${userId}/favorites`, requestOptions, params);
};

export const createUserFollow = async (token, id) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const urlencoded = new URLSearchParams();
  urlencoded.append("id", id);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}follow`, requestOptions);
};

export const deleteUserFollow = async (token, userId) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}follow/${userId}`, requestOptions);
};
