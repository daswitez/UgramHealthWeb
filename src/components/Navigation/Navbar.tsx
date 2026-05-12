"use client";

import React from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <header style={{
      height: "72px", backgroundColor: "var(--surface)",
      borderBottom: "1px solid var(--border)", display: "flex",
      alignItems: "center", justifyContent: "space-between", padding: "0 32px",
    }}>
      {/* SEARCH */}
      <div style={{
        display: "flex", alignItems: "center", backgroundColor: "var(--background)",
        padding: "10px 18px", borderRadius: "12px", border: "1px solid var(--border)",
        width: "360px", gap: "10px"
      }}>
        <Search size={18} color="#94A3B8" />
        <input type="text" placeholder="Buscar paciente por nombre o RU..."
          style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "var(--foreground)" }}
        />
      </div>

      {/* RIGHT SIDE */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>

        {/* Specialty badge */}
        {user && user.specialty && (
          <div style={{ padding: "6px 14px", background: "var(--primary-light)", border: "1px solid #BFDBFE", borderRadius: "999px", fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
            {user.specialty}
          </div>
        )}

        {/* Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Bell size={22} color="#64748B" />
          <div style={{ position: "absolute", top: -2, right: -2, width: 9, height: 9, backgroundColor: "var(--error)", borderRadius: "50%", border: "2px solid var(--surface)" }} />
        </div>

        <div style={{ width: "1px", height: "28px", backgroundColor: "var(--border)" }} />

        {/* Avatar + name — clickable for DOCTOR */}
        {user && (
          <div 
            onClick={() => { if (user.role === "DOCTOR") router.push("/doctor/profile"); }}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: user.role === "DOCTOR" ? "pointer" : "default", borderRadius: "8px", padding: "4px 8px", transition: "background-color 0.15s ease" }}
            onMouseEnter={(e) => { if (user.role === "DOCTOR") e.currentTarget.style.backgroundColor = "var(--primary-light)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
              {user.initials}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{user.name}</p>
              <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>En turno</p>
            </div>
          </div>
        )}

        <div style={{ cursor: "pointer" }} onClick={logout} title="Cerrar Sesión">
          <LogOut size={18} color="var(--error)" />
        </div>
      </div>
    </header>
  );
}
