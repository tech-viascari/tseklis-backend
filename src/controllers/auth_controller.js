import User from "../models/User.js";
import checkAuthorization from "../utils/authorization.js";
import { decodeToken, encodeToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

export const authCheck = (req, res) => {
  const payload = checkAuthorization(req.cookies);

  if (payload == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res
    .status(200)
    .json({ message: "Authorized", payload: payload.access_token });
  return;

  if (checkAuthorization(req.cookies)) {
  }
  const access_token = req.cookies.access_token; // Access the JWT from the cookie

  if (!access_token) {
    return res.status(403).json({ message: "No token provided" });
  }

  const payload1 = decodeToken(access_token);

  if (payload == null) {
    return res.status(403).json({ message: "Invalid token" });
  }

  res.status(200).json({
    message: "You are authorized!",
    access_token,
    payload,
  });
};

export const authenticate = (req, res) => {
  const { email, password } = req.body;

  const payload = {
    email,
    password,
  };

  // Sign the JWT with the payload and the secret key
  const access_token = encodeToken("access_token", payload, "1h");

  // Send the token in an HTTP-only cookie
  res.cookie("access_token", access_token, {
    httpOnly: true, // Makes the cookie inaccessible to JavaScript
    secure: process.env.ENVIRONMENT === "production", // Use HTTPS in production
    sameSite: "lax", // Prevents CSRF attacks
    // maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
    // maxAge: 30 * 1000, // Expires in 30 seconds
    maxAge: 60 * 60 * 1000, // Expires in 1 hour
    path: "/", // The cookie is available on the entire website
  });

  res.json({ message: "Logged in successfully", payload });
};

export const logout = (req, res) => {
  // Clear the JWT cookie
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  // Respond to indicate successful logout
  res.status(200).json("Logged out successfully");
};
