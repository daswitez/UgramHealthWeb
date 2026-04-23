"use client";

import React, { useState } from "react";
import { Clock, User, Stethoscope, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./KanbanCalendar.module.css";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const HOURS = ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

const FILTERS = ["Todas las Citas", "Solo Urgencias", "Medicina General", "Odontología", "Psicología"];

type AppointmentStatus = "confirmed" | "waiting" | "urgent" | "completed";

interface Appointment {
  id: string;
  patient: string;
  specialty: string;
  time: string;
  day: number;
  status: AppointmentStatus;
  note?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "1", patient: "Juan Pérez Gómez", specialty: "Medicina General", time: "08:00", day: 0, status: "confirmed" },
  { id: "2", patient: "María Calderón", specialty: "Odontología", time: "09:00", day: 0, status: "waiting" },
  { id: "3", patient: "Roberto Suárez", specialty: "Psicología", time: "10:30", day: 1, status: "confirmed" },
  { id: "4", patient: "Ana Torres", specialty: "Medicina General", time: "08:30", day: 2, status: "urgent", note: "Alergia: Penicilina" },
  { id: "5", patient: "Luis Vaca", specialty: "Odontología", time: "11:00", day: 2, status: "completed" },
  { id: "6", patient: "Carla Méndez", specialty: "Medicina General", time: "14:00", day: 3, status: "confirmed" },
  { id: "7", patient: "Diego Roca", specialty: "Psicología", time: "09:30", day: 4, status: "waiting" },
  { id: "8", patient: "Sofía Gutiérrez", specialty: "Medicina General", time: "15:00", day: 4, status: "urgent", note: "Asmática crónica" },
];

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string; border: string }> = {
  confirmed:  { label: "Confirmada",  color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC" },
  waiting:    { label: "En sala",     color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  urgent:     { label: "Urgencia",    color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5" },
  completed:  { label: "Atendida",    color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
};

export default function KanbanCalendar() {
  const [activeFilter, setActiveFilter] = useState("Todas las Citas");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7));
    return DAYS.map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toLocaleDateString("es-BO", { day: "numeric", month: "short" });
    });
  };

  const weekDates = getWeekDates();

  const filtered = MOCK_APPOINTMENTS.filter(apt => {
    if (activeFilter === "Todas las Citas") return true;
    if (activeFilter === "Solo Urgencias") return apt.status === "urgent";
    return apt.specialty === activeFilter;
  });

  const getApt = (day: number, hour: string) =>
    filtered.find(a => a.day === day && a.time === hour);

  return (
    <div className={styles.wrapper}>
      {/* FILTERS */}
      <div className={styles.filtersBar}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* WEEK NAVIGATOR */}
      <div className={styles.weekNav}>
        <button className={styles.navBtn} onClick={() => setWeekOffset(w => w - 1)}>
          <ChevronLeft size={18} />
        </button>
        <span className={styles.weekLabel}>Semana del {weekDates[0]} al {weekDates[4]}</span>
        <button className={styles.navBtn} onClick={() => setWeekOffset(w => w + 1)}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* GRID */}
      <div className={styles.gridContainer}>
        {/* Header row */}
        <div className={styles.timeGutter} />
        {DAYS.map((day, i) => (
          <div key={day} className={styles.dayHeader}>
            <span className={styles.dayName}>{day}</span>
            <span className={styles.dayDate}>{weekDates[i]}</span>
          </div>
        ))}

        {/* Hour rows */}
        {HOURS.map(hour => (
          <React.Fragment key={hour}>
            <div className={styles.timeCell}>{hour}</div>
            {DAYS.map((_, dayIdx) => {
              const apt = getApt(dayIdx, hour);
              const cfg = apt ? STATUS_CONFIG[apt.status] : null;
              return (
                <div
                  key={dayIdx}
                  className={`${styles.slot} ${apt ? styles.slotFilled : ""}`}
                  onClick={() => apt && setSelected(apt)}
                >
                  {apt && cfg && (
                    <div
                      className={styles.aptCard}
                      style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                    >
                      {apt.status === "urgent" && (
                        <div className={styles.urgentBadge}>
                          <AlertCircle size={12} color="#DC2626" />
                          <span>Urgencia</span>
                        </div>
                      )}
                      <div className={styles.aptPatient}>{apt.patient}</div>
                      <div className={styles.aptMeta}>
                        <Stethoscope size={12} color="#64748B" />
                        {apt.specialty}
                      </div>
                      <div className={styles.aptMeta}>
                        <Clock size={12} color="#64748B" />
                        {apt.time} hrs
                      </div>
                      <div className={styles.statusBadge} style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                        {cfg.label}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            {(() => {
              const cfg = STATUS_CONFIG[selected.status];
              return (
                <>
                  <div className={styles.modalHeader} style={{ borderColor: cfg.border }}>
                    <div>
                      <h2 style={{ marginBottom: 4 }}>{selected.patient}</h2>
                      <p className="text-secondary" style={{ fontSize: 14 }}>{selected.specialty}</p>
                    </div>
                    <span style={{ color: cfg.color, fontWeight: 600, fontSize: 14 }}>{cfg.label}</span>
                  </div>
                  <div className={styles.modalBody}>
                    <div className={styles.modalRow}><Clock size={16} /><span>{selected.time} hrs</span></div>
                    <div className={styles.modalRow}><User size={16} /><span>Cita de Turno Regular</span></div>
                    {selected.note && (
                      <div className={styles.alertBox}>
                        <AlertCircle size={16} color="#DC2626" />
                        <span>{selected.note}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.modalBtnPrimary}>Abrir Ficha Clínica</button>
                    <button className={styles.modalBtnSecondary} onClick={() => setSelected(null)}>Cerrar</button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
