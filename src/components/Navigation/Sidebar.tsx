"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardList, LayoutDashboard, TestTube, Users } from "lucide-react";
import { useAuth } from "../../store/AuthContext";

const routes = [
  { label: "Mi Panel",        icon: LayoutDashboard, href: "/dashboard" },
  { label: "Mi Agenda",       icon: CalendarDays,    href: "/" },
  { label: "Mis Pacientes",   icon: Users,           href: "/pacientes" },
  { label: "Ficha Clínica",   icon: ClipboardList,   href: "/ficha" },
  { label: "Mis Órdenes Lab", icon: TestTube,        href: "/lab" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { doctor } = useAuth();

  return (
    <aside style={{ width: "256px", height: "100vh", backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* LOGO */}
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "19px", marginBottom: "3px" }}>Ugram Health</h1>
        <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>Portal Clínico · Médico</p>
      </div>

      {/* DOCTOR CHIP */}
      {doctor && (
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {doctor.initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doctor.name}</p>
            <p style={{ fontSize: 11, color: "#64748B", margin: 0 }}>{doctor.specialty}</p>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
          {routes.map((route) => {
            const Icon = route.icon;
            const active = pathname === route.href;
            return (
              <li key={route.href}>
                <Link href={route.href} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "12px 14px", borderRadius: "11px", cursor: "pointer",
                    backgroundColor: active ? "var(--primary-light)" : "transparent",
                    color: active ? "var(--primary)" : "#475569",
                    fontWeight: active ? 700 : 500,
                    transition: "all 0.15s ease",
                    border: active ? "1px solid #BFDBFE" : "1px solid transparent",
                    fontSize: 14,
                  }}>
                    <Icon size={17} color={active ? "var(--primary)" : "#94A3B8"} />
                    {route.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 11, color: "#CBD5E1", margin: 0 }}>UAGRM FUSUM © 2026</p>
      </div>
    </aside>
  );
}
