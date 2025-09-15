import { validationResult } from "express-validator";
import Client from "../models/Client.js";
import Batch from "../models/Batch.js";
import Settings from "../models/Settings.js";
import { computeTotal } from "../utils/fees.js";

// Create batch (by client CIN or ID)
export const createBatch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const {
    clientCIN,
    clientId,
    weightKg,
    feePerKg,
    variety,
    notes,
    paymentStatus,
  } = req.body;
  let client = null;
  if (clientId) client = await Client.findById(clientId);
  if (!client && clientCIN) client = await Client.findOne({ cin: clientCIN });
  if (!client)
    return res.status(400).json({ error: "Client not found (by id or cin)" });

  let fee = feePerKg;
  if (fee == null) {
    const s = await Settings.findOne();
    fee = s?.defaultFeePerKg ?? Number(process.env.DEFAULT_FEE_PER_KG || 1.2);
  }
  const totalFee = computeTotal(weightKg, fee);

  const batch = await Batch.create({
    clientId: client._id,
    weightKg,
    variety,
    notes,
    feePerKg: fee,
    totalFee,
    paymentStatus: paymentStatus || "UNPAID",
  });
  res.status(201).json(batch);
};

export const listBatches = async (req, res) => {
  const { status, startDate, endDate, cin } = req.query;
  const filter = {};
  if (status && status !== "ALL") filter.status = status;
  if (startDate || endDate) {
    filter.receivedAt = {};
    if (startDate) filter.receivedAt.$gte = new Date(startDate);
    if (endDate) filter.receivedAt.$lte = new Date(endDate);
  }
  if (cin) {
    const c = await Client.findOne({ cin });
    filter.clientId = c ? c._id : null;
  }
  const items = await Batch.find(filter)
    .sort({ receivedAt: -1 })
    .limit(200)
    .populate("clientId", "cin name");
  res.json(items);
};

export const getBatch = async (req, res) => {
  const b = await Batch.findById(req.params.id).populate(
    "clientId",
    "cin name"
  );
  if (!b) return res.status(404).json({ error: "Not found" });
  res.json(b);
};

export const updateBatchFields = async (req, res) => {
  const { weightKg, variety, notes, feePerKg } = req.body;
  const b = await Batch.findById(req.params.id);
  if (!b) return res.status(404).json({ error: "Not found" });
  if (weightKg != null) b.weightKg = weightKg;
  if (variety != null) b.variety = variety;
  if (notes != null) b.notes = notes;
  if (feePerKg != null) b.feePerKg = feePerKg;
  // recompute total
  b.totalFee = computeTotal(b.weightKg, b.feePerKg);
  await b.save();
  res.json(b);
};

export const deleteBatch = async (req, res) => {
  const b = await Batch.findByIdAndDelete(req.params.id);
  if (!b) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
};

// Status transitions
export const setStatus = async (req, res) => {
  const { status } = req.body;
  const b = await Batch.findById(req.params.id);
  if (!b) return res.status(404).json({ error: "Not found" });

  const now = new Date();
  const allowed = [
    "RECEIVED",
    "ON_HOLD",
    "PROCESSING",
    "COMPLETED",
    "DELIVERED",
  ];
  if (!allowed.includes(status))
    return res.status(400).json({ error: "invalid status" });

  // transitions
  if (status === "PROCESSING") b.processingStartedAt = now;
  if (status === "COMPLETED") {
    if (!b.oilQuantityL || b.oilQuantityL <= 0) {
      return res
        .status(400)
        .json({ error: "oilQuantityL must be > 0 to complete" });
    }
    b.completedAt = now;
  }
  if (status === "DELIVERED") b.deliveredAt = now;

  b.status = status;
  await b.save();
  res.json(b);
};

// Production (set oil liters and complete in two steps)
export const setProduction = async (req, res) => {
  const { oilQuantityL } = req.body;
  const b = await Batch.findById(req.params.id);
  if (!b) return res.status(404).json({ error: "Not found" });
  if (oilQuantityL == null || oilQuantityL <= 0) {
    return res.status(400).json({ error: "oilQuantityL must be > 0" });
  }
  b.oilQuantityL = oilQuantityL;
  await b.save();
  res.json(b);
};

// Payment status
export const setPayment = async (req, res) => {
  const { paymentStatus } = req.body;
  const allowed = ["UNPAID", "PARTIAL", "PAID"];
  if (!allowed.includes(paymentStatus))
    return res.status(400).json({ error: "invalid paymentStatus" });
  const b = await Batch.findByIdAndUpdate(
    req.params.id,
    { paymentStatus },
    { new: true }
  );
  if (!b) return res.status(404).json({ error: "Not found" });
  res.json(b);
};
