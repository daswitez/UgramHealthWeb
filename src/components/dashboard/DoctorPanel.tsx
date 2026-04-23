"use client";

import React from "react";
import Link from "next/link";
import { Clock, AlertCircle, CheckCircle, DoorOpen, TestTube, CalendarDays, ChevronRight } from "lucide-react";
import styles from "./DoctorPanel.module.css";

const TODAY_APPOINTMENTS = [
  { time: "07:30", patient: "Carlos Ibáñez",      status: "done",    specialty: "Control de rutina" },
  { time: "08:00", patient: "Juan Pérez Gómez",   status: "active",  specialty: "Seguimiento asma", alerts: ["Alergia: Penicilina"] },
  { time: "08:30", patient: "Ana Torres Salinas",  status: "waiting", specialty: "Primera consulta" },
  { time: "09:00", patient: "Roberto Suárez",      status: "waiting", specialty: "Resultados de lab" },
  { time: "09:30", patient: "Carla Méndez",        status: "waiting", specialty: "Dolor abdominal" },
  { time: "10:00", patient: "Diego Roca",          status: "waiting", specialty: "Control crónico" },
];

const PENDING_LABS = [
  { patient: "Ana Torres Salinas", test: "Glucosa en Ayunas",  flag: "high",   ru: "221038472" },
  { patient: "Sofía Gutiérrez",    test: "Espirometría",       flag: "critical",ru: "221056789" },
];

const STATUS = {
  done:    { label: "Atendido",   color: "#64748B", bg: "#F8FAFC", dot: "#94A3B8" },
  active:  { label: "En Sala",    color: "#16A34A", bg: "#F0FDF4", dot: "#16A34A" },
  waiting: { label: "Esperando",  color: "#D97706", bg: "#FFFBEB", dot: "#D97706" },
};

const done    = TODAY_APPOINTMENTS.filter(a => a.status === "done").length;
const total   = TODAY_APPOINTMENTS.length;
const active  = TODAY_APPOINTMENTS.find(a => a.status === "active");
const waiting = TODAY_APPOINTMENTS.filter(a => a.status === "waiting");

export default function DoctorPanel() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className={styles.wrap}>

      {/* TOP: Greeting + quick stats */}
      <div className={styles.topBar}>
        <div>
          <h2 className={styles.greeting}>{greeting}, Dr. Peñaranda</h2>
          <p className={styles.greetingSub}>Hoy tienes <strong>{total} pacientes</strong>. Has atendido <strong>{done}</strong> de ellos.</p>
        </div>
        <div className={styles.quickStats}>
          <div className={styles.qStat}>
            <span className={styles.qStatVal} style={{ color: "var(--primary)" }}>{total - done}</span>
            <span className={styles.qStatLabel}>Por atender</span>
          </div>
          <div className={styles.qStat}>
            <span className={styles.qStatVal} style={{ color: "#D97706" }}>{waiting.length}</span>
            <span className={styles.qStatLabel}>En sala de espera</span>
          </div>
          <div className={styles.qStat}>
            <span className={styles.qStatVal} style={{ color: "#DC2626" }}>{PENDING_LABS.length}</span>
            <span className={styles.qStatLabel}>Labs con resultado</span>
          </div>
        </div>
      </div>

      <div className={styles.body}>

        {/* LEFT COL */}
        <div className={styles.leftCol}>

          {/* PACIENTE ACTIVO */}
          {active && (
            <div className={styles.activePill}>
              <div className={styles.activeHeader}>
                <div className={styles.activeDot} />
                <span className={styles.activeLabel}>Paciente en Sala Ahora</span>
                <span className={styles.activeTime}><Clock size={12} /> {active.time}</span>
              </div>
              <h2 className={styles.activeName}>{active.patient}</h2>
              <p className={styles.activeSub}>{active.specialty}</p>
              {active.alerts?.map(a => (
                <div key={a} className={styles.activeAlert}>
                  <AlertCircle size={14} color="#DC2626" />
                  <span>{a}</span>
                </div>
              ))}
              <Link href="/sala" style={{ textDecoration: "none" }}>
                <button className={styles.openSalaBtn}>
                  <DoorOpen size={16} /> Abrir Ficha Clínica
                </button>
              </Link>
            </div>
          )}

          {/* AGENDA DEL DÍA */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <CalendarDays size={16} color="#64748B" />
              <h2 className={styles.cardTitle}>Agenda de Hoy</h2>
              <Link href="/" className={styles.cardLink}>Ver calendario completo <ChevronRight size={14} /></Link>
            </div>
            <div className={styles.agendaList}>
              {TODAY_APPOINTMENTS.map((apt, i) => {
                const s = STATUS[apt.status as keyof typeof STATUS];
                return (
                  <div key={i} className={styles.agendaRow} style={{ opacity: apt.status === "done" ? 0.55 : 1 }}>
                    <span className={styles.agendaDot} style={{ backgroundColor: s.dot }} />
                    <span className={styles.agendaTime}>{apt.time}</span>
                    <div className={styles.agendaInfo}>
                      <span className={styles.agendaName}>{apt.patient}</span>
                      <span className={styles.agendaSub}>{apt.specialty}</span>
                    </div>
                    <span className={styles.agendaBadge} style={{ color: s.color, backgroundColor: s.bg }}>{s.label}</span>
                    {apt.status === "done" && <CheckCircle size={14} color="#94A3B8" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COL */}
        <div className={styles.rightCol}>

          {/* LAB RESULTS PENDING */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <TestTube size={16} color="#64748B" />
              <h2 className={styles.cardTitle}>Mis Órdenes con Resultado</h2>
              <Link href="/lab" className={styles.cardLink}>Ver todas <ChevronRight size={14} /></Link>
            </div>
            {PENDING_LABS.map((lab, i) => (
              <div key={i} className={`${styles.labRow} ${lab.flag === "critical" ? styles.labCritical : ""}`}>
                <div>
                  <p className={styles.labPatient}>{lab.patient}</p>
                  <p className={styles.labTest}>{lab.test}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={styles.labFlag} style={{ color: lab.flag === "critical" ? "#DC2626" : "#D97706" }}>
                    ● {lab.flag === "critical" ? "Crítico" : "Alto"}
                  </span>
                  <Link href="/lab">
                    <button className={styles.reviewBtn}>Revisar</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* PRÓXIMO PACIENTE */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Clock size={16} color="#64748B" />
              <h2 className={styles.cardTitle}>Próximo Paciente</h2>
            </div>
            {waiting[0] && (
              <div className={styles.nextPatient}>
                <div className={styles.nextAvatar}>{waiting[0].patient.split(" ").map(w => w[0]).slice(0,2).join("")}</div>
                <div>
                  <p className={styles.nextName}>{waiting[0].patient}</p>
                  <p className={styles.nextSub}>{waiting[0].specialty}</p>
                  <p className={styles.nextTime}><Clock size={11} /> Turno {waiting[0].time}</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
