import User from "../models/User.js";
import checkAuthorization from "../utils/authorization.js";

export const checkPayloadMiddleware = async (req, res, next) => {
  const payload = checkAuthorization(req.cookies);
  if (payload == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user =
    payload == "postman" && process.env.ENVIRONMENT == "development"
      ? { email: "benjie@viascari.com" }
      : {
          user_id: payload.access_token.user_id,
        };
  let current_user = await new User().fetch(user);
  req.current_user = current_user;
  next();
};
