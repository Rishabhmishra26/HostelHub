"use client";

/**
 * AuthContext.tsx
 * --------------------------------------------------------------
 * Makes the logged-in user's basic info (name, role, email)
 * available to any component via `useAuth()`, without prop
 * drilling it through every page.
 *
 * On mount it calls GET /api/auth/me, which reads the httpOnly
 * "accessToken" cookie on the server and returns the user - the
 * frontend never touches the raw JWT directly, which is safer
 * (httpOnly cookies can't be read by JavaScript / XSS attacks).
 * --------------------------------------------------------------
 */
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
