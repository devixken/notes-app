import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

const BCRYPT_ROUNDS = 12;
const JWT_ALGORITHM = "HS256";
export const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

export const AUTH_COOKIE_NAME = "token";
export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  // TODO: set secure: true once the app is served over HTTPS (Nginx stage)
  secure: false,
};

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, {
    algorithm: JWT_ALGORITHM,
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

export function verifyToken(token) {
  const payload = jwt.verify(token, config.jwtSecret, {
    algorithms: [JWT_ALGORITHM],
  });
  return payload.sub;
}
