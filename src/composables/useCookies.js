import Cookies from "js-cookie";


/*
Usage :
import { cookies } from "./useCookies.js"

To save information in a Cookie, pass a key and some data.
const value = cookies("key", data)

To erase a cookie, pass a key and an empty string.
const value = cookies("key", "")

To read a cookie, pass just the key.
const value = cookies("key")
*/

export const cookies = (key, data = null) => {

  const read = () => {
    const cookie = Cookies.get(key);
    if (cookie) {
      return JSON.parse(cookie);
    } else {
      return;
    }
  };

  const write = () => {
    const date = new Date(new Date(Date.now()).getTime() + (15 * 60 * 1000));// MM   SS   MS
    Cookies.set(key, JSON.stringify(data), { expires: date });
  };

  const remove = () => {
    Cookies.remove(key);
  };

  if (data === "") {
    return remove();
  }
  if (data === null) {
    return read();
  }
  return write();
};