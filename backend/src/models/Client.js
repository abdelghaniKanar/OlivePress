import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema(
  {
    cin: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

ClientSchema.index({ cin: 1 }, { unique: true });

export default mongoose.model("Client", ClientSchema);
