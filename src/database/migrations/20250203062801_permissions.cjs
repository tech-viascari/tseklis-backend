/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("permissions", function (table) {
      table.uuid("permission_id").defaultTo(knex.fn.uuid()).primary();
      table.string("permission_name").notNullable().unique();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log("Permissions table created");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("permissions").then(() => {
    console.log(`permissions table dropped`);
  });
};
