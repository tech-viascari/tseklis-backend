/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.uuid("user_id").defaultTo(knex.fn.uuid()).primary();
      table.string("slack_id").nullable();
      table.string("email").notNullable().unique();
      table.string("first_name").notNullable();
      table.string("middle_name").nullable();
      table.string("last_name").notNullable();
      table.datetime("last_login").notNullable();
      table.string("password").notNullable();
      table.string("status").notNullable();
      table.text("picture").nullable().defaultTo("");
      table.text("access_token").notNullable().unique();
      table.text("refresh_token").notNullable().unique();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Users table created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
