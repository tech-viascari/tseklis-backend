import checkAuthorization from "../utils/authorization.js";
import { encodeToken } from "../utils/token.js";
import db from "../database/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const authCheck = (req, res) => {
  const payload = checkAuthorization(req.cookies);

  if (payload == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json({ message: "Authorized" });
};

export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new User().fetch({ email });

    if (user) {
      const hash = bcrypt.compareSync(password, user.password);
      if (hash) {
        // Sign the JWT with the payload and the secret key
        const access_token = encodeToken("access_token", user, "1h");
        const updatedUser = new User({
          ...user,
          access_token,
          refresh_token: access_token,
        });

        let response = await updatedUser.update();

        if (response) {
          // Send the token in an HTTP-only cookie
          res.cookie("access_token", access_token, {
            httpOnly: true, // Makes the cookie inaccessible to JavaScript
            secure: process.env.ENVIRONMENT === "production", // Use HTTPS in production
            sameSite: "strict", // Prevents CSRF attacks
            // maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
            // maxAge: 30 * 1000, // Expires in 30 seconds
            maxAge: 60 * 60 * 1000, // Expires in 1 hour
            path: "/", // The cookie is available on the entire website
          });
          // return res.status(200).json({ status: "success", user });
        } else {
          throw Error("Failed to update user!");
        }
      }
    } else {
      throw Error("User does not exist!");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addNewUser = async (req, res) => {
  const { email, password, first_name, middle_name, last_name } = req.body;

  const payload = {
    email,
    password,
  };

  // Sign the JWT with the payload and the secret key
  const access_token = encodeToken("access_token", payload, "1h");

  const user = await db("users").select("*").first();

  console.log(user);

  // // Send the token in an HTTP-only cookie
  // res.cookie("access_token", access_token, {
  //   httpOnly: true, // Makes the cookie inaccessible to JavaScript
  //   secure: process.env.ENVIRONMENT === "production", // Use HTTPS in production
  //   sameSite: "strict", // Prevents CSRF attacks
  //   // maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
  //   // maxAge: 30 * 1000, // Expires in 30 seconds
  //   maxAge: 60 * 60 * 1000, // Expires in 1 hour
  //   path: "/", // The cookie is available on the entire website
  // });

  return res
    .status(200)
    .json({ message: "Logged in successfully", payload, user });
};

export const logout = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  // Respond to indicate successful logout
  return res.status(200).json("Logged out successfully");
};
