"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronRight, AlertCircle, Clock, CheckCircle, CalendarDays } from "lucide-react";
import Link from "next/link";
import styles from "./PatientsView.module.css";

type PatientStatus = "active" | "waiting" | "done" | "chronic";

interface Patient {
  id: string;
  name: string;
  ru: string;
  career: string;
  lastVisit: string;
  nextVisit?: string;
  status: PatientStatus;
  reason: string;
  alerts: string[];
  visitsCount: number;
}

const PATIENTS: Patient[] = [
  { id: "p1", name: "Juan Pérez Gómez",     ru: "220019283", career: "Ing. Informática",   lastVisit: "Hoy 08:00",      status: "active",  reason: "Seguimiento asma",           alerts: ["Alergia: Penicilina", "Asma Bronquial"], visitsCount: 4 },
  { id: "p2", name: "Ana Torres Salinas",   ru: "221038472", career: "Derecho",             lastVisit: "Hoy 08:30",      status: "waiting", reason: "Primera consulta",           alerts: [],                                       visitsCount: 1 },
  { id: "p3", name: "Roberto Suárez",       ru: "220087341", career: "Medicina",            lastVisit: "22 Abr",         nextVisit: "Hoy 09:00", status: "waiting", reason: "Resultados de lab", alerts: [],                  visitsCount: 3 },
  { id: "p4", name: "Carla Méndez Ríos",   ru: "222045678", career: "Arquitectura",        lastVisit: "20 Abr",         nextVisit: "Hoy 09:30", status: "waiting", reason: "Dolor abdominal",   alerts: ["Alergia: Ibuprofeno"], visitsCount: 2 },
  { id: "p5", name: "Diego Roca Parada",   ru: "220091234", career: "Ing. Civil",          lastVisit: "18 Abr",         nextVisit: "Hoy 10:00", status: "waiting", reason: "Control crónico",   alerts: ["Diabetes Tipo 2"],     visitsCount: 7 },
  { id: "p6", name: "Sofía Gutiérrez",     ru: "221056789", career: "Bioquímica",          lastVisit: "15 Abr",         status: "chronic", reason: "Seguimiento asma severa",    alerts: ["Asma Severa — FEV1 58%"],               visitsCount: 9 },
  { id: "p7", name: "Carlos Ibáñez",       ru: "219034821", career: "Administración",      lastVisit: "Hoy 07:30",      status: "done",    reason: "Control de rutina",          alerts: [],                                       visitsCount: 2 },
  { id: "p8", name: "Marcos León",         ru: "223012345", career: "Comunicación",        lastVisit: "10 Abr",         status: "done",    reason: "Gripe estacional",           alerts: [],                                       visitsCount: 1 },
  { id: "p9", name: "Patricia Soto",       ru: "220078901", career: "Psicología",          lastVisit: "08 Abr",         status: "chronic", reason: "Rinitis alérgica crónica",   alerts: ["Rinitis Crónica"],                      visitsCount: 5 },
  { id: "p10",name: "Luis Vaca Torrico",   ru: "219034821", career: "Ing. Electrónica",    lastVisit: "05 Abr",         status: "done",    reason: "Perfil lipídico elevado",    alerts: ["Colesterol Alto"],                      visitsCount: 3 },
];

const STATUS_CFG: Record<PatientStatus, { label: string; color: string; bg: string; border: string }> = {
  active:  { label: "En Sala",    color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC" },
  waiting: { label: "En Espera",  color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  done:    { label: "Atendido",   color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
  chronic: { label: "Crónico",    color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD" },
};

const FILTERS: { label: string; value: PatientStatus | "all" }[] = [
  { label: "Todos",       value: "all"     },
  { label: "En Sala",     value: "active"  },
  { label: "En Espera",   value: "waiting" },
  { label: "Crónicos",    value: "chronic" },
  { label: "Atendidos",   value: "done"    },
];

export default function PatientsView() {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<PatientStatus | "all">("all");

  const filtered = PATIENTS.filter(p => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ru.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = {
    all:     PATIENTS.length,
    active:  PATIENTS.filter(p => p.status === "active").length,
    waiting: PATIENTS.filter(p => p.status === "waiting").length,
    chronic: PATIENTS.filter(p => p.status === "chronic").length,
    done:    PATIENTS.filter(p => p.status === "done").length,
  };

  return (
    <div className={styles.wrap}>

      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h2>Mis Pacientes</h2>
          <p className={styles.subtitle}>{PATIENTS.length} pacientes bajo tu gestión · {new Date().toLocaleDateString("es-BO", { dateStyle: "long" })}</p>
        </div>
        <div className={styles.headerStats}>
          <span className={styles.hStat} style={{ color: "#16A34A" }}>
            <span className={styles.hStatDot} style={{ background: "#16A34A" }} />
            {counts.active} en sala
          </span>
          <span className={styles.hStat} style={{ color: "#D97706" }}>
            <span className={styles.hStatDot} style={{ background: "#D97706" }} />
            {counts.waiting} esperando
          </span>
          <span className={styles.hStat} style={{ color: "#7C3AED" }}>
            <span className={styles.hStatDot} style={{ background: "#7C3AED" }} />
            {counts.chronic} crónicos
          </span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} color="#94A3B8" />
          <input
            placeholder="Buscar por nombre o Registro Universitario..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterGroup}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`${styles.filterPill} ${filter === f.value ? styles.filterPillActive : ""}`}
            >
              {f.label}
              <span className={styles.filterCount}>{counts[f.value]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PATIENT LIST */}
      <div className={styles.listWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p style={{ fontSize: 32 }}>🔍</p>
            <h2>Sin resultados</h2>
            <p className={styles.emptySub}>No se encontraron pacientes con ese criterio.</p>
          </div>
        ) : (
          filtered.map(p => {
            const cfg = STATUS_CFG[p.status];
            return (
              <Link key={p.id} href="/ficha" style={{ textDecoration: "none" }}>
                <div className={`${styles.patientRow} ${p.status === "active" ? styles.rowActive : ""}`}>

                  {/* Avatar */}
                  <div className={styles.avatar}>
                    {p.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                  </div>

                  {/* Main Info */}
                  <div className={styles.mainInfo}>
                    <div className={styles.nameRow}>
                      <span className={styles.name}>{p.name}</span>
                      {p.alerts.length > 0 && (
                        <span className={styles.alertBadge}>
                          <AlertCircle size={12} color="#DC2626" /> {p.alerts.length} alerta{p.alerts.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <span className={styles.meta}>RU: {p.ru} · {p.career}</span>
                    {p.alerts.length > 0 && (
                      <div className={styles.alertsList}>
                        {p.alerts.slice(0,2).map(a => (
                          <span key={a} className={styles.alertTag}>{a}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reason */}
                  <div className={styles.reason}>
                    <span className={styles.reasonLabel}>Motivo</span>
                    <span className={styles.reasonValue}>{p.reason}</span>
                  </div>

                  {/* Visits */}
                  <div className={styles.visits}>
                    <CalendarDays size={13} color="#94A3B8" />
                    <span className={styles.visitsVal}>{p.visitsCount} consultas</span>
                    <span className={styles.lastVisit}>Última: {p.lastVisit}</span>
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span className={styles.statusBadge} style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
                      {p.status === "active" && <span className={styles.pulseDot} />}
                      {cfg.label}
                    </span>
                  </div>

                  <ChevronRight size={18} color="#CBD5E1" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
