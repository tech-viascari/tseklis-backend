import express from "express";

import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import {
  addGISDocument,
  deleteGISDocument,
  generateGISDocument,
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
  .post(checkPayloadMiddleware, addGISDocument);

router
  .route(`${PATH}/:gis_document_id`)
  .get(checkPayloadMiddleware, getGISDocument)
  .patch(checkPayloadMiddleware, getAllGISDocuments)
  .delete(checkPayloadMiddleware, deleteGISDocument);

router
  .route("/generate-quote/:gis_document_id")
  .get(checkPayloadMiddleware, generateGISDocument);
router.route("/get-gis-document/:gis_document_id").get(getGISDocument);

export default router;
