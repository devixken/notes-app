import {
  AUTH_COOKIE_NAME,
  authCookieOptions,
  TOKEN_TTL_SECONDS,
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service.js";

export async function register(req, res) {
  const user = await registerUser(req.body);
  res.status(201).json(user);
}

export async function login(req, res) {
  const { user, token } = await loginUser(req.body);
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...authCookieOptions,
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
  res.json(user);
}

export async function me(req, res) {
  const user = await getCurrentUser(req.userId);
  res.json(user);
}

export function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, authCookieOptions);
  res.status(204).end();
}
