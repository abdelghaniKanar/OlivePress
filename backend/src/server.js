import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// health
app.get("/health", (_, res) => res.status(200).json({ ok: true }));

// api
app.use("/api", router);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
});
