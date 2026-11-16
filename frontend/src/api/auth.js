import { request } from "./client.js";

export const getMe = () => request("/auth/me");
export const login = (credentials) =>
  request("/auth/login", { method: "POST", body: credentials });
export const register = (credentials) =>
  request("/auth/register", { method: "POST", body: credentials });
export const logout = () => request("/auth/logout", { method: "POST" });
