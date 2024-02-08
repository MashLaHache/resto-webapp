export const LOCALURL = "http://127.0.0.1:3000/";
export const URL = "https://ufoodapi.herokuapp.com/";
export const UNSECUREURL = "https://ufoodapi.herokuapp.com/unsecure/";

import { Toast, toasts } from "../composables/useToasts.js";

export const smartFetch = async (url, options, params = undefined) => {
  if (params) {
    const urlArray = [url];
    if (Object.keys(params).length > 0) {
      urlArray.push("?");
      for (const key of Object.keys(params)) {
        try {
          testInput(String(params[key]));
        } catch (error) {
          toasts.push(new Toast(`Unable to proceed:\n${error}`, "OK", "/", "error"));
          return;
        }
        urlArray.push(`&${key}=${String(params[key])}`);
      }
    }
    url = urlArray.join("");
  }
  let response = undefined;
  try {
    response = await fetch(url, options);
  } catch (error) {
    console.error(`API ERROR: \n${error}`);
    toasts.push(new Toast(`Sorry, The server is currently unavailable.\nPlease try again later.:\n${error}`, "OK", undefined, "error"));
    return new Response({ status: 503, statusText: "API UNAVAILABLE" });
  }

  if (!response?.ok) {
    console.error(`API ERROR : ${response.status} : ${response.statusText}`);
    // toasts.push(new Toast(`Error:\n${response.statusText}`, "OK", undefined, "error"));
  }
  return response;
};

export const testInput = (input) => {
  if (input === "") throw new Error("Input is empty.");
  const regex = /["`\\/]/g;
  if (regex.test(input)) throw new Error("Input contains invalid characters.");
  if (input.length > 280) throw new Error("Input is too long.");
};

