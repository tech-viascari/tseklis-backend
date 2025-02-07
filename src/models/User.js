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
    return await db("users").select("*");
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    return await db("users").where(columnNames).first();
  }

  // Add a new record
  async add() {
    // Exclude the `user_id`, `created_at`,`updated_at` from the insert data
    const { user_id, created_at, updated_at, ...dataToInsert } = this;
    return await db("users").insert(dataToInsert).returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = User.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db("users")
        .where({ user_id: this.user_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  async delete(user_id) {
    return await db("users").where({ user_id }).del();
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
}

export default User;
