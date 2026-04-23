"use client";

import React from "react";
import { useAuth } from "../../store/AuthContext";
import LoginView from "../auth/LoginView";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function RootGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Bloqueo Administrativo (SSO/Login)
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Layout Maestro Administrativo
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
