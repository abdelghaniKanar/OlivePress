const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Mount API (routers will be added later)
const apiRouter = require("./routes");
app.use("/api", apiRouter);

module.exports = app;
