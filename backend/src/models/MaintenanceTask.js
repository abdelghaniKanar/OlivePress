import mongoose from "mongoose";
const MaintenanceTaskSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["MAINTENANCE", "CLEANING"], required: true },
    title: { type: String, required: true },
    machine: { type: String },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["PLANNED", "IN_PROGRESS", "DONE", "CANCELLED"],
      default: "PLANNED",
    },
    assignedWorkerId: { type: mongoose.Types.ObjectId, ref: "User" },
    startedAt: { type: Date },
    completedAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);
MaintenanceTaskSchema.index({ status: 1, scheduledAt: -1 });
export default mongoose.model("MaintenanceTask", MaintenanceTaskSchema);
