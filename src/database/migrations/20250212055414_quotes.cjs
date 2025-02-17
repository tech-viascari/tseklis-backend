const TABLE_NAME = "quotes";
const PRIMARY_KEY = "quote_id";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(TABLE_NAME, function (table) {
      table.uuid(PRIMARY_KEY).defaultTo(knex.fn.uuid()).primary();
      table.string("quote_number").notNullable();
      table.string("quote_name").notNullable();
      table.json("form_data").notNullable();
      table.string("folder_id").nullable();
      table.string("google_doc_id").nullable();
      table.json("attachments").notNullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`${TABLE_NAME} table created`);

      knex.schema
        .createTable(`${TABLE_NAME}_timestamps`, function (table) {
          table
            .uuid(`${TABLE_NAME}_timestamps_id`)
            .defaultTo(knex.fn.uuid())
            .primary();
          table.uuid(PRIMARY_KEY).references(PRIMARY_KEY).inTable(TABLE_NAME);
          table.uuid("user_id").references("user_id").inTable("users");
          table.string("status").nullable();
          table.text("remarks").nullable();
          table.timestamp("datetime").notNullable().defaultTo(knex.fn.now());
          table.timestamps(true, true);
        })
        .then(() => {
          console.log(`${TABLE_NAME}_timestamps table created`);
        });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(`${TABLE_NAME}_timestamps`).then(() => {
    console.log(`${TABLE_NAME} table dropped`);

    knex.schema.dropTableIfExists(TABLE_NAME).then(() => {
      console.log(`${TABLE_NAME}_timestamps table dropped`);
    });
  });
};
