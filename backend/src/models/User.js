import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "WORKER"], required: true },
    name: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
