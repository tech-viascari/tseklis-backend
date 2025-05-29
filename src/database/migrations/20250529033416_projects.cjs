const TABLE_NAME = "projects";
const PRIMARY_KEY = "project_id";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable(TABLE_NAME, function (table) {
      table.uuid(PRIMARY_KEY).defaultTo(knex.fn.uuid()).primary();
      table.string("project_name").notNullable();
      table.text("desc").nullable();
      table.timestamp("start_date").nullable();
      table.timestamp("project_date").nullable();
      table.string("pending_action_from").nullable();
      table.json("google_project_folder").nullable();
      table.timestamp("date_completed").nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      console.log(`${TABLE_NAME} table created`);

      knex.schema
        .createTable("executed_documents", function (table) {
          table
            .uuid("executed_document_id")
            .defaultTo(knex.fn.uuid())
            .primary();
          table.uuid(PRIMARY_KEY).references(PRIMARY_KEY).inTable(TABLE_NAME);
          table.string("name").nullable();
          table.string("link").nullable();
          table.timestamps(true, true);
        })
        .then(() => {
          console.log(`executed_documents table created`);
        });

      knex.schema
        .createTable("project_assignees", function (table) {
          table.uuid("assignee_id").defaultTo(knex.fn.uuid()).primary();
          table.uuid(PRIMARY_KEY).references(PRIMARY_KEY).inTable(TABLE_NAME);
          table.uuid("user_id").references("user_id").inTable("users");
          table.timestamps(true, true);
        })
        .then(() => {
          console.log(`project_assignees table created`);
        });

      knex.schema
        .createTable("project_notes", function (table) {
          table.uuid("note_id").defaultTo(knex.fn.uuid()).primary();
          table.uuid(PRIMARY_KEY).references(PRIMARY_KEY).inTable(TABLE_NAME);
          table.uuid("user_id").references("user_id").inTable("users");
          table.text("note_message").notNullable();
          table.timestamps(true, true);
        })
        .then(() => {
          console.log(`project_notes table created`);
        });

      knex.schema
        .createTable("project_checklists", function (table) {
          table.uuid("checklist_id").defaultTo(knex.fn.uuid()).primary();
          table.uuid(PRIMARY_KEY).references(PRIMARY_KEY).inTable(TABLE_NAME);
          table.boolean("checked").defaultTo(true);
          table.text("list_item").notNullable();
          table.timestamps(true, true);
        })
        .then(() => {
          console.log(`project_checklists table created`);
        });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("project_checklists").then(() => {
    console.log(`project_checklists table dropped`);

    knex.schema.dropTableIfExists("project_notes").then(() => {
      console.log(`project_notes table dropped`);
    });

    knex.schema.dropTableIfExists("project_assignees").then(() => {
      console.log(`project_assignees table dropped`);
    });

    knex.schema.dropTableIfExists("project_notes").then(() => {
      console.log(`project_notes table dropped`);
    });

    knex.schema.dropTableIfExists("executed_documents").then(() => {
      console.log(`executed_documents table dropped`);
    });

    knex.schema.dropTableIfExists(TABLE_NAME).then(() => {
      console.log(`${TABLE_NAME} table dropped`);
    });
  });
};
