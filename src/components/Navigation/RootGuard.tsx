"use client";

import React, { useEffect } from "react";
import { useAuth } from "../../store/AuthContext";
import LoginView from "../auth/LoginView";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { usePathname, useRouter } from "next/navigation";

export default function RootGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const role = user.role;

    // Rutas de inicio por rol (landing pages)
    const HOMES: Record<string, string> = {
      ADMIN:    "/admin/dashboard",
      DOCTOR:   "/dashboard",
      STUDENT:  "/patient/dashboard",
      LAB_TECH: "/dashboard",
    };

    // Prefijos de rutas permitidas por rol (principio de mínimo privilegio)
    const ALLOWED_PREFIXES: Record<string, string[]> = {
      ADMIN:   ["/admin"],
      DOCTOR:  ["/doctor", "/dashboard", "/pacientes", "/ficha", "/lab", "/sala"],
      STUDENT: ["/patient"],
    };

    const home    = HOMES[role] ?? "/";
    const allowed = ALLOWED_PREFIXES[role] ?? [];

    const isAllowed = allowed.some(prefix => pathname.startsWith(prefix));
    const isRoot    = pathname === "/";

    if (isRoot || !isAllowed) {
      router.replace(home);
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated || !user) {
    return <LoginView />;
  }

  // Layout Paciente (Sin Sidebar complejo, UI más amigable)
  if (user.role === "STUDENT") {
    return (
      <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "var(--background)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main style={{ flex: 1, overflowY: "auto", position: "relative", padding: "40px" }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Layout Maestro Administrativo (Doctor y Admin)
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
