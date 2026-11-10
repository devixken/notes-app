import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/user.model.js";
import { httpError } from "../utils/http-error.js";

const BCRYPT_ROUNDS = 12;
const JWT_ALGORITHM = "HS256";
const MONGO_DUPLICATE_KEY = 11000;
export const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 1 day

export const AUTH_COOKIE_NAME = "token";
export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  // TODO: set secure: true once the app is served over HTTPS (Nginx stage)
  secure: false,
};

function toPublicUser(user) {
  return { id: user.id, email: user.email };
}

export async function registerUser({ email, password }) {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const user = await User.create({ email, passwordHash });
    return toPublicUser(user);
  } catch (error) {
    if (error.code === MONGO_DUPLICATE_KEY) {
      throw httpError(409, "Email is already registered");
    }
    throw error;
  }
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+passwordHash",
  );

  const passwordOk =
    user && (await bcrypt.compare(password, user.passwordHash));
  if (!passwordOk) {
    throw httpError(401, "Invalid email or password");
  }

  return { user: toPublicUser(user), token: signToken(user.id) };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw httpError(401, "Not authenticated");
  }
  return toPublicUser(user);
}

function signToken(userId) {
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
