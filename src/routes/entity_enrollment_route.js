import express from "express";
import { getAllEntities, addEntity, getEntity, updateEntity, deleteEntity } from "../controllers/entity_enrollment_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";

const router = express.Router();
router.get("/entity-enrollment", checkPayloadMiddleware, getAllEntities);
router.post("/entity-enrollment/add", checkPayloadMiddleware, addEntity);
router.get("/entity-enrollment/get/:entity_id", checkPayloadMiddleware, getEntity);
router.patch("/entity-enrollment/update/:entity_id", checkPayloadMiddleware, updateEntity);
router.delete("/entity-enrollment/delete/:entity_id", checkPayloadMiddleware, deleteEntity);

export default router;
