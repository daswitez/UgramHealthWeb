"use client";

import React, { useState } from "react";
import { useAuth } from "../../../../../store/AuthContext";
import { getAppointmentSlots, AppointmentSlot } from "../../../../../services/scheduling";
import { Search, Calendar } from "lucide-react";

export default function AppointmentSearchPage() {
  const { user } = useAuth();
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isReady, setIsReady] = useState(true);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !date) return;
    
    setLoading(true);
    setHasSearched(true);
    setMessage({ text: "", type: "" });
    setSlots([]);
    
    try {
      const res = await getAppointmentSlots(user!.token!, doctorId, date);
      if (res.success) {
        setSlots(res.data.slots);
        setIsReady(res.data.readyForPublishing);
        if (!res.data.readyForPublishing) {
          setMessage({ text: "El médico seleccionado no tiene su agenda publicada aún.", type: "warning" });
        } else if (res.data.slots.length === 0) {
          setMessage({ text: "No hay disponibilidad para la fecha seleccionada.", type: "warning" });
        }
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al buscar disponibilidad", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
      <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}>Buscar Turnos Médicos</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "15px" }}>
        Selecciona un médico y una fecha para ver los horarios disponibles y agendar tu cita.
      </p>

      <div style={{ backgroundColor: "var(--surface)", padding: "24px", borderRadius: "16px", border: "1px solid var(--border)", marginBottom: "32px" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "16px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>ID del Médico</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. d0000000-0000-0000-0000-000000000000"
              value={doctorId} 
              onChange={e => setDoctorId(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Fecha</label>
            <input 
              type="date" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--primary)", color: "white", padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, height: "46px" }}
          >
            <Search size={18} />
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </form>
      </div>

      {hasSearched && !loading && (
        <div>
          {message.text && (
            <div style={{ padding: "16px", borderRadius: "12px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px", backgroundColor: message.type === "warning" ? "#FEF3C7" : (message.type === "error" ? "#FEF2F2" : "#ECFDF5"), color: message.type === "warning" ? "#92400E" : (message.type === "error" ? "#991B1B" : "#065F46") }}>
              <Calendar size={20} />
              <p style={{ margin: 0, fontWeight: 500 }}>{message.text}</p>
            </div>
          )}

          {isReady && slots.length > 0 && (
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>Horarios Disponibles para el {date}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
                {slots.map((slot, index) => (
                  <div key={index} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--surface)", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                    <p style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 4px 0", color: "var(--foreground)" }}>{formatTime(slot.startAt)}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0 }}>hasta {formatTime(slot.endAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
