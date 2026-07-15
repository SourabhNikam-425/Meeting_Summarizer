import jwt from "jsonwebtoken";
import { User } from "../db/models/User.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function registerUser(name, email, password) {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const user = await User.create({ name, email, password });
  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
  return { user, token };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, "Invalid email or password");

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
  return { user, token };
}
