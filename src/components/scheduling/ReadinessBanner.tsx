"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { getScheduleReadiness, ScheduleReadiness } from "../../services/scheduling";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function ReadinessBanner() {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState<ScheduleReadiness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Solo verificar si es DOCTOR con un token real del backend
    if (user?.role !== "DOCTOR" || !user.token) {
      setLoading(false);
      return;
    }

    const fetchReadiness = async () => {
      try {
        const response = await getScheduleReadiness(user.token!);
        if (response.success && response.data) {
          setReadiness(response.data);
        }
      } catch {
        // Silencioso: si el backend no responde o da 403, simplemente no mostramos el banner
      } finally {
        setLoading(false);
      }
    };

    fetchReadiness();
  }, [user]);

  if (loading || !readiness || readiness.readyForPublishing) {
    return null; // Todo está en orden o no aplica
  }

  // Generar mensajes amigables basados en los requirements
  const getRequirementMessage = (req: string) => {
    switch (req) {
      case "PROFILE_PROFESSIONAL_INCOMPLETE":
        return "Completar perfil profesional";
      case "WEEKLY_AVAILABILITY_NOT_CONFIGURED":
        return "Configurar disponibilidad semanal";
      case "SCHEDULE_SETTINGS_NOT_CONFIGURED":
        return "Definir duración de consulta";
      default:
        return "Requisito pendiente";
    }
  };

  return (
    <div style={{
      backgroundColor: "#FEF2F2",
      border: "1px solid #F87171",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "24px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    }}>
      <AlertCircle color="#DC2626" size={24} style={{ flexShrink: 0, marginTop: "2px" }} />
      <div>
        <h4 style={{ color: "#991B1B", margin: "0 0 4px 0", fontSize: "15px" }}>Configuración de Agenda Pendiente</h4>
        <p style={{ color: "#B91C1C", margin: "0 0 12px 0", fontSize: "14px" }}>
          Su agenda no es visible para los pacientes. Por favor, complete los siguientes requisitos:
        </p>
        <ul style={{ margin: 0, paddingLeft: "20px", color: "#991B1B", fontSize: "13px" }}>
          {readiness.missingRequirements.map((req) => (
            <li key={req} style={{ marginBottom: "4px" }}>
              {getRequirementMessage(req)}
              {req === "WEEKLY_AVAILABILITY_NOT_CONFIGURED" && (
                <Link href="/doctor/profile" style={{ marginLeft: "8px", color: "#DC2626", textDecoration: "underline", fontWeight: 600 }}>
                  Ir a Disponibilidad (Perfil)
                </Link>
              )}
              {req === "SCHEDULE_SETTINGS_NOT_CONFIGURED" && (
                <Link href="/doctor/profile" style={{ marginLeft: "8px", color: "#DC2626", textDecoration: "underline", fontWeight: 600 }}>
                  Ir a Configuración (Perfil)
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
