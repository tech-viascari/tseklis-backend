import db from "../database/db.js";

const DB_NAME = "permissions";
const DB_PRIMARY_KEY = "permission_id";

// Permission model
class Permission {
  constructor({
    permission_id = "",
    permission_name = "",
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.permission_id = permission_id;
    this.permission_name = permission_name;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async fetchPermissionPaginate(limit = 10, page = 1, searchQuery = "") {
    const parsedLimit = parseInt(limit); // Ensure limit is a number
    const parsedPage = parseInt(page); // Ensure page is a number

    const offset = (parsedPage - 1) * parsedLimit; // Calculate offset based on page number

    // Build the query
    let query = db("permissions")
      .select("*")
      .limit(parsedLimit)
      .offset(offset)
      .orderBy("created_at", "asc");

    // If there's a search query, filter the results
    if (searchQuery) {
      query = query.where("permission_name", "like", `%${searchQuery}%`); // Adjust the column as needed (e.g., `permission_name`)
    }

    // Fetch the filtered data
    let data = await query;

    // Get the total count considering the search filter
    let countQuery = db("permissions").count("* as count");
    if (searchQuery) {
      countQuery = countQuery.where(
        "permission_name",
        "like",
        `%${searchQuery}%`
      ); // Filter for total count as well
    }

    const totalCount = (await countQuery)[0].count;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    let pagination = {
      page: parsedPage,
      per_page: parsedLimit,
      total: totalCount,
      total_pages: totalPages,
      data,
    };

    return pagination;
  }

  // Fetch all records
  async fetchAll() {
    return await db(DB_NAME).select("*");
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    return await db(DB_NAME).where(columnNames).first();
  }

  // Add a new record
  async add() {
    // Exclude the `permission_id`, `created_at`,`updated_at` from the insert data
    const { permission_id, created_at, updated_at, ...dataToInsert } = this;
    return await db(DB_NAME).insert(dataToInsert).returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Permission.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db(DB_NAME)
        .where({ permission_id: this.permission_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  async delete(id) {
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
}

export default Permission;
