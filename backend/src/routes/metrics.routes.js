import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { todayMetrics } from "../controllers/metrics.controller.js";

const r = Router();
r.get("/today", requireAuth, requireRole("ADMIN"), todayMetrics);
export default r;
