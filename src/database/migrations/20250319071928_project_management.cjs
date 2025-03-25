/**
 * Migration file for creating the project management tables
 * @param {import('knex')} knex - The Knex instance
 * @returns {Promise} A promise that resolves when the migration is complete
 */
exports.up = function (knex) {
  return (
    knex.schema
      // Create the main project_management table
      .createTable("project_management", (table) => {
        // Primary key
        table.string("project_id").primary();

        // Project information fields
        table.string("project_name").notNullable();
        table.string("project_type");
        table.string("project_requester");
        table.string("project_assignee");
        table.text("project_remarks");
        table.string("project_legal_entity");

        // JSON fields for arrays (matching your exact structure)
        table.jsonb("project_notes").defaultTo("[]");
        table.jsonb("project_updates").defaultTo("[]");
        table.jsonb("project_prereq").defaultTo("[]");
        table.jsonb("project_tasks").defaultTo("[]");

        // Timestamps
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        // Indexes for commonly queried fields
        table.index("project_name");
        table.index("project_type");
        table.index("project_assignee");
      })
  );
};

/**
 * Rollback the migration
 * @param {import('knex')} knex - The Knex instance
 * @returns {Promise} A promise that resolves when the rollback is complete
 */
exports.down = function (knex) {
  return knex.schema.dropTable("project_management");
};
