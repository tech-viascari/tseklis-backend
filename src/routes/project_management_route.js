import express from "express";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  getAllProjects,
  addProject,
  getProject,
  updateProject,
  deleteProject,
  addProjectNote,
  addProjectUpdate,
  addProjectPrereq,
  addProjectTask,
  updateProjectTask,
  updateProjectPrereq,
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

// Routes for project array fields
router
  .route("/project/:project_id/note")
  .post(checkPayloadMiddleware, addProjectNote);

router
  .route("/project/:project_id/update")
  .post(checkPayloadMiddleware, addProjectUpdate);

router
  .route("/project/:project_id/prereq")
  .post(checkPayloadMiddleware, addProjectPrereq);

router
  .route("/project/:project_id/task")
  .post(checkPayloadMiddleware, addProjectTask);

// Routes for updating specific items in arrays
router
  .route("/project/:project_id/task/:task_id")
  .patch(checkPayloadMiddleware, updateProjectTask);

router
  .route("/project/:project_id/prereq/:prereq_id")
  .patch(checkPayloadMiddleware, updateProjectPrereq);

export default router;
