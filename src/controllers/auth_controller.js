import { encodeToken } from "../utils/token.js";

export const authCheck = (req, res) => {
  return res.status(200).json({ message: "Authorized" });
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
    sameSite: "strict", // Prevents CSRF attacks
    // maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
    // maxAge: 30 * 1000, // Expires in 30 seconds
    maxAge: 60 * 60 * 1000, // Expires in 1 hour
    path: "/", // The cookie is available on the entire website
  });

  return res.json({ message: "Logged in successfully", payload });
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
