import express from "express";
import {
  addQuote,
  deleteQuote,
  generateQuote,
  getAllQuotes,
  getQuote,
  updateQuote,
} from "../controllers/quotes_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
const router = express.Router();

router
  .route("/quotes")
  .get(checkPayloadMiddleware, getAllQuotes)
  .post(checkPayloadMiddleware, addQuote);

router
  .route("/quote/:quote_id")
  .get(checkPayloadMiddleware, getQuote)
  .patch(checkPayloadMiddleware, updateQuote)
  .delete(checkPayloadMiddleware, deleteQuote);

router.route("/generate-quote").get(checkPayloadMiddleware, generateQuote);
router.route("/get-quote/:quote_id").get(getQuote);

export default router;
