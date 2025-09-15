import mongoose from "mongoose";
const SettingsSchema = new mongoose.Schema(
  {
    defaultFeePerKg: { type: Number, default: 1.2 },
    currency: { type: String, default: "MAD" },
    updatedBy: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export default mongoose.model("Settings", SettingsSchema);
