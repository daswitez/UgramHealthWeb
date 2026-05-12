"use client";

import React from "react";
import Link from "next/link";
import { Users, CalendarDays, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "40px", maxWidth: "900px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "6px" }}>
        Panel Administrativo
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "15px" }}>
        Bienvenido. Desde aquí controlas el personal y el calendario institucional del sistema.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Gestión de Personal */}
        <Link href="/admin/iam" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "28px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: "12px", backgroundColor: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <Users size={24} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0" }}>Gestión de Personal</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              Da de alta a nuevos doctores, laboratoristas y personal administrativo. Consulta y administra el equipo activo.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: 600, fontSize: "14px" }}>
              Ir a IAM <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* Calendario Institucional */}
        <Link href="/admin/calendar/holidays" style={{ textDecoration: "none" }}>
          <div style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "28px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 48, height: 48, borderRadius: "12px", backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
              <CalendarDays size={24} color="#D97706" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0" }}>Calendario Institucional</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 20px 0", lineHeight: 1.5 }}>
              Define feriados totales y jornadas parciales que aplican a todos los médicos del sistema. Gestión visual por mes.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#D97706", fontWeight: 600, fontSize: "14px" }}>
              Ir al Calendario <ArrowRight size={16} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
