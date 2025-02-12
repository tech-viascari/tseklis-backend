import { decodeToken } from "./token.js";

const checkAuthorization = (cookies) => {
  if (Object.keys(cookies).includes("access_token")) {
    if (
      cookies.access_token == "postman" &&
      process.env.ENVIRONMENT == "development"
    ) {
      return true;
    }
    let token = decodeToken(cookies.access_token);
    return token;
  }
  return null;
};

const old_checkAuthorization = (header) => {
  if (header.hasOwnProperty("authorization")) {
    let token = decodeToken(header.authorization);
    return token ? true : false;
  }
};

export default checkAuthorization;
