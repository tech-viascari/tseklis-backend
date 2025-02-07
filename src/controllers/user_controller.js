import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const fetchUsers = async (req, res) => {
  const users = await new User().fetchAll();
  return res.status(200).json(users);
};

export const fetchUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await new User().fetch({ user_id });
    if (user) {
      return res.status(200).json(user);
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
    const user = await new User({ ...req.body, password: hash }).add();

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
      const updatedUser = new User({ ...user, ...req.body });

      const update = await updatedUser.update();

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
      const deleteUser = new User().delete(user.user_id);
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
