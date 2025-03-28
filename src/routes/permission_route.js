import express from "express";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  addPermission,
  deletePermission,
  getAllPermissions,
  getPaginate,
  getPermission,
  updatePermission,
} from "../controllers/permissions_controller.js";
const router = express.Router();

router
  .route("/permissions")
  .get(checkPayloadMiddleware, getAllPermissions)
  .post(checkPayloadMiddleware, addPermission);

router
  .route("/permission/:permission_id")
  .get(checkPayloadMiddleware, getPermission)
  .patch(checkPayloadMiddleware, updatePermission)
  .delete(checkPayloadMiddleware, deletePermission);

router.get("/permissions/getPaginate", getPaginate);

export default router;
