/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    const entity_enrollment = knex.schema
    .createTable("entity_enrollment", function (table) {
        table.uuid("entity_id").defaultTo(knex.fn.uuid()).primary();
        table.string("business_type").notNullable();
        table.string("client_type").notNullable();
        table.string("company_name").notNullable();
        table.string("company_address").notNullable();
        table.string("type_of_company").notNullable();
        table.string("corporate_tin").notNullable();
        table.string("sec_registration_number").notNullable();
        table.string("official_email").notNullable();
        table.string("alternative_email").notNullable();
        table.string("official_contact_number").notNullable();
        table.string("alternative_contact_number").notNullable();
        table.string("company_logo").notNullable();
        table.timestamps(true, true);
    }).then(() => {
        console.log("Entity Enrollment table created");
    });

    const officer_information = knex.schema
    .createTable("officer_information", function (table) {
        table.uuid("officer_id").defaultTo(knex.fn.uuid()).primary();
        table.uuid("entity_id").references("entity_id").inTable("entity_enrollment");
        table.string("officer_name").notNullable();
        table.string("current_residence").notNullable();
        table.string("nationality").notNullable();
        table.string("incorporator").notNullable();
        table.string("board").notNullable();
        table.string("gender").notNullable();
        table.string("stock_holder").notNullable();
        table.string("officer").notNullable();
        table.string("executive_committee").notNullable();
        table.string("tax_identification_number").notNullable();
        table.timestamps(true, true);
    }).then(() => {
        console.log("Officer Information tables created");
    });

    return Promise.all([entity_enrollment, officer_information])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTableIfExists("entity_enrollment").then(() => {
       console.log("Entity Enrollment table dropped");
   }
    ).then(() => {
         return knex.schema.dropTableIfExists("officer_information").then(() => {
              console.log("Officer Information table dropped");
         });
    });
};
