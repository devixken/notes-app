import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

import { User } from "../models/user.js";
import { requireAuth } from "../middleware/auth.js";

const BCRYPT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  // TODO: set secure: true once the app is served over HTTPS (Nginx stage)
  secure: false,
};

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(72),
});

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { email, password } = result.data;
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await User.create({ email, passwordHash });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    throw error;
  }
});

authRouter.post("/login", async (req, res) => {
  const result = credentialsSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, password } = result.data;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );

  const passwordOk =
    user && (await bcrypt.compare(password, user.passwordHash));
  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS,
  });

  res.cookie("token", token, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });

  return res.json({ id: user.id, email: user.email });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  return res.json({ id: user.id, email: user.email });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.status(204).end();
});
