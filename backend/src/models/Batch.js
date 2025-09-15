import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Types.ObjectId, ref: "Client", required: true },
    weightKg: { type: Number, required: true, min: 0 },
    variety: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["RECEIVED", "ON_HOLD", "PROCESSING", "COMPLETED", "DELIVERED"],
      default: "RECEIVED",
    },
    receivedAt: { type: Date, default: () => new Date() },
    processingStartedAt: { type: Date },
    completedAt: { type: Date },
    deliveredAt: { type: Date },
    oilQuantityL: { type: Number, default: 0 },
    feePerKg: { type: Number, required: true, min: 0 },
    totalFee: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

BatchSchema.index({ clientId: 1 });
BatchSchema.index({ status: 1, receivedAt: -1 });
BatchSchema.index({ receivedAt: -1 });

export default mongoose.model("Batch", BatchSchema);
