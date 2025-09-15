import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth.js";
import {
  createClient,
  listClients,
  getClient,
  updateClient,
  deleteClient,
} from "../controllers/clients.controller.js";

const r = Router();
r.use(requireAuth);

r.post(
  "/",
  body("cin").isString().notEmpty(),
  body("name").isString().notEmpty(),
  body("phone").isString().notEmpty(),
  createClient
);
r.get("/", listClients);
r.get("/:id", getClient);
r.patch("/:id", updateClient);
r.delete("/:id", deleteClient);

export default r;
