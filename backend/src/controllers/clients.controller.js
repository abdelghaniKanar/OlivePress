import { validationResult } from "express-validator";
import Client from "../models/Client.js";

export const createClient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const { cin, name, phone, address } = req.body;
  const exists = await Client.findOne({ cin });
  if (exists) return res.status(409).json({ error: "CIN exists" });
  const c = await Client.create({ cin, name, phone, address });
  res.status(201).json(c);
};

export const listClients = async (req, res) => {
  const { q } = req.query; // search by cin or name
  const filter = q
    ? { $or: [{ cin: new RegExp(q, "i") }, { name: new RegExp(q, "i") }] }
    : {};
  const clients = await Client.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(clients);
};

export const getClient = async (req, res) => {
  const c = await Client.findById(req.params.id);
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
};

export const updateClient = async (req, res) => {
  const { name, phone, address } = req.body;
  const c = await Client.findByIdAndUpdate(
    req.params.id,
    { name, phone, address },
    { new: true }
  );
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json(c);
};

export const deleteClient = async (req, res) => {
  const c = await Client.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
};
