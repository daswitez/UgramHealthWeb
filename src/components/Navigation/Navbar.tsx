"use client";

import React from "react";
import { Search, Bell, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../store/AuthContext";

export default function Navbar() {
  const { logout, userRole } = useAuth();

  return (
    <header
      style={{
        height: "80px",
        backgroundColor: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
      }}
    >
      {/* SEARCH BAR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--background)",
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          width: "400px",
          gap: "12px"
        }}
      >
        <Search size={20} color="#64748B" />
        <input
          type="text"
          placeholder="Buscar estudiante por Registro o Nombre..."
          style={{
            border: "none",
            backgroundColor: "transparent",
            outline: "none",
            width: "100%",
            fontSize: "15px",
          }}
        />
      </div>

      {/* USER ACTIONS */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={24} color="#64748B" />
          <div style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 10,
            height: 10,
            backgroundColor: "var(--error)",
            borderRadius: "50%",
            border: "2px solid var(--background)"
          }} />
        </div>

        <div style={{ width: "1px", height: "30px", backgroundColor: "var(--border)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            backgroundColor: "var(--primary)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFF"
          }}>
            <UserRound size={20} />
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px" }}>Dr. Administrador</p>
            <p className="text-secondary" style={{ fontSize: "12px", textTransform: "capitalize" }}>{userRole}</p>
          </div>
        </div>

        <div style={{ cursor: "pointer", marginLeft: "16px" }} onClick={logout} title="Cerrar Sesión">
            <LogOut size={20} color="var(--error)" />
        </div>

      </div>
    </header>
  );
}
