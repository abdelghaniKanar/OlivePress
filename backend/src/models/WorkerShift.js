import mongoose from "mongoose";
const WorkerShiftSchema = new mongoose.Schema(
  {
    workerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true }, // date-only ok
    present: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);
WorkerShiftSchema.index({ workerId: 1, date: 1 }, { unique: true });
export default mongoose.model("WorkerShift", WorkerShiftSchema);
