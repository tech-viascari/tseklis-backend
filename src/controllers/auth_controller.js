import { encodeToken } from "../utils/token.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage"
);

export const authCheck = async (req, res) => {
  try {
    const user = await new User().fetch({
      access_token: req.cookies.access_token,
    });
    if (user) {
      const {
        password,
        access_token,
        refresh_token,
        created_at,
        updated_at,
        ...filteredUser
      } = user;
      return res
        .status(200)
        .json({ message: "Authorized", user: filteredUser });
    } else {
      throw Error("User not found.");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unauthorized", error: error.message });
  }
};

export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await new User().fetch({ email });
    if (user) {
      const hash = bcrypt.compareSync(password, user.password);
      if (hash) {
        await authenticateUser(res, { email }, "");
      } else {
        throw Error("Incorrect Email or Password!");
      }
    } else {
      throw Error("User does not exist!");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );
    const googleUser = userInfo.data;
    await authenticateUser(
      res,
      { email: googleUser.email },
      googleUser.picture
    );
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const authenticateUser = async (res, column, picture = "") => {
  const user = await new User().fetch(column);
  if (user) {
    // Sign the JWT with the payload and the secret key
    const access_token = encodeToken(
      "access_token",
      { user_id: user.user_id },
      "30d"
    );

    let payload = {
      ...user,
      last_login: new Date(),
      access_token,
      refresh_token: access_token,
    };

    if (picture !== "") {
      payload.picture = picture;
    }

    const updatedUser = new User(payload);

    let response = await updatedUser.update([]);

    if (response) {
      const { password, refresh_token, ...filteredUser } = user;

      // Send the token in an HTTP-only cookie
      res.cookie("access_token", access_token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        secure: process.env.ENVIRONMENT === "production", // Use HTTPS in production
        sameSite: "strict", // Prevents CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
        // maxAge: 30 * 1000, // Expires in 30 seconds
        // maxAge: 60 * 60 * 1000, // Expires in 1 hour
        path: "/", // The cookie is available on the entire website
      });
      return res.status(200).json({ status: "success", user: filteredUser });
    } else {
      return Error("There was an error processing the data.");
    }
  } else {
    return Error("The user could not be found.");
  }
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
