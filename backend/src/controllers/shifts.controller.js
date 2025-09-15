import WorkerShift from "../models/WorkerShift.js";

export const upsertShift = async (req, res) => {
  const { workerId, date, present, notes } = req.body;
  const s = await WorkerShift.findOneAndUpdate(
    { workerId, date: new Date(date) },
    { present, notes },
    { new: true, upsert: true }
  );
  res.json(s);
};

export const listShifts = async (req, res) => {
  const { date } = req.query;
  const filter = {};
  if (date) filter.date = new Date(date);
  const items = await WorkerShift.find(filter).populate(
    "workerId",
    "name email"
  );
  res.json(items);
};
