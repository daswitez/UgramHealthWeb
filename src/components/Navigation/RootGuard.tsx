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

    // RBAC Routing Guard (Principio de Mínimo Privilegio)
    if (role === "STUDENT") {
      if (!pathname.startsWith("/patient")) {
        router.replace("/patient/dashboard");
      }
    } else if (role === "ADMIN") {
      if (!pathname.startsWith("/admin")) {
        router.replace("/admin/iam");
      }
    } else if (role === "DOCTOR") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/patient")) {
        router.replace("/");
      }
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
