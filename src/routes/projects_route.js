import express from "express";

import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
import { getAllActiveUsers } from "../controllers/projects_controller.js";

const router = express.Router();

const PATH = `/projects/`;

router
  .route("/get-all-active-users")
  .get(checkPayloadMiddleware, getAllActiveUsers);

// router
//   .route(`${PATH}`)
//   .get(checkPayloadMiddleware, getAllEntityGISDocuments)
//   .post(checkPayloadMiddleware, addGISDocument);

// router
//   .route(`${PATH}/:gis_document_id`)
//   .get(checkPayloadMiddleware, getGISDocument)
//   .patch(checkPayloadMiddleware, updateGISDocument)
//   .delete(checkPayloadMiddleware, deleteGISDocument);

// router.route("/generate-gis/:gis_document_id").post(generateGISDocument);

// router.route("/get-gis-document/:gis_document_id").get(getGISDocument);
// router.route("/get-latest-gis-document/:entity_id").get(checkPayloadMiddleware, getLatestGIS);

// router.route("/update-gis-document/:gis_document_id").post(updateGIS);

export default router;
