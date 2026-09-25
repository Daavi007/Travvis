"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

const SESSION = "travvis-admin";

export type AdminSession = { user: string; password: string };

type AdminAuthValue = {
  session: AdminSession | null;
  ready: boolean;
  login: (user: string, password: string) => Promise<boolean>;
  logout: () => void;
  authHeaders: () => Record<string, string>;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION);
      if (raw) setSession(JSON.parse(raw) as AdminSession);
    } catch {
      sessionStorage.removeItem(SESSION);
    }
    setReady(true);
  }, []);

  async function login(user: string, password: string) {
    const response = await fetch(apiUrl("/api/products?login=1"), {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-admin-user": user.trim(),
        "x-admin-password": password,
      },
    });
    if (!response.ok) return false;
    const next = { user: user.trim(), password };
    sessionStorage.setItem(SESSION, JSON.stringify(next));
    setSession(next);
    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION);
    setSession(null);
  }

  function authHeaders() {
    return {
      "content-type": "application/json",
      "x-admin-user": session?.user || "",
      "x-admin-password": session?.password || "",
    };
  }

  return <AdminAuthContext.Provider value={{ session, ready, login, logout, authHeaders }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth fora do provider");
  return value;
}
