import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upsertShift, listShifts } from "../controllers/shifts.controller.js";

const r = Router();
r.use(requireAuth, requireRole("ADMIN"));

r.post("/", upsertShift);
r.get("/", listShifts);

export default r;
