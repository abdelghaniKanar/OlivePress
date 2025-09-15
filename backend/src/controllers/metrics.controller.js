import Client from "../models/Client.js";
import Batch from "../models/Batch.js";

export const todayMetrics = async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const totalClients = await Client.countDocuments();

  const receptionsTodayAgg = await Batch.aggregate([
    { $match: { receivedAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, count: { $sum: 1 }, kg: { $sum: "$weightKg" } } },
  ]);
  const rec = receptionsTodayAgg[0] || { count: 0, kg: 0 };

  const litersAgg = await Batch.aggregate([
    { $match: { completedAt: { $gte: start, $lte: end } } },
    { $group: { _id: null, liters: { $sum: "$oilQuantityL" } } },
  ]);
  const lit = litersAgg[0] || { liters: 0 };

  res.json({
    totalClients,
    receptionsToday: rec.count,
    kgReceivedToday: rec.kg,
    litersProducedToday: lit.liters,
  });
};
