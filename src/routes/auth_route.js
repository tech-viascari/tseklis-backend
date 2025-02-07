import express from "express";
import {
  authCheck,
  authenticate,
  googleAuth,
  logout,
} from "../controllers/auth_controller.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
const router = express.Router();

router.get("/auth/check", checkPayloadMiddleware, authCheck);
router.post("/authenticate", authMiddleware, authenticate);
router.post("/auth/google", googleAuth);
router.post("/logout", logout);

export default router;
