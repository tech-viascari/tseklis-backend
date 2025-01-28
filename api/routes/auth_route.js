import express from "express";
import {
  authCheck,
  authenticate,
  logout,
} from "../controllers/auth_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import checkAuthorization from "../utils/authorization.js";
import { decodeToken } from "../utils/token.js";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get("/auth/check", authCheck);
router.post("/authenticate", authMiddleware, authenticate);
router.post("/logout", authMiddleware, logout);

export default router;
