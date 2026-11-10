import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.js";
import { validate } from "../middleware/validate.js";
import { credentialsSchema } from "../schemas/auth.schema.js";
import { register, login, me, logout } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", validate(credentialsSchema), register);
authRouter.post("/login", validate(credentialsSchema), login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", logout);
