"use client";

import React from "react";
import { Users, CalendarCheck, TestTube, AlertCircle, TrendingUp, Activity, Clock, CheckCircle } from "lucide-react";
import styles from "./FusumDashboard.module.css";

const STAT_CARDS = [
  { label: "Pacientes Hoy",        value: "24",  sub: "+3 walk-ins",          icon: Users,         color: "#2563EB", bg: "#EFF6FF" },
  { label: "Citas Confirmadas",     value: "18",  sub: "6 pendientes de sala", icon: CalendarCheck, color: "#16A34A", bg: "#F0FDF4" },
  { label: "Exámenes Pendientes",   value: "7",   sub: "2 resultados críticos",icon: TestTube,      color: "#D97706", bg: "#FFFBEB" },
  { label: "Urgencias / Walk-ins",  value: "3",   sub: "Esta mañana",          icon: AlertCircle,   color: "#DC2626", bg: "#FEF2F2" },
];

const SPECIALTIES = [
  { name: "Medicina General", pct: 72, count: 312, color: "#2563EB" },
  { name: "Odontología",      pct: 55, count: 241, color: "#0EA5A4" },
  { name: "Psicología",       pct: 38, count: 165, color: "#8B5CF6" },
  { name: "Nutrición",        pct: 22, count: 97,  color: "#F59E0B" },
  { name: "Imagenología",     pct: 14, count: 63,  color: "#EC4899" },
];

const RECENT_ACTIVITY = [
  { time: "10:32", action: "Ficha cerrada",            patient: "Juan Pérez Gómez",   type: "success" },
  { time: "10:15", action: "Resultado de lab aprobado",patient: "Ana Torres Salinas",  type: "success" },
  { time: "09:58", action: "Walk-in registrado",       patient: "Diego Roca Parada",   type: "warning" },
  { time: "09:41", action: "Resultado crítico recibido",patient: "María Calderón",      type: "error"   },
  { time: "09:20", action: "Cita confirmada",          patient: "Sofía Gutiérrez",     type: "success" },
  { time: "08:55", action: "Orden de lab emitida",     patient: "Roberto Suárez",      type: "info"    },
];

const ALERT_TYPE_COLOR: Record<string, string> = {
  success: "#16A34A",
  warning: "#D97706",
  error:   "#DC2626",
  info:    "#2563EB",
};

const WEEKLY = [
  { day: "Lun", citas: 22, exams: 8  },
  { day: "Mar", citas: 31, exams: 14 },
  { day: "Mié", citas: 28, exams: 11 },
  { day: "Jue", citas: 19, exams: 6  },
  { day: "Vie", citas: 24, exams: 7  },
];
const MAX_CITAS = Math.max(...WEEKLY.map(w => w.citas));

export default function FusumDashboard() {
  return (
    <div className={styles.wrap}>

      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h2>Dashboard FUSUM</h2>
          <p className={styles.subtitle}>Analítica Clínica · Sede Central · {new Date().toLocaleDateString("es-BO", { dateStyle: "long" })}</p>
        </div>
        <div className={styles.headerBadge}>
          <Activity size={14} color="#16A34A" />
          <span>Sistema Operativo</span>
        </div>
      </div>

      <div className={styles.body}>

        {/* STAT CARDS */}
        <div className={styles.statsGrid}>
          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: s.bg }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div className={styles.statInfo}>
                  <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                  <p className={styles.statSub}>{s.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.middleRow}>

          {/* BAR CHART: Weekly */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Citas por Día (Esta Semana)</h2>
              <TrendingUp size={18} color="#64748B" />
            </div>
            <div className={styles.barChart}>
              {WEEKLY.map(w => (
                <div key={w.day} className={styles.barGroup}>
                  <div className={styles.barStack}>
                    <span className={styles.barVal}>{w.citas}</span>
                    <div
                      className={styles.bar}
                      style={{ height: `${(w.citas / MAX_CITAS) * 140}px`, backgroundColor: "var(--primary)" }}
                    />
                    <div
                      className={styles.bar}
                      style={{ height: `${(w.exams / MAX_CITAS) * 140}px`, backgroundColor: "#0EA5A4", opacity: 0.7 }}
                    />
                  </div>
                  <span className={styles.barLabel}>{w.day}</span>
                </div>
              ))}
            </div>
            <div className={styles.legend}>
              <span className={styles.legendItem}><span style={{background:"var(--primary)"}} className={styles.legendDot}/>Citas</span>
              <span className={styles.legendItem}><span style={{background:"#0EA5A4"}} className={styles.legendDot}/>Exámenes</span>
            </div>
          </div>

          {/* SPECIALTIES */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Demanda por Especialidad</h2>
              <span className={styles.cardSub}>Semestre actual</span>
            </div>
            <div className={styles.specialtyList}>
              {SPECIALTIES.map(s => (
                <div key={s.name} className={styles.specialtyRow}>
                  <div className={styles.specMeta}>
                    <span className={styles.specName}>{s.name}</span>
                    <span className={styles.specCount}>{s.count} consultas</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                  </div>
                  <span className={styles.specPct}>{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Actividad Reciente</h2>
            <Clock size={16} color="#64748B" />
          </div>
          <div className={styles.activityList}>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className={styles.activityRow}>
                <div className={styles.activityDot} style={{ backgroundColor: ALERT_TYPE_COLOR[a.type] }} />
                <span className={styles.activityTime}>{a.time}</span>
                <span className={styles.activityAction}>{a.action}</span>
                <span className={styles.activityPatient}>{a.patient}</span>
                {a.type === "success" && <CheckCircle size={14} color="#16A34A" />}
                {a.type === "error"   && <AlertCircle size={14} color="#DC2626" />}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
