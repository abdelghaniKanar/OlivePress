import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const sign = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({
    token: sign(user),
    user: { id: user._id, name: user.name, role: user.role },
  });
};

// Admin creates users (ADMIN/WORKER)
export const createUser = async (req, res) => {
  const { email, password, role, name, phone } = req.body;
  if (!email || !password || !role || !name)
    return res.status(400).json({ error: "missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "email exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const u = await User.create({ email, passwordHash, role, name, phone });
  return res
    .status(201)
    .json({ id: u._id, email: u.email, role: u.role, name: u.name });
};
