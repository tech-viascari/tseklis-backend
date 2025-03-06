import express from "express";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import { createLegalEntity, getAllLegalEntities } from "../controllers/legal_entities_controller.js";

const router = express.Router();
router
  .route("/legal-entities")
  .get(checkPayloadMiddleware, getAllLegalEntities)
  .post(checkPayloadMiddleware, createLegalEntity)
  .delete(checkPayloadMiddleware, () => {})
  .patch(checkPayloadMiddleware, () => {});

router.route("/legal-entity/:entity_id").get(checkPayloadMiddleware, () => {});

export default router;
