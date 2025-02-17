import db from "../database/db.js";
import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const ROLES_LIST = ["Admin", "Manager", "User"];

const DEFAULT_PERMISSIONS_LIST = [
  "View Users",
  "Update Users",
  "Delete Users",
  "Add Users",

  "View Roles",
  "Update Roles",
  "Delete Roles",
  "Add Roles",

  "View Permissions",
  "Update Permissions",
  "Delete Permissions",
  "Add Permissions",
];

const addNewRole = async (role) => {
  return await db("roles").insert(role).returning(["role_id", "role_name"]);
};

const addNewPermission = async (permission) => {
  return await db("permissions")
    .insert(permission)
    .returning(["permission_id", "permission_name"]);
};

const assignPermission = async (object) => {
  return await db("roles_permissions")
    .insert(object)
    .returning(["roles_permissions_id", "role_id", "permission_id"]);
};

const assignRole = async (object) => {
  return await db("user_roles")
    .insert(object)
    .returning(["user_roles_id", "user_id", "role_id"]);
};

export const seeders = async (req, res) => {
  try {
    const roles = await db("roles").select("*");
    if (roles.length === 0) {
      DEFAULT_PERMISSIONS_LIST.forEach((permission) => {
        new Permission({ permission_name: permission }).add();
      });

      const permissions = await new Permission().fetchAll();

      const superAdmin = await new Role({
        role_name: "Super Administrator",
      }).add(permissions);

      const manager = await new Role({
        role_name: "Compliance Manager",
      }).add();

      const officer = await new Role({
        role_name: "Compliance Officer",
      }).add();

      const associate = await new Role({
        role_name: "Compliance Associate",
      }).add();

      const adminIT = await new Role({
        role_name: "IT Administrator",
      }).add();

      const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
      const hash = bcrypt.hashSync(process.env.TECH_PW, salt);

      const newUser = new User({
        first_name: "Tech",
        last_name: "Viascari",
        email: process.env.TECH_EMAIL,
        password: hash,
      }).add(superAdmin);

      if (newUser) {
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({
          success: false,
          roles: `TECH ENV: ${process.env.TECH_EMAIL} not found.`,
        });
      }
    } else {
      return res.status(200).json({ success: true, roles: roles });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", err: error.message });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    let roles = await new Role().fetchAll();
    res.status(200).json(roles);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const getRole = async (req, res) => {
  const { role_id } = req.params;

  try {
    let role = await new Role().fetch({ role_id });

    if (role) {
      res.status(200).json({ role });
    } else {
      throw Error("Role ID is not found.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const addRole = async (req, res) => {
  try {
    const role = new Role({ ...req.body }).add(req.body.permissions);
    return res.status(200).json({ body: role });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const updateRole = async (req, res) => {
  const { role_id } = req.params;
  try {
    const role = await new Role().fetch({ role_id });

    if (role) {
      const updateRole = new Role({ ...req.body }).update(req.body.permissions);
      return res.status(200).json({ success: true, role, updateRole });
    } else {
      throw Error("Role ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  const { role_id } = req.params;

  try {
    const role = await new Role().fetch({ role_id });
    if (role) {
      await new Role().delete({ role_id });
      return res
        .status(200)
        .json({ success: true, message: "Record deleted successfully." });
    } else {
      throw Error("Role ID is not found.");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
