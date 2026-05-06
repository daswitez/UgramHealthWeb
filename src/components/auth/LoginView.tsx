"use client";

import React, { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { User, Shield } from "lucide-react";

export default function LoginView() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isStaff, setIsStaff] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier, password, isStaff);
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
          <h2 style={{ marginBottom: "16px" }}>Portal de Salud</h2>
          <p className="text-secondary" style={{ lineHeight: 1.6 }}>
            Acceso a tu portal de salud estudiantil o plataforma clínica restringida para personal autorizado de la red FUSUM.
          </p>
        </div>
      </div>

      {/* LOGIN FORM RIGHT SIDE */}
      <div
        style={{
          flex: 1,
          backgroundColor: "var(--background)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "24px", display: "flex", gap: "12px", width: "100%", maxWidth: "460px" }}>
           <button 
             type="button"
             onClick={() => setIsStaff(false)}
             style={{
               flex: 1,
               display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
               padding: "12px", borderRadius: "12px", border: "1px solid var(--border)",
               backgroundColor: !isStaff ? "var(--primary)" : "var(--surface)",
               color: !isStaff ? "#fff" : "var(--text-secondary)",
               cursor: "pointer", fontWeight: 600, transition: "all 0.2s ease"
             }}
           >
             <User size={18} /> Paciente
           </button>
           <button 
             type="button"
             onClick={() => setIsStaff(true)}
             style={{
               flex: 1,
               display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
               padding: "12px", borderRadius: "12px", border: "1px solid var(--border)",
               backgroundColor: isStaff ? "var(--primary)" : "var(--surface)",
               color: isStaff ? "#fff" : "var(--text-secondary)",
               cursor: "pointer", fontWeight: 600, transition: "all 0.2s ease"
             }}
           >
             <Shield size={18} /> Personal
           </button>
        </div>

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
          <h2 style={{ marginBottom: "8px" }}>Iniciar Sesión</h2>
          <p className="text-secondary" style={{ marginBottom: "32px", fontSize: "14px" }}>
            {isStaff 
              ? "Ingresa usando tu correo y contraseña institucional asignada." 
              : "Ingresa usando tu Carnet de Identidad (C.I.) y contraseña."}
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-secondary)" }}>
                {isStaff ? "Correo Institucional" : "Carnet de Identidad (C.I.)"}
              </label>
              <input
                type="text"
                placeholder={isStaff ? "ej. admin@uagrm.edu.bo" : "ej. 12345678"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
                Contraseña
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
              Ingresar a la Plataforma
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
