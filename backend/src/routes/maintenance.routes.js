import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import {
  createTask,
  listTasks,
  assignTask,
  startTask,
  closeTask,
} from "../controllers/maintenance.controller.js";

const r = Router();

// Admin planning & assignment
r.post("/", requireAuth, requireRole("ADMIN"), createTask);
r.get("/", requireAuth, requireRole("ADMIN"), listTasks);
r.patch("/:id/assign", requireAuth, requireRole("ADMIN"), assignTask);

// Worker/Admin execution
r.patch("/:id/start", requireAuth, startTask);
r.patch("/:id/done", requireAuth, closeTask);

export default r;
