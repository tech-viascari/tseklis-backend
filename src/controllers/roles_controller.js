import db from "../database/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const ROLES_LIST = ["Admin", "Manager", "User"];

const SUPER_ADMIN_PERMISSIONS_LIST = [
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
      const superAdmin = await addNewRole({ role_name: "Super Administrator" });
      const manager = await addNewRole({ role_name: "Compliance Manager" });
      const officer = await addNewRole({ role_name: "Compliance Officer" });
      const associate = await addNewRole({ role_name: "Compliance Associate" });
      const adminIT = await addNewRole({ role_name: "IT Administrator" });

      let superAdminPermissions = SUPER_ADMIN_PERMISSIONS_LIST.map(
        (permission) => {
          return {
            permission_name: permission,
          };
        }
      );

      let addedPermissions = await addNewPermission(superAdminPermissions);

      //Assign permissions to super admin
      addedPermissions.map(async (permission) => {
        await assignPermission({
          role_id: superAdmin[0].role_id,
          permission_id: permission.permission_id,
        });
      });

      const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
      const hash = bcrypt.hashSync(process.env.TECH_PW, salt);

      const newUser = new User({
        first_name: "Tech",
        last_name: "Viascari",
        email: process.env.TECH_EMAIL,
        password: hash,
      });

      //Select admin user
      let administrator = await newUser.add();

      if (administrator.length > 0) {
        await assignRole({
          role_id: superAdmin[0].role_id,
          user_id: administrator[0].user_id,
        });
        res.status(200).json({ success: true });
      } else {
        res.status(200).json({
          success: false,
          roles: `TECH ENV: ${process.env.TECH_EMAIL} not found.`,
        });
      }
    } else {
      res.status(200).json({ success: false, roles: roles });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    let roles = await db("roles").select("*");
    let getPermissions = await Promise.all(
      roles.map(async (role, index) => {
        let permissions = await db("role_permissions")
          .select(
            "role_permission_id",
            "permission_name",
            "permissions.permission_id"
          )
          .innerJoin(
            "permissions",
            "permissions.permission_id",
            "role_permissions.permission_id"
          )
          .where("role_id", role.role_id);
        role.permissions = permissions;
        return role;
      })
    );
    res.status(200).json({ success: true, roles: getPermissions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const addRole = async (req, res) => {
  const { role_name, permissions } = req.body;

  try {
    let newRole = await db("roles")
      .insert({ role_name: role_name })
      .returning(["role_id", "role_name"]);

    if (newRole.length == 1) {
      permissions.map(async (permission) => {
        await assignPermission({
          role_id: newRole[0].role_id,
          permission_id: permission.permission_id,
        });
      });
    }

    res.status(200).json({
      success: true,
      result: {
        role_name: role_name,
        role_id: newRole[0].role_id,
        permissions: permissions,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const updateRole = async (req, res) => {
  const { role_id } = req.params;
  const { role_name, permissions } = req.body;
  try {
    let toUpdate = {
      role_name: role_name,
    };
    const updateRole = await db("roles")
      .update(toUpdate)
      .where("role_id", role_id)
      .returning(["role_id", "role_name"]);

    //delete all permissions associated with the role
    const deleteRolePermissions = await db("role_permissions")
      .where("role_id", role_id)
      .delete();

    // //add all permissions that is from the req.body to update the permissions
    permissions.map(async (permission) => {
      await assignPermission({
        role_id: role_id,
        permission_id: permission.permission_id,
      });
    });

    res.status(200).json({ success: true, result: updateRole });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const deleteRole = async (req, res) => {
  const { role_id } = req.params;
  try {
    const deleteRolePermissions = await db("role_permissions")
      .where("role_id", role_id)
      .delete();
    const deleteRole = await db("roles").where("role_id", role_id).delete();

    res
      .status(200)
      .json({ success: true, result: { deleteRole, deleteRolePermissions } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
