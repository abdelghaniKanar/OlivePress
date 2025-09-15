import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { getPricing, setPricing } from "../controllers/settings.controller.js";

const r = Router();
r.get("/pricing", requireAuth, requireRole("ADMIN"), getPricing);
r.put("/pricing", requireAuth, requireRole("ADMIN"), setPricing);

export default r;
