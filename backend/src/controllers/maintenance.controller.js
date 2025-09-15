import MaintenanceTask from "../models/MaintenanceTask.js";

export const createTask = async (req, res) => {
  const { type, title, machine, scheduledAt } = req.body;
  if (!type || !title || !scheduledAt)
    return res.status(400).json({ error: "missing fields" });
  const t = await MaintenanceTask.create({ type, title, machine, scheduledAt });
  res.status(201).json(t);
};

export const listTasks = async (req, res) => {
  const { status, assignee } = req.query;
  const filter = {};
  if (status && status !== "ALL") filter.status = status;
  if (assignee) filter.assignedWorkerId = assignee;
  const items = await MaintenanceTask.find(filter)
    .sort({ scheduledAt: -1 })
    .populate("assignedWorkerId", "name email");
  res.json(items);
};

export const assignTask = async (req, res) => {
  const { assignedWorkerId } = req.body;
  const t = await MaintenanceTask.findByIdAndUpdate(
    req.params.id,
    { assignedWorkerId },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json(t);
};

export const startTask = async (req, res) => {
  const t = await MaintenanceTask.findByIdAndUpdate(
    req.params.id,
    { status: "IN_PROGRESS", startedAt: new Date() },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json(t);
};

export const closeTask = async (req, res) => {
  const { notes } = req.body;
  const t = await MaintenanceTask.findByIdAndUpdate(
    req.params.id,
    { status: "DONE", completedAt: new Date(), notes },
    { new: true }
  );
  if (!t) return res.status(404).json({ error: "Not found" });
  res.json(t);
};
