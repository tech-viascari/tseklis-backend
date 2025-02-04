/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("roles_permissions", function (table) {
      table.uuid("roles_permissions_id").defaultTo(knex.fn.uuid()).primary();
      table.uuid("role_id").references("role_id").inTable("roles");
      table
        .uuid("permission_id")
        .references("permission_id")
        .inTable("permissions");
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Roles Permissions table created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("roles_permissions");
};
