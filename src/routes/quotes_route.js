import express from "express";
import { getAllQuotes } from "../controllers/quotes_controller.js";
import { checkPayloadMiddleware } from "../middlewares/global_middleware.js";
const router = express.Router();

router.get("/quotes", checkPayloadMiddleware, getAllQuotes);

export default router;
