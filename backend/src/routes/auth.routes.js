import { Router } from "express";
import { User } from "../models/user.model.js";
import { requireAuth } from "../middleware/require-auth.js";
import { validate } from "../middleware/validate.js";
import { credentialsSchema } from "../schemas/auth.schema.js";
import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  TOKEN_TTL_SECONDS,
  hashPassword,
  verifyPassword,
  signToken,
} from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", validate(credentialsSchema), async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await hashPassword(password);

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

authRouter.post("/login", validate(credentialsSchema), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );

  const passwordOk =
    user && (await verifyPassword(password, user.passwordHash));
  if (!passwordOk) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.cookie(AUTH_COOKIE_NAME, signToken(user.id), {
    ...authCookieOptions,
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
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  return res.status(204).end();
});
