import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { encodeToken } from "../utils/token.js";

export const fetchUsers = async (req, res) => {
  const users = await new User().fetchAll();

  if (users.length != 0) {
    const filteredUsers = users.map((user) => {
      const { password, access_token, refresh_token, ...filteredUser } = user;
      return filteredUser;
    });
    return res.status(200).json(filteredUsers);
  }
  return res.status(200).json([]);
};

export const fetchUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await new User().fetch({ user_id });
    if (user) {
      const { password, access_token, refresh_token, ...filteredUser } = user;
      return res.status(200).json({ user: filteredUser });
    } else {
      throw Error("User ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    const hash = bcrypt.hashSync(req.body.password, salt);

    const access_token = encodeToken(
      "new_account",
      { email: req.body.email },
      "1h"
    );

    const user = await new User({
      ...req.body,
      password: hash,
      access_token,
      refresh_token: access_token,
    }).add(req.body.roles);

    if (user) {
      return res.status(200).json({ user });
    } else {
      throw Error("Failed to add user");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await new User().fetch({ user_id });
    if (user) {
      let { password, ...filteredUser } = req.body;

      if (req.body.password != "") {
        const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
        const hash = bcrypt.hashSync(req.body.password, salt);
        filteredUser.password = hash;
      }

      const updatedUser = new User({ ...user, ...filteredUser });

      const update = await updatedUser.update(req.body.roles);

      if (update) {
        return res.status(200).json({ status: "success", user: updatedUser });
      } else {
        throw Error("Failed to update the record.");
      }
    } else {
      throw Error("User ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await new User().fetch({ user_id });

    if (user) {
      const deleteUser = new User().delete({ user_id });
      if (deleteUser) {
        return res.status(200).json({ status: "success", user: deleteUser });
      } else {
        throw Error("Failed to delete the record");
      }
    } else {
      throw Error("User ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", message: error.message });
  }
};
