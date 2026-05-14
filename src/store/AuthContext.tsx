"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string; token?: string; refreshToken?: string; initials: string; specialty?: string } | null;
  login: (identifier: string, pass: string, isStaff: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (identifier: string, pass: string, isStaff: boolean) => {
    const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

    try {
      const response = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass })
      });

      if (response.ok) {
        const envelope = await response.json();
        const d = envelope.data || envelope;

        const token    = d.accessToken;
        const refresh  = d.refreshToken;

        // userType viene directo del login (ya implementado en backend)
        // El objeto "user" dentro de data también existe como fallback
        const u = d.user || {};
        const rawRole  = d.userType || u.userType || "";
        const first    = d.firstName || u.firstName || "";
        const last     = d.lastName  || u.lastName  || "";
        const specialty = d.specialty || "";

        // Normalizar: "ROLE_ADMIN" → "ADMIN", "admin" → "ADMIN"
        const role = rawRole.replace(/^ROLE_/i, "").toUpperCase() || (isStaff ? "STAFF" : "STUDENT");

        console.log("[Auth] Login OK →", { role, first, last });

        setIsAuthenticated(true);
        setUser({
          name:         `${first} ${last}`.trim() || role,
          role,
          token,
          refreshToken: refresh,
          initials:     ((first[0] || "") + (last[0] || "")).toUpperCase() || role.substring(0, 2),
          specialty:    specialty || undefined,
        });
      } else {
        const errText = await response.text().catch(() => "");
        console.warn("[Auth] Login failed:", response.status, errText);
        alert("Credenciales inválidas.");
      }
    } catch (error) {
      console.warn("[Auth] API Offline:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const logout = () => { setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro de un AuthProvider");
  }
  return context;
};
