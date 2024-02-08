/*
Usage :
import { storage } from "./useStorage.js"

To save information in local storage, pass a key and some data.
const value = storage("key", data)

To erase a local storage, pass a key and an empty string.
const value = storage("key", "")

To read a local storage, pass just the key.
const value = storage("key")
*/

export const storage = (key, data = null) => {

  const read = () => {
    const storedData = JSON.parse(localStorage.getItem(key));
    const storedDate = Date.parse(storedData?.expiry);
    const now = Date.now();
    if (!storedDate || storedDate < now) {
      remove();
      return;
    }
    return storedData.value;
  };

  const write = () => {
    const date = new Date(Date.now()).getTime() + (15 * 60 * 1000);// MM   SS   MS
    const dataJSON = { value: data, expiry: date };
    localStorage.setItem(key, JSON.stringify(dataJSON));
    return data;
  };

  const remove = () => {
    localStorage.removeItem(key);
    return;
  };

  if (data === "") {
    return remove();
  }
  if (data === null) {
    return read();
  }
  return write();
};