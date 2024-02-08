import { reactive } from "vue";
import { cookies } from "./useCookies.js";

/*
Usage :
import { useCredentials } from "./useCredentials.js";
useCredentials(); // generates reactive object userCredentials

To login a user and save credentials, pass the full userinfo object from the api :
const userCreds = crendentials(userinfo)

To logout a user, pass an empty string.
const userCreds = crendentials("")

To get user credentials, pass nothing.
const userCreds = credentials()
*/
export const userCredentials = reactive({
  name: undefined,
  email: undefined,
  token: undefined,
  id: undefined,
});

export function useCredentials(userInfo = null) {

  const makeSimpleCreds = (userInfoObject) => {
    return {
      name: userInfoObject.name,
      email: userInfoObject.email,
      token: userInfoObject.token,
      id: userInfoObject.id,
    };
  };

  const setUserCredentials = (userInfoObject) => {
    if (userInfoObject) {
      userCredentials.name = userInfoObject.name;
      userCredentials.email = userInfoObject.email;
      userCredentials.token = userInfoObject.token;
      userCredentials.id = userInfoObject.id;
    } else {
      userCredentials.name = undefined;
      userCredentials.email = undefined;
      userCredentials.token = undefined;
      userCredentials.id = undefined;
    }
  };

  const read = () => {
    setUserCredentials(cookies("userInfo"));
    return userCredentials;
  };

  const write = () => {
    const userCreds = makeSimpleCreds(userInfo);
    cookies("userInfo", makeSimpleCreds(userInfo));
    setUserCredentials(userCreds);
    return userCredentials;
  };

  const remove = () => {
    cookies("userInfo", "");
    setUserCredentials(undefined);
    return userCredentials;
  };

  if (userInfo === "") {
    return remove();
  }
  if (userInfo === null) {
    return read();
  }
  return write();
}