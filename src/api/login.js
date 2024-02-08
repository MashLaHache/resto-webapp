import { smartFetch, URL, testInput } from "./api.js";

export const login = async (email, password) => {
  testInput(email);
  testInput(password);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}login`, requestOptions);
};

export const logout = async (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}logout`, requestOptions);
};

export const signup = async (name, email, password) => {
  testInput(name);
  testInput(email);
  testInput(password);
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("name", name);
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  return smartFetch(`${URL}signup`, requestOptions);
};

export const tokenInfo = async (token) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  return smartFetch(`${URL}tokeninfo`, requestOptions);
};
