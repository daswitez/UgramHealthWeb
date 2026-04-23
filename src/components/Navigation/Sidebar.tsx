"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, TestTube, Settings, ClipboardList } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const routes = [
    { label: "Agenda Total",      icon: CalendarDays,    href: "/" },
    { label: "Ficha Clínica EMR", icon: ClipboardList,   href: "/ficha" },
    { label: "Dashboard FUSUM",   icon: LayoutDashboard, href: "/dashboard" },
    { label: "Laboratorio",        icon: TestTube,        href: "/lab" },
    { label: "Configuraciones",    icon: Settings,        href: "/settings" },
  ];

  return (
    <aside
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* LOGO */}
      <div style={{ padding: "32px 24px" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "24px" }}>Ugram Health</h1>
        <p className="text-secondary" style={{ fontSize: "12px", marginTop: "4px" }}>
          Portal Electrónico (EMR)
        </p>
      </div>

      {/* NAVIGATION */}
      <nav style={{ flex: 1, padding: "0 16px" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          {routes.map((route, i) => {
            const Icon = route.icon;
            const active = pathname === route.href;
            return (
              <li key={i}>
                <Link href={route.href} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: "16px",
                      padding: "16px", borderRadius: "12px", cursor: "pointer",
                      backgroundColor: active ? "var(--primary-light)" : "transparent",
                      color: active ? "var(--primary)" : "var(--foreground)",
                      fontWeight: active ? 600 : 500, transition: "all 0.2s ease",
                      border: active ? "1px solid #BFDBFE" : "1px solid transparent"
                    }}
                  >
                    <Icon size={20} color={active ? "var(--primary)" : "#64748B"} />
                    {route.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* FOOTER */}
      <div style={{ padding: "24px", borderTop: "1px solid var(--border)" }}>
        <p className="text-secondary" style={{ fontSize: "12px" }}>UAGRM © 2026 Seguros</p>
      </div>
    </aside>
  );
}
