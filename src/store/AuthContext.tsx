"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  doctor: { name: string; specialty: string; initials: string } | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [doctor, setDoctor]   = useState<AuthContextType["doctor"]>(null);

  const login = (email: string, pass: string) => {
    if (email === "admin" && pass === "ugram") {
      setIsAuthenticated(true);
      setDoctor({ name: "Dr. Medardo Peñaranda", specialty: "Medicina General", initials: "MP" });
    } else {
      alert("Credenciales institucionales inválidas.");
    }
  };

  const logout = () => { setIsAuthenticated(false); setDoctor(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, doctor, login, logout }}>
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
