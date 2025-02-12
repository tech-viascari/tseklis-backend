import db from "../database/db.js";

// User model
class User {
  constructor({
    user_id = "",
    slack_id = "",
    email = "",
    first_name = "",
    middle_name = "",
    last_name = "",
    last_login = new Date(),
    password = "",
    status = "Active",
    picture = "",
    access_token = "",
    refresh_token = "",
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.user_id = user_id;
    this.slack_id = slack_id;
    this.email = email;
    this.first_name = first_name;
    this.middle_name = middle_name;
    this.last_name = last_name;
    this.last_login = last_login;
    this.password = password;
    this.status = status;
    this.picture = picture;
    this.access_token = access_token;
    this.refresh_token = refresh_token;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    const users = await db("users").select("*");
    let getUsers = await Promise.all(
      users.map(async (user) => {
        let roles = await db("user_roles")
          .select("user_roles_id", "role_name", "roles.role_id")
          .innerJoin("roles", "roles.role_id", "user_roles.role_id")
          .where("user_id", user.user_id);

        const permissions = await Promise.all(
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

            return permissions;
          })
        );

        user.roles = roles;
        user.permissions = permissions[0];

        const { password, access_token, refresh_token, ...filteredUser } = user;

        return filteredUser;
      })
    );
    return getUsers;
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    let user = await db("users").where(columnNames).first();

    if (user) {
      let roles = await db("user_roles")
        .select("user_roles_id", "role_name", "roles.role_id")
        .innerJoin("roles", "roles.role_id", "user_roles.role_id")
        .where("user_id", user.user_id);

      let permissions = await Promise.all(
        roles.map(async (role) => {
          const permissions = await db("roles_permissions")
            .select(
              "roles_permissions_id",
              "permission_name",
              "roles_permissions.permission_id"
            )
            .innerJoin(
              "permissions",
              "permissions.permission_id",
              "roles_permissions.permission_id"
            )
            .where("role_id", role.role_id);

          return permissions;
        })
      );

      user.roles = roles;
      user.permissions = permissions[0];
    }
    return user;
  }

  // Add a new record
  async add(roles) {
    // Exclude the `user_id`, `created_at`,`updated_at` from the insert data
    const { user_id, created_at, updated_at, ...dataToInsert } = this;
    const user = await db("users")
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (user.length == 1) {
      roles.map(async (role) => {
        User.assignRole({
          user_id: user[0].user_id,
          role_id: role.role_id,
        });
      });
    }

    return user;
  }

  // Update a record
  async update(roles) {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = User.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      const updatedUser = await db("users")
        .where({ user_id: this.user_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));

      if (updatedUser.length == 1 && roles.length != 0) {
        await db("user_roles").where({ user_id: dataToUpdate.user_id }).del();
        roles.map(async (role) => {
          User.assignRole({
            user_id: updatedUser[0].user_id,
            role_id: role.role_id,
          });
        });
      }

      return updatedUser;
    }
    return [this];
  }

  // Delete a record by ID
  async delete(id) {
    await db("user_roles").where(id).del();
    return await db("users").where(id).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== "user_id" &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }

  // Assigning permissions to a role
  static assignRole = async (object) => {
    return await db("user_roles")
      .insert(object)
      .returning(["user_roles_id", "user_id", "role_id"]);
  };
}

export default User;
