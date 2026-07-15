
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { registerUser, loginUser } from '../../services/auth.service.js';

const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const { user, token } = await registerUser(name, email, password);
  res.status(201).json({ success: true, data: { user, token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { user, token } = await loginUser(email, password);
  res.json({ success: true, data: { user, token } });
});