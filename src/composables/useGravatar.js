import md5 from "md5";

export const gravatar = (email) => {
  if (!email) return;
  email.toString();
  const hash = md5(email.trim().toLowerCase());
  const gravatarUrl = "https://www.gravatar.com/avatar/";
  return gravatarUrl + hash;
};