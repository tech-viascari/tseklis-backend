import express from "express";
import {
  authCheck,
  authenticate,
  logout,
} from "../controllers/auth_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { fetchUsers } from "../controllers/user_controller.js";
import { protectedMiddleware } from "../middlewares/protected_middleware.js";
const router = express.Router();

router.get("/users", protectedMiddleware, fetchUsers);
router.post("/authenticate", authMiddleware, authenticate);
router.post("/logout", authMiddleware, logout);

export default router;
