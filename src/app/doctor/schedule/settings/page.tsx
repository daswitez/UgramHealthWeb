"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../store/AuthContext";
import { getScheduleSettings, updateScheduleSettings } from "../../../../services/scheduling";

export default function ScheduleSettingsPage() {
  const { user } = useAuth();
  const [duration, setDuration] = useState<number>(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!user?.token) return;
    const fetchSettings = async () => {
      try {
        const res = await getScheduleSettings(user.token!);
        if (res.success) {
          setDuration(res.data.appointmentDurationMinutes);
        }
      } catch (error: any) {
        setMessage({ text: error.message || "Error al cargar configuración", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await updateScheduleSettings(user!.token!, duration);
      if (res.success) {
        setMessage({ text: "Configuración guardada con éxito", type: "success" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al guardar configuración", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div>
      <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px", color: "var(--foreground)" }}>Configuración de Agenda</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
        Define los parámetros generales de tu agenda, como la duración estándar de cada consulta.
      </p>

      {message.text && (
        <div style={{
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "24px",
          backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2",
          color: message.type === "success" ? "#065F46" : "#991B1B",
          border: `1px solid ${message.type === "success" ? "#34D399" : "#F87171"}`
        }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: "var(--surface)", padding: "24px", borderRadius: "12px", border: "1px solid var(--border)", maxWidth: "500px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
            Duración de la consulta (minutos)
          </label>
          <select 
            value={duration} 
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", outline: "none", backgroundColor: "var(--background)", color: "var(--foreground)" }}
          >
            <option value={10}>10 minutos</option>
            <option value={15}>15 minutos</option>
            <option value={20}>20 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>60 minutos (1 hora)</option>
          </select>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            backgroundColor: "var(--primary)", color: "white", padding: "10px 20px", borderRadius: "8px",
            border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
