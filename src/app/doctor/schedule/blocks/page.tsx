"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { getDoctorBlocks, createDoctorBlock, deleteDoctorBlock, DoctorBlock } from "@/services/scheduling";
import TimeSelector from "@/components/scheduling/TimeSelector";
import { Trash2, Plus } from "lucide-react";

export default function DoctorBlocksPage() {
  const { user } = useAuth();
  const [blocks, setBlocks] = useState<DoctorBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Form State
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const fetchBlocks = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const res = await getDoctorBlocks(user.token);
      if (res.success) {
        setBlocks(res.data);
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al cargar bloqueos", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const payload: Partial<DoctorBlock> = {
        date,
        reason,
        allDay,
      };
      if (!allDay) {
        payload.startTime = startTime;
        payload.endTime = endTime;
      }
      
      const res = await createDoctorBlock(user!.token!, payload);
      if (res.success) {
        setMessage({ text: "Bloqueo registrado exitosamente", type: "success" });
        setDate("");
        setReason("");
        setStartTime("");
        setEndTime("");
        fetchBlocks();
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al crear bloqueo", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este bloqueo?")) return;
    try {
      const res = await deleteDoctorBlock(user!.token!, id);
      if (res.success) {
        fetchBlocks();
      }
    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    }
  };

  if (loading && blocks.length === 0) return <p>Cargando bloqueos...</p>;

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", padding: "40px" }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}>Mis Bloqueos Puntuales</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
          Define fechas o rangos de horas específicos en los que no podrás atender (ej. vacaciones, licencias).
        </p>

        {blocks.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No tienes bloqueos registrados.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {blocks.map(block => (
              <div key={block.id} style={{ backgroundColor: "var(--surface)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>{block.date} {block.allDay ? "(Todo el día)" : `(${block.startTime} - ${block.endTime})`}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>Motivo: {block.reason}</p>
                </div>
                <button 
                  onClick={() => block.id && handleDelete(block.id)}
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
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Registrar Nuevo Bloqueo</h3>
        
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
              placeholder="Ej. Vacaciones"
              value={reason} 
              onChange={e => setReason(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} 
            />
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
            <input 
              type="checkbox" 
              checked={allDay} 
              onChange={e => setAllDay(e.target.checked)} 
            />
            Bloquear todo el día
          </label>

          {!allDay && (
            <div style={{ display: "flex", gap: "12px" }}>
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
            {saving ? "Guardando..." : "Guardar Bloqueo"}
          </button>
        </form>
      </div>
    </div>
  );
}
