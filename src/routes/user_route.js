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

// router.get("/users", checkPayloadMiddleware, fetchUsers);
router.route("/users").get(fetchUsers).post(userMiddleware, addUser);

router
  .route("/user/:user_id")
  .get(fetchUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
