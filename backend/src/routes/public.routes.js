import { Router } from "express";
import { publicClientBatches } from "../controllers/public.controller.js";
const r = Router();

r.get("/client-batches", publicClientBatches);

export default r;
