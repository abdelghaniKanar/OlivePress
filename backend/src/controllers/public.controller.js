import Client from "../models/Client.js";
import Batch from "../models/Batch.js";

export const publicClientBatches = async (req, res) => {
  const { cin, status } = req.query;
  if (!cin) return res.status(400).json({ error: "cin required" });
  const client = await Client.findOne({ cin });
  if (!client) return res.json({ client: null, batches: [] });

  const filter = { clientId: client._id };
  if (status && status !== "ALL") filter.status = status;

  const batches = await Batch.find(filter).sort({ receivedAt: -1 });
  res.json({
    client: { id: client._id, cin: client.cin, name: client.name },
    batches,
  });
};
