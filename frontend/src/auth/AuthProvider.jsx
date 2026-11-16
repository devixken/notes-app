import { useEffect, useState } from "react";
import * as authApi from "../api/auth.js";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // The token lives in an httpOnly cookie that JS cannot read, so ask the server who we are
  useEffect(() => {
    authApi
      .getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    setUser(await authApi.login(credentials));
  }

  async function register(credentials) {
    await authApi.register(credentials);
    await login(credentials);
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  return (
    <AuthContext value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext>
  );
}
