import db from "../database/db.js";

const DB_NAME = "roles";
const DB_PRIMARY_KEY = "role_id";

// Role model
class Role {
  constructor({
    role_id = "",
    role_name = "",
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.role_id = role_id;
    this.role_name = role_name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    const roles = await db("roles").select("*");
    let getPermissions = await Promise.all(
      roles.map(async (role) => {
        let permissions = await db("roles_permissions")
          .select(
            "roles_permissions_id",
            "permission_name",
            "permissions.permission_id"
          )
          .innerJoin(
            "permissions",
            "permissions.permission_id",
            "roles_permissions.permission_id"
          )
          .where("role_id", role.role_id);
        role.permissions = permissions;
        return role;
      })
    );
    return getPermissions;
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    let role = await db(DB_NAME).where(columnNames).first();

    if (!role) {
      return null;
    }

    let permissions = await db("roles_permissions")
      .select(
        "roles_permissions_id",
        "permission_name",
        "permissions.permission_id"
      )
      .innerJoin(
        "permissions",
        "permissions.permission_id",
        "roles_permissions.permission_id"
      )
      .where("role_id", role.role_id);

    role.permissions = permissions;

    return role;
  }

  // Add a new record
  async add(permissions) {
    // Exclude the `role_id`, `created_at`,`updated_at` from the insert data
    const { role_id, created_at, updated_at, ...dataToInsert } = this;

    // Insert role
    const role = await db(DB_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (role.length == 1) {
      permissions.map(async (permission) => {
        Role.assignPermission({
          role_id: role[0].role_id,
          permission_id: permission.permission_id,
        });
      });
    }

    return role;
  }

  // Update a record
  async update(permissions) {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Role.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      await db("roles_permissions").where({ role_id: this.role_id }).del();

      permissions.map(async (permission) => {
        Role.assignPermission({
          role_id: this.role_id,
          permission_id: permission.permission_id,
        });
      });
      
      return await db(DB_NAME)
        .where({ role_id: this.role_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }

    return [this];
  }

  // Delete a record by ID
  async delete(id) {
    await db("roles_permissions").where(id).del();
    return await db(DB_NAME).where(id).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== DB_PRIMARY_KEY &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }

  // Assigning permissions to a role
  static assignPermission = async (object) => {
    return await db("roles_permissions")
      .insert(object)
      .returning(["roles_permissions_id", "role_id", "permission_id"]);
  };
}

export default Role;
