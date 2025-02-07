import express from "express";
import { getAllRoles, seeders } from "../controllers/roles_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";

const router = express.Router();

router.post("/seeders", seeders);

router.get("/roles", checkPayloadMiddleware, getAllRoles);

export default router;