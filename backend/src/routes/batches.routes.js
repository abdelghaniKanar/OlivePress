import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.js";
import {
  createBatch,
  listBatches,
  getBatch,
  updateBatchFields,
  deleteBatch,
  setStatus,
  setProduction,
  setPayment,
} from "../controllers/batches.controller.js";

const r = Router();
r.use(requireAuth);

r.post("/", body("weightKg").isFloat({ min: 0.01 }), createBatch);
r.get("/", listBatches);
r.get("/:id", getBatch);
r.patch("/:id", updateBatchFields);
r.delete("/:id", deleteBatch);
r.patch("/:id/status", setStatus);
r.patch("/:id/production", setProduction);
r.patch("/:id/payment", setPayment);

export default r;
