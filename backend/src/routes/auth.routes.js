import { Router } from "express";
import { login, createUser } from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
const r = Router();

r.post("/login", login);
r.post("/users", requireAuth, requireRole("ADMIN"), createUser);

export default r;
