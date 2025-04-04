import express from "express";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  // Main project CRUD operations
  getAllProjects,
  addProject,
  getProject,
  updateProject,
  deleteProject,

  // Notes-related routes
  addProjectNote,
  getProjectNotes,

  // Updates/Logs-related routes
  addProjectUpdate,
  getProjectUpdates,

  // Prerequisites-related routes
  addProjectPrereq,
  getProjectPrereqs,
  updateProjectPrereq,

  // Tasks-related routes
  addProjectTask,
  getProjectTasks,
  updateProjectTask,
} from "../controllers/project_management_controllers.js";

const router = express.Router();

// Main project routes
router
  .route("/projects")
  .get(checkPayloadMiddleware, getAllProjects)
  .post(checkPayloadMiddleware, addProject);

router
  .route("/project/:project_id")
  .get(checkPayloadMiddleware, getProject)
  .patch(checkPayloadMiddleware, updateProject)
  .delete(checkPayloadMiddleware, deleteProject);

// Notes routes
router
  .route("/project/:project_id/notes")
  .get(checkPayloadMiddleware, getProjectNotes)
  .post(checkPayloadMiddleware, addProjectNote);

// Updates/Logs routes
router
  .route("/project/:project_id/updates")
  .get(checkPayloadMiddleware, getProjectUpdates)
  .post(checkPayloadMiddleware, addProjectUpdate);

// Prerequisites routes
router
  .route("/project/:project_id/prerequisites")
  .get(checkPayloadMiddleware, getProjectPrereqs)
  .post(checkPayloadMiddleware, addProjectPrereq);

router
  .route("/project/:project_id/prerequisites/:prereq_id")
  .patch(checkPayloadMiddleware, updateProjectPrereq);

// Tasks routes
router
  .route("/project/:project_id/tasks")
  .get(checkPayloadMiddleware, getProjectTasks)
  .post(checkPayloadMiddleware, addProjectTask);

router
  .route("/project/:project_id/tasks/:task_id")
  .patch(checkPayloadMiddleware, updateProjectTask);

export default router;
