import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("token");
      if (!token) return;
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data.token;
    localStorage.setItem("token", token);
    setUser({ email } as User);
    localStorage.setItem("user", JSON.stringify({ email }));
  }

  async function register(name: string, email: string, password: string) {
    await api.post("/auth/register", { name, email, password });
    // auto-login after register
    await login(email, password);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
