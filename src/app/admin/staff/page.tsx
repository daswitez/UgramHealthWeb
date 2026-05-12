"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { getStaffList, StaffUser } from "@/services/staff";
import Link from "next/link";
import { Plus, Search, UserCheck, UserX, Stethoscope, FlaskConical, Shield, User } from "lucide-react";

const ROLE_LABELS: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  ADMIN:       { label: "Admin",        color: "#1D4ED8", bg: "#DBEAFE", icon: <Shield size={13} /> },
  DOCTOR:      { label: "Doctor",       color: "#065F46", bg: "#D1FAE5", icon: <Stethoscope size={13} /> },
  LAB_TECH:    { label: "Laboratorista",color: "#6B21A8", bg: "#F3E8FF", icon: <FlaskConical size={13} /> },
  RECEPTIONIST:{ label: "Recepcionista",color: "#92400E", bg: "#FEF3C7", icon: <User size={13} /> },
};

export default function StaffListPage() {
  const { user } = useAuth();
  const [staff, setStaff]     = useState<StaffUser[]>([]);
  const [filtered, setFiltered] = useState<StaffUser[]>([]);
  const [loading, setLoading]  = useState(true);
  const [query, setQuery]      = useState("");

  useEffect(() => {
    if (!user?.token) return;
    getStaffList(user.token)
      .then(res => { setStaff(res.data ?? []); setFiltered(res.data ?? []); })
      .catch(err => console.warn("[Staff] Error:", err))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(
      staff.filter(s =>
        s.fullName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.userType.toLowerCase().includes(q) ||
        (s.specialty || "").toLowerCase().includes(q)
      )
    );
  }, [query, staff]);

  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0" }}>Personal Médico y Administrativo</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            {staff.length} cuenta{staff.length !== 1 ? "s" : ""} registrada{staff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/admin/staff/new" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--primary)", color: "white", padding: "12px 20px", borderRadius: "10px", border: "none", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}>
            <Plus size={18} /> Dar de Alta
          </button>
        </Link>
      </div>

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 16px", marginBottom: "24px" }}>
        <Search size={18} color="#94A3B8" />
        <input
          type="text"
          placeholder="Buscar por nombre, correo, rol o especialidad..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ border: "none", background: "transparent", outline: "none", fontSize: "14px", color: "var(--foreground)", width: "100%" }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Cargando personal...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: "var(--text-secondary)" }}>No hay resultados para "{query}"</p>
      ) : (
        <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1fr 80px", padding: "14px 24px", borderBottom: "1px solid var(--border)", backgroundColor: "var(--background)" }}>
            {["Nombre", "Correo", "Rol", "Especialidad", "Estado"].map(h => (
              <span key={h} style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((s, idx) => {
            const role = ROLE_LABELS[s.userType] ?? { label: s.userType, color: "#475569", bg: "#F1F5F9", icon: <User size={13} /> };
            return (
              <Link key={s.id} href={`/admin/staff/${s.id}`} style={{ textDecoration: "none" }}>
                <div
                  style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.2fr 1fr 80px", padding: "16px 24px", borderBottom: idx < filtered.length - 1 ? "1px solid var(--border)" : "none", transition: "background-color 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--primary-light)"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 2px 0", color: "var(--foreground)" }}>{s.fullName}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>C.I. {s.ci}</p>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "auto 0" }}>{s.email}</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "99px", backgroundColor: role.bg, color: role.color }}>
                      {role.icon} {role.label}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "auto 0" }}>{s.specialty || "—"}</p>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {s.active
                      ? <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#065F46", fontWeight: 600 }}><UserCheck size={14} /> Activo</span>
                      : <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#991B1B", fontWeight: 600 }}><UserX size={14} /> Inactivo</span>
                    }
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
