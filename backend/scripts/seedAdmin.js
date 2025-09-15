import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../src/models/User.js";
import { connectDB } from "../src/config/db.js";

dotenv.config();

const run = async () => {
  await connectDB();
  const email = process.argv[2] || "admin@mill.local";
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Admin";
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Admin already exists:", email);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash, role: "ADMIN", name });
    console.log("Admin created:", email);
  }
  await mongoose.disconnect();
};
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
