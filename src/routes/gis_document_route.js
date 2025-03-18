import express from "express";

import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  addGISDocument,
  deleteGISDocument,
  getAllEntityGISDocuments,
  getAllGISDocuments,
  getGISDocument,
} from "../controllers/gis_document_controller.js";
const router = express.Router();

const PATH = `/legal-entities/:entity_id/gis-tracker`;

router
  .route("/legal-entities/gis-tracker")
  .get(checkPayloadMiddleware, getAllGISDocuments);

router
  .route(`${PATH}`)
  .get(checkPayloadMiddleware, getAllEntityGISDocuments)
  // TODO: Add GIS
  .post(checkPayloadMiddleware, addGISDocument);

router
  .route(`${PATH}/:gis_document_id`)
  // TODO: Get GIS
  .get(checkPayloadMiddleware, getGISDocument)
  // TODO: Update GIS
  .patch(checkPayloadMiddleware, getAllGISDocuments)
  // TODO: Delete GIS
  .delete(checkPayloadMiddleware, deleteGISDocument);

// router.route("/generate-quote").get(checkPayloadMiddleware, generateQuote);
// router.route("/get-quote/:quote_id").get(getQuote);

export default router;
