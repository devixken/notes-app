import { AUTH_COOKIE_NAME, verifyToken } from "../services/auth.service.js";

export function requireAuth(req, res, next) {
  const token = req.cookies[AUTH_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    req.userId = verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
