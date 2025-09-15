import Settings from "../models/Settings.js";

export const getPricing = async (req, res) => {
  const s = await Settings.findOne();
  res.json(
    s || {
      defaultFeePerKg: Number(process.env.DEFAULT_FEE_PER_KG || 1.2),
      currency: "MAD",
    }
  );
};

export const setPricing = async (req, res) => {
  const { defaultFeePerKg, currency } = req.body;
  const s = await Settings.findOneAndUpdate(
    {},
    { defaultFeePerKg, currency, updatedBy: req.user.id },
    { new: true, upsert: true }
  );
  res.json(s);
};
