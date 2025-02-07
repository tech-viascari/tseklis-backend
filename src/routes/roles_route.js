import express from "express";
import {
  addRole,
  deleteRole,
  getAllRoles,
  seeders,
  updateRole,
} from "../controllers/roles_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";

const router = express.Router();

router.post("/roles/seeders", seeders);

router
  .route("/roles")
  .get(checkPayloadMiddleware, getAllRoles)
  .post(checkPayloadMiddleware, addRole);

router
  .route("/role/:role_id")
  .get(checkPayloadMiddleware, getAllRoles)
  .patch(updateRole)
  .delete(deleteRole);

export default router;
