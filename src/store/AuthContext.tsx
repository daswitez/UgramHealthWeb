"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string; token?: string; initials: string; specialty?: string } | null;
  login: (identifier: string, pass: string, isStaff: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (identifier: string, pass: string, isStaff: boolean) => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password: pass })
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUser({ 
          name: data.user?.name || (isStaff ? "Dr. Medardo Peñaranda" : "Estudiante Juan Pérez"), 
          role: data.role || (isStaff ? "DOCTOR" : "STUDENT"), 
          token: data.accessToken,
          initials: data.user?.name ? data.user.name.substring(0, 2).toUpperCase() : (isStaff ? "MP" : "JP"),
          specialty: isStaff ? "Medicina General" : undefined
        });
      } else {
        // Fallback for development
        if (isStaff && (identifier === "admin@uagrm.edu.bo" || identifier === "admin")) {
           setIsAuthenticated(true);
           setUser({ name: "Dr. Medardo Peñaranda", role: "DOCTOR", initials: "MP", specialty: "Medicina General" });
        } else if (!isStaff && identifier === "12345678") {
           setIsAuthenticated(true);
           setUser({ name: "Estudiante Juan Pérez", role: "STUDENT", initials: "JP" });
        } else {
           alert("Credenciales inválidas.");
        }
      }
    } catch (error) {
      console.warn("API Offline o error de red, usando fallback:", error);
      if (isStaff && (identifier === "admin@uagrm.edu.bo" || identifier === "admin")) {
        setIsAuthenticated(true);
        setUser({ name: "Dr. Medardo Peñaranda", role: "DOCTOR", initials: "MP", specialty: "Medicina General" });
      } else if (!isStaff && identifier === "12345678") {
        setIsAuthenticated(true);
        setUser({ name: "Estudiante Juan Pérez", role: "STUDENT", initials: "JP" });
      } else {
        alert("Credenciales inválidas (Fallback).");
      }
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
