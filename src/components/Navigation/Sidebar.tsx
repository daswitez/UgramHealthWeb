"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarDays, ClipboardList, LayoutDashboard, TestTube, Users } from "lucide-react";
import { useAuth } from "../../store/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Mínimo Privilegio: Mostrar rutas solo correspondientes al rol
  let visibleRoutes = [];
  if (user?.role === "ADMIN") {
    visibleRoutes = [
      { label: "Panel Principal", icon: LayoutDashboard, href: "/admin/dashboard" },
      { label: "Gestión de Personal", icon: Users, href: "/admin/iam" },
      { label: "Feriados (Institucional)", icon: CalendarDays, href: "/admin/calendar/holidays" },
    ];
  } else {
    // Por defecto DOCTOR
    visibleRoutes = [
      { label: "Mi Panel",        icon: LayoutDashboard, href: "/dashboard" },
      { label: "Mi Agenda",       icon: CalendarDays,    href: "/" },
      { label: "Mis Pacientes",   icon: Users,           href: "/pacientes" },
      { label: "Ficha Clínica",   icon: ClipboardList,   href: "/ficha" },
      { label: "Mis Órdenes Lab", icon: TestTube,        href: "/lab" },
    ];
  }

  return (
    <aside style={{ width: "256px", height: "100vh", backgroundColor: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* LOGO */}
      <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "19px", marginBottom: "3px" }}>Ugram Health</h1>
        <p style={{ fontSize: "11px", color: "#94A3B8", margin: 0 }}>
          Portal {user?.role === "ADMIN" ? "Administrativo" : "Clínico · Médico"}
        </p>
      </div>


      {/* NAV */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "3px" }}>
          {visibleRoutes.map((route) => {
            const Icon = route.icon;
            const active = pathname === route.href || pathname.startsWith(route.href + "/");
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
