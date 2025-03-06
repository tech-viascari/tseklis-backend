const TABLE_NAME = "legal_entities";
const PRIMARY_KEY = "entity_id";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(TABLE_NAME, function (table) {
      table.uuid(PRIMARY_KEY).defaultTo(knex.fn.uuid()).primary();
      table.json("entity_details").nullable();
      table.json("gdrive_folder").nullable();
      table.text("entity_logo").nullable();
      table.string("status").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`${TABLE_NAME} table created`);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(`${TABLE_NAME}_timestamps`).then(() => {
    console.log(`${TABLE_NAME} table dropped`);
  });
};
