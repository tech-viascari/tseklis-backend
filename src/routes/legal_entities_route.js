import express from "express";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  addLegalEntity,
  deleteLegalEntity,
  getAllLegalEntities,
  getLegalEntity,
  updateLegalEntity,
} from "../controllers/legal_entities_controller.js";
import {
  legalEntityMiddleware,
  uploadLogoMiddleware,
} from "../middlewares/legal_entities_middleware.js";

const router = express.Router();
router
  .route("/legal-entities")
  .get(checkPayloadMiddleware, getAllLegalEntities)
  .post(
    checkPayloadMiddleware,
    legalEntityMiddleware,
    uploadLogoMiddleware,
    addLegalEntity
  );

router
  .route("/legal-entities/:entity_id")
  .get(checkPayloadMiddleware, getLegalEntity)
  .patch(checkPayloadMiddleware, updateLegalEntity)
  .delete(checkPayloadMiddleware, deleteLegalEntity);

export default router;
