"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../store/AuthContext";
import { getHolidays, createHoliday, deleteHoliday, Holiday } from "../../../../services/scheduling";
import TimeSelector from "../../../../components/scheduling/TimeSelector";
import { Trash2 } from "lucide-react";

export default function AdminHolidaysPage() {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form State
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"TOTAL" | "PARTIAL">("TOTAL");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchHolidays = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getHolidays(user.token);
      if (res.success) {
        setHolidays(res.data);
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al cargar feriados", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const payload: Partial<Holiday> = {
        date,
        reason,
        type,
      };
      if (type === "PARTIAL") {
        payload.startTime = startTime;
        payload.endTime = endTime;
      }
      
      const res = await createHoliday(user!.token!, payload);
      if (res.success) {
        setMessage({ text: "Restricción institucional creada exitosamente", type: "success" });
        setDate("");
        setReason("");
        setType("TOTAL");
        setStartTime("");
        setEndTime("");
        fetchHolidays();
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al crear restricción", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta restricción?")) return;
    try {
      const res = await deleteHoliday(user!.token!, id);
      if (res.success) {
        fetchHolidays();
      }
    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    }
  };

  if (loading && holidays.length === 0) return <p>Cargando calendario institucional...</p>;

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", padding: "40px" }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}>Calendario Institucional</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
          Define feriados o jornadas parciales a nivel sistema. Estas restricciones aplican a la agenda de todos los médicos.
        </p>

        {holidays.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No hay restricciones institucionales registradas.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {holidays.map(holiday => (
              <div key={holiday.id} style={{ backgroundColor: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "4px" }}>
                    <p style={{ fontWeight: 600, margin: 0 }}>{holiday.date}</p>
                    <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", backgroundColor: holiday.type === "TOTAL" ? "#FEE2E2" : "#FEF3C7", color: holiday.type === "TOTAL" ? "#991B1B" : "#92400E", fontWeight: 600 }}>
                      {holiday.type === "TOTAL" ? "Feriado Total" : "Jornada Parcial"}
                    </span>
                  </div>
                  <p style={{ color: "var(--foreground)", fontSize: "14px", margin: "0 0 4px 0" }}>Motivo: {holiday.reason}</p>
                  {holiday.type === "PARTIAL" && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>Horas bloqueadas: {holiday.startTime} - {holiday.endTime}</p>
                  )}
                </div>
                <button 
                  onClick={() => holiday.id && handleDelete(holiday.id)}
                  style={{ backgroundColor: "transparent", border: "none", color: "#DC2626", cursor: "pointer", padding: "8px" }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: "380px", backgroundColor: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Nueva Restricción</h3>
        
        {message.text && (
          <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2", color: message.type === "success" ? "#065F46" : "#991B1B" }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Fecha *</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Motivo *</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. Feriado Nacional"
              value={reason} 
              onChange={e => setReason(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Tipo de Restricción *</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value as "TOTAL" | "PARTIAL")}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }}
            >
              <option value="TOTAL">Feriado Total (Todo el día)</option>
              <option value="PARTIAL">Jornada Parcial (Por horas)</option>
            </select>
          </div>

          {type === "PARTIAL" && (
            <div style={{ display: "flex", gap: "12px", padding: "12px", backgroundColor: "var(--background)", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ flex: 1 }}>
                <TimeSelector label="Hora Inicio" value={startTime} onChange={setStartTime} required />
              </div>
              <div style={{ flex: 1 }}>
                <TimeSelector label="Hora Fin" value={endTime} onChange={setEndTime} required />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={saving}
            style={{ marginTop: "8px", backgroundColor: "var(--primary)", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Guardando..." : "Guardar Restricción"}
          </button>
        </form>
      </div>
    </div>
  );
}
