import express from "express";

import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  addDocument,
  deleteDocument,
  generateDocument,
  getAllDraftedDocuments,
  getAllEntityDocuments,
  getDocument,
} from "../controllers/document_drafting_controller.js";

const router = express.Router();

const PATH = `/legal-entities/:entity_id/document-drafting`;

router
  .route("/document-drafting")
  .get(checkPayloadMiddleware, getAllDraftedDocuments);

router
  .route(`${PATH}`)
  .get(checkPayloadMiddleware, getAllEntityDocuments)
  .post(checkPayloadMiddleware, addDocument);

router
  .route(`${PATH}/:document_id`)
  .get(checkPayloadMiddleware, getDocument)
  // .patch(checkPayloadMiddleware, updateGISDocument)
  .delete(checkPayloadMiddleware, deleteDocument);

router.route("/generate-document/:document_id").post(generateDocument);
router.route("/get-document/:").get(getDocument);
// router.route("/update-gis-document/:gis_document_id").post(updateGIS);

export default router;
