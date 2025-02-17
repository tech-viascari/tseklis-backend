import express from "express";
import {
  addUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  updateUser,
} from "../controllers/user_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import { userMiddleware } from "../middlewares/users_middleware.js";
const router = express.Router();

router
  .route("/users")
  .get(checkPayloadMiddleware, fetchUsers)
  .post(checkPayloadMiddleware, userMiddleware, addUser);

router
  .route("/user/:user_id")
  .get(checkPayloadMiddleware, fetchUser)
  .patch(checkPayloadMiddleware, updateUser)
  .delete(checkPayloadMiddleware, deleteUser);

export default router;
