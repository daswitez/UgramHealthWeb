"use client";

import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* BRANDING LEFT SIDE */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--background)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid var(--border)",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "400px", padding: "40px" }}>
          <h1 style={{ color: "var(--primary)", fontSize: "42px", marginBottom: "16px" }}>Ugram Health</h1>
          <h2 style={{ marginBottom: "16px" }}>Portal Clínico Restringido</h2>
          <p className="text-secondary" style={{ lineHeight: 1.6 }}>
            Acceso exclusivo al sistema Electronic Medical Record (EMR) e integraciones Kanban para administrativos de la red FUSUM.
          </p>
        </div>
      </div>

      {/* LOGIN FORM RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--background)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--surface)",
            padding: "48px",
            borderRadius: "24px",
            border: "1px solid var(--border)",
            width: "100%",
            maxWidth: "460px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ marginBottom: "8px" }}>Identificación SSO</h2>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            Ingresa usando el correo y contraseña institucional asignada por decanatura. (Hint: admin / ugram)
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-secondary)" }}>
                Correo Institucional
              </label>
              <input
                type="text"
                placeholder="ej. medardo.p@uagrm.edu.bo"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-secondary)" }}>
                Contraseña Administrativa
              </label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  fontSize: "16px",
                  outline: "none",
                }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: "16px" }}>
              Ingresar a Base de Datos
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
