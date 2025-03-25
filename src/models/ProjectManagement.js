import db from "../database/db.js";
import { v4 as uuidv4 } from "uuid"; // Add this dependency for generating UUIDs

const DB_NAME = "project_management";
const DB_PRIMARY_KEY = "project_id";

// ProjectManagement model
class ProjectManagement {
  constructor({
    project_id = "",
    project_name = "",
    project_type = "",
    project_requester = "",
    project_assignee = "",
    project_remarks = "",
    project_legal_entity = "",
    project_notes = [],
    project_updates = [],
    project_prereq = [],
    project_tasks = [],
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.project_id = project_id || uuidv4(); // Auto-generate UUID if not provided
    this.project_name = project_name;
    this.project_type = project_type;
    this.project_requester = project_requester;
    this.project_assignee = project_assignee;
    this.project_remarks = project_remarks;
    this.project_legal_entity = project_legal_entity;
    this.project_notes = project_notes;
    this.project_updates = project_updates;
    this.project_prereq = project_prereq;
    this.project_tasks = project_tasks;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all projects
  async fetchAll() {
    return await db(DB_NAME).select("*");
  }

  // Fetch a project by ID
  async fetch(columnNames) {
    return await db(DB_NAME).where(columnNames).first();
  }

  // Add a new project
  async add() {
    const dataToInsert = {
      project_id: this.project_id,
      project_name: this.project_name,
      project_type: this.project_type,
      project_requester: this.project_requester,
      project_assignee: this.project_assignee,
      project_remarks: this.project_remarks,
      project_legal_entity: this.project_legal_entity,
      project_notes: JSON.stringify(this.project_notes),
      project_updates: JSON.stringify(this.project_updates),
      project_prereq: JSON.stringify(this.project_prereq),
      project_tasks: JSON.stringify(this.project_tasks),
    };

    const result = await db(DB_NAME).insert(dataToInsert).returning("*");
    return this.parseJsonFields(result[0]);
  }

  // Update a project
  async update() {
    const dataToUpdate = {
      project_name: this.project_name,
      project_type: this.project_type,
      project_requester: this.project_requester,
      project_assignee: this.project_assignee,
      project_remarks: this.project_remarks,
      project_legal_entity: this.project_legal_entity,
      project_notes: JSON.stringify(this.project_notes),
      project_updates: JSON.stringify(this.project_updates),
      project_prereq: JSON.stringify(this.project_prereq),
      project_tasks: JSON.stringify(this.project_tasks),
      updated_at: new Date(),
    };

    const result = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update(dataToUpdate)
      .returning("*");

    return this.parseJsonFields(result[0]);
  }

  // Delete a project
  async delete() {
    return await db(DB_NAME).where({ project_id: this.project_id }).del();
  }

  // Parse JSON fields from database result
  parseJsonFields(project) {
    if (!project) return null;

    return {
      ...project,
      project_notes:
        typeof project.project_notes === "string"
          ? JSON.parse(project.project_notes)
          : project.project_notes,
      project_updates:
        typeof project.project_updates === "string"
          ? JSON.parse(project.project_updates)
          : project.project_updates,
      project_prereq:
        typeof project.project_prereq === "string"
          ? JSON.parse(project.project_prereq)
          : project.project_prereq,
      project_tasks:
        typeof project.project_tasks === "string"
          ? JSON.parse(project.project_tasks)
          : project.project_tasks,
    };
  }

  // Helper methods for array fields

  // Add a note
  async addNote(note) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const notes = parsedProject.project_notes || [];

    // Add ID if not provided
    if (!note.id) {
      note.id = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    }

    notes.push(note);

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_notes: JSON.stringify(notes),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }

  // Add a prerequisite
  async addPrereq(prereq) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const prereqs = parsedProject.project_prereq || [];

    // Add ID if not provided
    if (!prereq.id) {
      prereq.id =
        prereqs.length > 0 ? Math.max(...prereqs.map((p) => p.id)) + 1 : 1;
    }

    prereqs.push(prereq);

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_prereq: JSON.stringify(prereqs),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }

  // Add a task
  async addTask(task) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const tasks = parsedProject.project_tasks || [];

    // Add ID if not provided
    if (!task.id) {
      task.id = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
    }

    tasks.push(task);

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_tasks: JSON.stringify(tasks),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }

  // Add an update
  async addUpdate(update) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const updates = parsedProject.project_updates || [];

    // Add ID if not provided
    if (!update.id) {
      update.id =
        updates.length > 0 ? Math.max(...updates.map((u) => u.id)) + 1 : 1;
    }

    updates.push(update);

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_updates: JSON.stringify(updates),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }

  // Update a specific task by ID
  async updateTask(taskId, updatedTaskData) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const tasks = parsedProject.project_tasks || [];

    const taskIndex = tasks.findIndex((task) => task.id === parseInt(taskId));
    if (taskIndex === -1) return null;

    // Update the task
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTaskData };

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_tasks: JSON.stringify(tasks),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }

  // Update a specific prerequisite by ID
  async updatePrereq(prereqId, updatedPrereqData) {
    const project = await this.fetch({ project_id: this.project_id });
    if (!project) return null;

    const parsedProject = this.parseJsonFields(project);
    const prereqs = parsedProject.project_prereq || [];

    const prereqIndex = prereqs.findIndex(
      (prereq) => prereq.id === parseInt(prereqId)
    );
    if (prereqIndex === -1) return null;

    // Update the prerequisite
    prereqs[prereqIndex] = { ...prereqs[prereqIndex], ...updatedPrereqData };

    const updated = await db(DB_NAME)
      .where({ project_id: this.project_id })
      .update({
        project_prereq: JSON.stringify(prereqs),
        updated_at: new Date(),
      })
      .returning("*");

    return this.parseJsonFields(updated[0]);
  }
}

export default ProjectManagement;
