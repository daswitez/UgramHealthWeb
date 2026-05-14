"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { getDoctorAvailability, updateDoctorAvailability, WeeklySlot, DayOfWeek } from "@/services/scheduling";
import TimeSelector from "@/components/scheduling/TimeSelector";
import { Trash2, Plus } from "lucide-react";

const DAYS_ES = {
  [DayOfWeek.MONDAY]: "Lunes",
  [DayOfWeek.TUESDAY]: "Martes",
  [DayOfWeek.WEDNESDAY]: "Miércoles",
  [DayOfWeek.THURSDAY]: "Jueves",
  [DayOfWeek.FRIDAY]: "Viernes",
  [DayOfWeek.SATURDAY]: "Sábado",
  [DayOfWeek.SUNDAY]: "Domingo",
};

export default function AvailabilityPage() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<WeeklySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!user?.token) return;
    const fetchAvailability = async () => {
      try {
        const res = await getDoctorAvailability(user.token!);
        if (res.success) {
          // Aseguramos que los tiempos queden en HH:mm si vienen con segundos
          const formatted = res.data.weeklyAvailability.map(s => ({
            ...s,
            startTime: s.startTime.substring(0, 5),
            endTime: s.endTime.substring(0, 5)
          }));
          setSlots(formatted);
        }
      } catch (error: any) {
        setMessage({ text: error.message || "Error al cargar disponibilidad", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [user]);

  const addSlot = (day: DayOfWeek) => {
    setSlots([...slots, { dayOfWeek: day, startTime: "08:00", endTime: "12:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: keyof WeeklySlot, value: string) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setSlots(newSlots);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await updateDoctorAvailability(user!.token!, slots);
      if (res.success) {
        setMessage({ text: "Disponibilidad guardada exitosamente.", type: "success" });
        // Opcional: forzar una recarga global o actualizar el estado para ocultar el banner
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al guardar disponibilidad", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando disponibilidad...</p>;

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}>Disponibilidad Semanal</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
        Configura tus horarios recurrentes de atención. Estos horarios se repetirán todas las semanas.
      </p>

      {message.text && (
        <div style={{
          padding: "12px", borderRadius: "8px", marginBottom: "24px",
          backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2",
          color: message.type === "success" ? "#065F46" : "#991B1B",
          border: `1px solid ${message.type === "success" ? "#34D399" : "#F87171"}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
        {Object.values(DayOfWeek).map((day) => {
          const daySlots = slots.filter(s => s.dayOfWeek === day);
          const originalIndices = slots.map((s, idx) => s.dayOfWeek === day ? idx : -1).filter(idx => idx !== -1);

          return (
            <div key={day} style={{ backgroundColor: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: daySlots.length > 0 ? "16px" : "0" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, width: "120px" }}>{DAYS_ES[day as DayOfWeek]}</h3>
                <button onClick={() => addSlot(day as DayOfWeek)} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: "1px solid var(--border)", color: "var(--foreground)", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 500 }}>
                  <Plus size={16} /> Añadir Franja
                </button>
              </div>

              {daySlots.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {daySlots.map((slot, idxInDay) => {
                    const globalIdx = originalIndices[idxInDay];
                    return (
                      <div key={globalIdx} style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
                        <TimeSelector 
                          label="Desde" 
                          value={slot.startTime} 
                          onChange={(val) => updateSlot(globalIdx, "startTime", val)} 
                        />
                        <span style={{ marginBottom: "14px", color: "var(--text-secondary)" }}>-</span>
                        <TimeSelector 
                          label="Hasta" 
                          value={slot.endTime} 
                          onChange={(val) => updateSlot(globalIdx, "endTime", val)} 
                        />
                        <button 
                          onClick={() => removeSlot(globalIdx)}
                          style={{ marginBottom: "2px", backgroundColor: "transparent", border: "none", color: "#DC2626", cursor: "pointer", padding: "8px" }}
                          title="Eliminar franja"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ position: "sticky", bottom: "0", backgroundColor: "var(--background)", padding: "20px 0", borderTop: "1px solid var(--border)", zIndex: 10 }}>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "var(--primary)", color: "white", padding: "12px 24px", borderRadius: "8px",
            border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, width: "100%", fontSize: "15px"
          }}
        >
          {saving ? "Guardando disponibilidad..." : "Guardar Disponibilidad Semanal"}
        </button>
      </div>
    </div>
  );
}
