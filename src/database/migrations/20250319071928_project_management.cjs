/**
 * Migration file for creating detailed project management tables
 * @param {import('knex')} knex - The Knex instance
 * @returns {Promise} A promise that resolves when the migration is complete
 */
exports.up = function (knex) {
  return (
    knex.schema
      // Main project_management table (slightly modified)
      .createTable("project_management", (table) => {
        table.string("project_id").primary();
        table.string("project_name").notNullable();
        table.string("project_type");
        table.string("project_requester");
        table.string("project_assignee");
        table.text("project_remarks");
        table.string("project_legal_entity");

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.index("project_name");
        table.index("project_type");
        table.index("project_assignee");
      })

      // Notes Table
      .createTable("project_notes", (table) => {
        table.increments("note_id").primary();
        table
          .string("project_id")
          .references("project_id")
          .inTable("project_management")
          .onDelete("CASCADE");

        table.string("note_title");
        table.text("note_description");
        table.timestamp("note_date").defaultTo(knex.fn.now());

        table.index("project_id");
      })

      // Updates/Log/Notifications Table
      .createTable("project_logs", (table) => {
        table.increments("log_id").primary();
        table
          .string("project_id")
          .references("project_id")
          .inTable("project_management")
          .onDelete("CASCADE");

        table.string("log_title");
        table.text("log_description");
        table.timestamp("log_date").defaultTo(knex.fn.now());

        table.index("project_id");
      })

      // Workflow Prerequisites Table
      .createTable("workflow_prerequisites", (table) => {
        table.increments("workflow_prereq_id").primary();
        table
          .string("project_id")
          .references("project_id")
          .inTable("project_management")
          .onDelete("CASCADE");

        table.string("file_name");
        table.string("file_link");
        table.string("workflow_id");

        table.index("project_id");
      })

      // Tasks Table
      .createTable("project_tasks", (table) => {
        table.increments("task_id").primary();
        table
          .string("project_id")
          .references("project_id")
          .inTable("project_management")
          .onDelete("CASCADE");

        table.string("task_name");
        table.string("priority");
        table.string("assigned_to");
        table.string("assigned_by");
        table.date("target_date");
        table.timestamp("date_created").defaultTo(knex.fn.now());
        table.text("task_remarks");
        table.string("task_file_link");
        table.string("workflow_id");

        table.index("project_id");
        table.index("assigned_to");
        table.index("priority");
      })
  );
};

/**
 * Rollback the migration
 * @param {import('knex')} knex - The Knex instance
 * @returns {Promise} A promise that resolves when the rollback is complete
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("project_tasks")
    .dropTable("workflow_prerequisites")
    .dropTable("project_logs")
    .dropTable("project_notes")
    .dropTable("project_management");
};
