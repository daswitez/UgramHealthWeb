"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/AuthContext";
import { getDoctorProfile, updateDoctorProfile, DoctorProfile } from "../../../services/profile";

// Re-usamos las páginas creadas como "Tabs" o subcomponentes
import AvailabilityPage from "../schedule/availability/page";
import ScheduleSettingsPage from "../schedule/settings/page";
import DoctorBlocksPage from "../schedule/blocks/page";

import { User, Calendar, Settings, Clock, ShieldAlert } from "lucide-react";

export default function DoctorProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "availability" | "settings" | "blocks">("profile");
  
  const [profile, setProfile] = useState<DoctorProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    specialty: "",
    medicalLicense: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (!user?.token) return;
    const fetchProfile = async () => {
      try {
        const res = await getDoctorProfile(user.token!);
        if (res.success && res.data) {
          setProfile(res.data);
        }
      } catch (error: any) {
        console.warn("Perfil no cargado o no existente, usando vacio.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await updateDoctorProfile(user!.token!, profile);
      if (res.success) {
        setMessage({ text: "Perfil actualizado correctamente.", type: "success" });
      }
    } catch (error: any) {
      setMessage({ text: error.message || "Error al actualizar perfil", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 8px 0", color: "var(--foreground)" }}>Mi Perfil y Agenda</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "15px", margin: 0 }}>
          Gestiona tus datos profesionales y la configuración de tu disponibilidad para pacientes.
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
        {/* Sidebar Interno (Tabs) */}
        <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
          <button 
            onClick={() => setActiveTab("profile")}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "profile" ? "var(--primary-light)" : "transparent", color: activeTab === "profile" ? "var(--primary)" : "var(--text-secondary)", fontWeight: activeTab === "profile" ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%", fontSize: "14px", transition: "all 0.2s" }}
          >
            <User size={18} /> Datos Profesionales
          </button>
          <button 
            onClick={() => setActiveTab("availability")}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "availability" ? "var(--primary-light)" : "transparent", color: activeTab === "availability" ? "var(--primary)" : "var(--text-secondary)", fontWeight: activeTab === "availability" ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%", fontSize: "14px", transition: "all 0.2s" }}
          >
            <Calendar size={18} /> Disponibilidad Semanal
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "settings" ? "var(--primary-light)" : "transparent", color: activeTab === "settings" ? "var(--primary)" : "var(--text-secondary)", fontWeight: activeTab === "settings" ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%", fontSize: "14px", transition: "all 0.2s" }}
          >
            <Settings size={18} /> Parámetros de Agenda
          </button>
          <button 
            onClick={() => setActiveTab("blocks")}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", border: "none", backgroundColor: activeTab === "blocks" ? "var(--primary-light)" : "transparent", color: activeTab === "blocks" ? "var(--primary)" : "var(--text-secondary)", fontWeight: activeTab === "blocks" ? 600 : 500, cursor: "pointer", textAlign: "left", width: "100%", fontSize: "14px", transition: "all 0.2s" }}
          >
            <ShieldAlert size={18} /> Mis Bloqueos
          </button>
        </div>

        {/* Contenido del Tab */}
        <div style={{ flex: 1 }}>
          {activeTab === "profile" && (
            <div style={{ backgroundColor: "var(--surface)", padding: "32px", borderRadius: "16px", border: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "24px" }}>Información Pública</h3>
              
              {message.text && (
                <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "24px", fontSize: "14px", backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2", color: message.type === "success" ? "#065F46" : "#991B1B" }}>
                  {message.text}
                </div>
              )}

              {loading ? (
                <p>Cargando perfil...</p>
              ) : (
                <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Nombres *</label>
                      <input type="text" name="firstName" required value={profile.firstName} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Apellidos *</label>
                      <input type="text" name="lastName" required value={profile.lastName} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Especialidad Médica *</label>
                      <input type="text" name="specialty" required placeholder="Ej. Medicina General" value={profile.specialty} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Matrícula / Licencia *</label>
                      <input type="text" name="medicalLicense" required placeholder="Ej. MP-12345" value={profile.medicalLicense} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>Teléfono de Contacto</label>
                    <input type="text" name="phone" placeholder="+591..." value={profile.phone} onChange={handleChange} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)" }} />
                  </div>

                  <button 
                    type="submit" 
                    disabled={saving}
                    style={{ marginTop: "16px", backgroundColor: "var(--primary)", color: "white", padding: "12px 24px", borderRadius: "8px", border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, alignSelf: "flex-end" }}
                  >
                    {saving ? "Guardando..." : "Guardar Perfil"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Wrappers to render the imported pages but adjusting styling so they fit inside the tab */}
          <div style={{ display: activeTab === "availability" ? "block" : "none" }}>
            <AvailabilityPage />
          </div>
          
          <div style={{ display: activeTab === "settings" ? "block" : "none" }}>
            <ScheduleSettingsPage />
          </div>

          <div style={{ display: activeTab === "blocks" ? "block" : "none", margin: "-40px" /* Compensate padding from blocks page */ }}>
            <DoctorBlocksPage />
          </div>

        </div>
      </div>
    </div>
  );
}
