"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../store/AuthContext";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  Holiday,
} from "../../../../services/scheduling";
import TimeSelector from "../../../../components/scheduling/TimeSelector";
import { ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];
const DAY_NAMES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

type ModalMode = "create" | "view";

interface ModalState {
  open: boolean;
  mode: ModalMode;
  date: string; // YYYY-MM-DD
  holiday?: Holiday; // cuando mode=view
}

export default function AdminHolidaysPage() {
  const { user } = useAuth();

  // Calendar state
  const today = new Date();
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed

  // Data
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading]   = useState(true);

  // Modal
  const [modal, setModal] = useState<ModalState>({ open: false, mode: "create", date: "" });

  // Form
  const [reason, setReason]       = useState("");
  const [type, setType]           = useState<"TOTAL" | "PARTIAL">("TOTAL");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime]     = useState("");
  const [saving, setSaving]       = useState(false);
  const [formMsg, setFormMsg]     = useState({ text: "", type: "" });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchHolidays = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getHolidays(user.token);
      if (res.success) setHolidays(res.data ?? []);
    } catch {
      // silencioso — sin token válido no hay datos
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchHolidays(); }, [fetchHolidays]);

  // ── Calendar helpers ───────────────────────────────────────────────────────
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); // 0=Dom
  const daysInMonth     = new Date(viewYear, viewMonth + 1, 0).getDate();

  const toISO = (day: number) =>
    `${viewYear}-${String(viewMonth + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

  const holidayMap = new Map<string, Holiday>();
  holidays.forEach(h => holidayMap.set(h.date, h));

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = (dateISO: string) => {
    setReason(""); setType("TOTAL"); setStartTime(""); setEndTime(""); setFormMsg({ text:"", type:"" });
    setModal({ open: true, mode: "create", date: dateISO });
  };

  const openView = (holiday: Holiday) => {
    setModal({ open: true, mode: "view", date: holiday.date, holiday });
  };

  const closeModal = () => setModal(m => ({ ...m, open: false }));

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setFormMsg({ text:"", type:"" });
    try {
      const payload: Partial<Holiday> = { date: modal.date, reason, type };
      if (type === "PARTIAL") { payload.startTime = startTime; payload.endTime = endTime; }
      const res = await createHoliday(user!.token!, payload);
      if (res.success) {
        setFormMsg({ text: "Restricción registrada.", type: "success" });
        fetchHolidays();
        setTimeout(closeModal, 800);
      }
    } catch (err: any) {
      setFormMsg({ text: err.message || "Error al guardar", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta restricción?")) return;
    try {
      await deleteHoliday(user!.token!, id);
      fetchHolidays();
      closeModal();
    } catch (err: any) {
      alert("Error al eliminar: " + err.message);
    }
  };

  // ── Render calendar cells ──────────────────────────────────────────────────
  const cells: React.ReactNode[] = [];

  // Empty cells before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const iso      = toISO(day);
    const holiday  = holidayMap.get(iso);
    const isToday  = iso === today.toISOString().split("T")[0];

    let bg      = "var(--surface)";
    let border  = "1px solid var(--border)";
    let dayColor = "var(--foreground)";

    if (holiday?.type === "TOTAL") {
      bg = "#FEE2E2"; border = "1px solid #F87171"; dayColor = "#991B1B";
    } else if (holiday?.type === "PARTIAL") {
      bg = "#FEF3C7"; border = "1px solid #FBBF24"; dayColor = "#92400E";
    } else if (isToday) {
      border = "2px solid var(--primary)";
    }

    cells.push(
      <div
        key={iso}
        onClick={() => holiday ? openView(holiday) : openCreate(iso)}
        title={holiday ? `${holiday.type === "TOTAL" ? "Feriado Total" : "Jornada Parcial"}: ${holiday.reason}` : "Clic para agregar restricción"}
        style={{
          backgroundColor: bg,
          border,
          borderRadius: "8px",
          padding: "10px 8px",
          minHeight: "64px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
        onMouseEnter={e => { if (!holiday) e.currentTarget.style.borderColor = "var(--primary)"; }}
        onMouseLeave={e => { if (!holiday) e.currentTarget.style.borderColor = "var(--border)"; }}
      >
        <span style={{ fontSize: "13px", fontWeight: isToday ? 800 : 600, color: dayColor }}>
          {day}
        </span>
        {holiday && (
          <span style={{
            fontSize: "10px",
            fontWeight: 600,
            color: dayColor,
            lineHeight: 1.2,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {holiday.type === "TOTAL" ? "🔴 Feriado" : "🟡 Parcial"}
            {"\n"}{holiday.reason}
          </span>
        )}
      </div>
    );
  }

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0" }}>
          Calendario Institucional
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
          Define feriados y jornadas parciales. Estas restricciones aplican a la agenda de todos los médicos.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "24px", fontSize: "13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 16, height: 16, borderRadius: "4px", backgroundColor: "#FEE2E2", border: "1px solid #F87171" }} />
          <span>Feriado Total</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 16, height: 16, borderRadius: "4px", backgroundColor: "#FEF3C7", border: "1px solid #FBBF24" }} />
          <span>Jornada Parcial</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: 16, height: 16, borderRadius: "4px", backgroundColor: "var(--surface)", border: "2px solid var(--primary)" }} />
          <span>Hoy</span>
        </div>
      </div>

      {/* Calendar Card */}
      <div style={{ backgroundColor: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>

        {/* Month Navigator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <button onClick={prevMonth} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px", cursor: "pointer", display: "flex", color: "var(--foreground)" }}>
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button onClick={nextMonth} style={{ background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px", cursor: "pointer", display: "flex", color: "var(--foreground)" }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", padding: "12px 16px 4px" }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", padding: "6px 0" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", padding: "4px 16px 20px" }}>
          {loading
            ? <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>Cargando...</div>
            : cells
          }
        </div>
      </div>

      {/* Summary list */}
      {holidays.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Restricciones Registradas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[...holidays].sort((a,b) => a.date.localeCompare(b.date)).map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--surface)", padding: "12px 16px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", minWidth: "100px" }}>{h.date}</span>
                  <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "99px", fontWeight: 600, backgroundColor: h.type === "TOTAL" ? "#FEE2E2" : "#FEF3C7", color: h.type === "TOTAL" ? "#991B1B" : "#92400E" }}>
                    {h.type === "TOTAL" ? "Feriado Total" : "Jornada Parcial"}
                  </span>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{h.reason}</span>
                  {h.type === "PARTIAL" && (
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{h.startTime} – {h.endTime}</span>
                  )}
                </div>
                <button onClick={() => h.id && handleDelete(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: "4px" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {modal.open && (
        <div
          onClick={closeModal}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: "var(--surface)", borderRadius: "16px", padding: "32px", width: "440px", maxWidth: "90vw", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
                  {modal.mode === "create" ? "Nueva Restricción" : "Detalle de Restricción"}
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                  {modal.date}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            {/* VIEW mode */}
            {modal.mode === "view" && modal.holiday && (
              <div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                  <div style={{ padding: "12px 16px", borderRadius: "8px", backgroundColor: modal.holiday.type === "TOTAL" ? "#FEE2E2" : "#FEF3C7" }}>
                    <p style={{ margin: "0 0 4px 0", fontWeight: 700, color: modal.holiday.type === "TOTAL" ? "#991B1B" : "#92400E" }}>
                      {modal.holiday.type === "TOTAL" ? "🔴 Feriado Total" : "🟡 Jornada Parcial"}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: modal.holiday.type === "TOTAL" ? "#B91C1C" : "#92400E" }}>
                      {modal.holiday.reason}
                    </p>
                  </div>
                  {modal.holiday.type === "PARTIAL" && (
                    <p style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>
                      ⏱ Horas bloqueadas: <strong>{modal.holiday.startTime} – {modal.holiday.endTime}</strong>
                    </p>
                  )}
                </div>
                <button
                  onClick={() => modal.holiday?.id && handleDelete(modal.holiday.id)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #F87171", backgroundColor: "#FEF2F2", color: "#DC2626", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <Trash2 size={16} /> Eliminar Restricción
                </button>
              </div>
            )}

            {/* CREATE mode */}
            {modal.mode === "create" && (
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {formMsg.text && (
                  <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", backgroundColor: formMsg.type === "success" ? "#ECFDF5" : "#FEF2F2", color: formMsg.type === "success" ? "#065F46" : "#991B1B" }}>
                    {formMsg.text}
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Motivo *</label>
                  <input
                    type="text" required placeholder="Ej. Feriado Nacional"
                    value={reason} onChange={e => setReason(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Tipo *</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {(["TOTAL","PARTIAL"] as const).map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setType(t)}
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: `2px solid ${type === t ? (t === "TOTAL" ? "#F87171" : "#FBBF24") : "var(--border)"}`, backgroundColor: type === t ? (t === "TOTAL" ? "#FEE2E2" : "#FEF3C7") : "transparent", color: type === t ? (t === "TOTAL" ? "#991B1B" : "#92400E") : "var(--text-secondary)", fontWeight: 600, cursor: "pointer", fontSize: "13px", transition: "all 0.15s" }}
                      >
                        {t === "TOTAL" ? "🔴 Total" : "🟡 Parcial"}
                      </button>
                    ))}
                  </div>
                </div>

                {type === "PARTIAL" && (
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <TimeSelector label="Hora inicio" value={startTime} onChange={setStartTime} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <TimeSelector label="Hora fin" value={endTime} onChange={setEndTime} required />
                    </div>
                  </div>
                )}

                <button
                  type="submit" disabled={saving}
                  style={{ marginTop: "8px", backgroundColor: "var(--primary)", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Guardando..." : "Guardar Restricción"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
