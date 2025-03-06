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
      table.string("business_type").notNullable();
      table.string("client_type").notNullable();
      table.string("company_name").notNullable();
      table.string("company_address").notNullable();
      table.string("type_of_company").notNullable();
      table.string("corporate_tin").notNullable();
      table.string("sec_registration_number").notNullable();
      table.string("official_email").notNullable();
      table.string("alternative_email").nullable();
      table.string("official_contact_number").notNullable();
      table.string("alternative_contact_number").nullable();
      table.text("company_logo").nullable();
      table.json("officer_information").nullable();
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

    knex.schema.dropTableIfExists(TABLE_NAME).then(() => {
      console.log(`${TABLE_NAME}_timestamps table dropped`);
    });
  });
};
