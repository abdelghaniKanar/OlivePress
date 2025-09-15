import { Router } from "express";
import authRouter from "./auth.routes.js";
import clientsRouter from "./clients.routes.js";
import settingsRouter from "./settings.routes.js";
import batchesRouter from "./batches.routes.js";
import publicRouter from "./public.routes.js";
const router = Router();

// feature routers here
router.use("/auth", authRouter);
router.use("/clients", clientsRouter);
router.use("/settings", settingsRouter);
router.use("/batches", batchesRouter);
router.use("/public", publicRouter);
// router.use("/worker-shifts", shiftsRouter);
// router.use("/maintenance", maintenanceRouter);
// router.use("/metrics", metricsRouter);

export default router;
