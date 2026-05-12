"use client";

import React, { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { createStaff, CreateStaffPayload } from "@/services/staff";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const USER_TYPES = [
  { value: "DOCTOR",       label: "Doctor/a" },
  { value: "LAB_TECH",     label: "Laboratorista" },
  { value: "ADMIN",        label: "Administrador/a" },
  { value: "RECEPTIONIST", label: "Recepcionista" },
];

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px", borderRadius: "8px",
  border: "1px solid var(--border)", backgroundColor: "var(--background)",
  color: "var(--foreground)", fontSize: "14px", boxSizing: "border-box",
};

export default function NewStaffPage() {
  const { user }  = useAuth();
  const router    = useRouter();

  const [form, setForm] = useState<CreateStaffPayload>({
    ci: "", email: "", firstName: "", lastName: "", phone: "",
    userType: "DOCTOR", medicalLicense: "", specialty: "",
  });
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tempPwd, setTempPwd] = useState("");

  const isDoctor = form.userType === "DOCTOR";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMessage({ text: "", type: "" }); setTempPwd("");
    try {
      const payload: CreateStaffPayload = { ...form };
      if (!isDoctor) { delete payload.medicalLicense; delete payload.specialty; }

      const res = await createStaff(user!.token!, payload);
      if (res.success) {
        setTempPwd(res.data.tempPassword || "");
        setMessage({ text: `✔ ${res.message}`, type: "success" });
        setForm({ ci: "", email: "", firstName: "", lastName: "", phone: "", userType: "DOCTOR", medicalLicense: "", specialty: "" });
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Error al registrar personal", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "680px", margin: "0 auto" }}>
      <Link href="/admin/staff" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
        <ChevronLeft size={16} /> Volver al listado
      </Link>

      <h2 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 6px 0" }}>Dar de Alta — Personal</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "32px" }}>
        El sistema generará una contraseña temporal y enviará un correo de bienvenida.
      </p>

      {message.text && (
        <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "20px", backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2", color: message.type === "success" ? "#065F46" : "#991B1B", fontSize: "14px", fontWeight: 500 }}>
          {message.text}
        </div>
      )}

      {tempPwd && (
        <div style={{ padding: "14px 16px", borderRadius: "10px", marginBottom: "20px", backgroundColor: "#FEF3C7", border: "1px solid #FBBF24" }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: 700, color: "#92400E" }}>Contraseña temporal (guardar como respaldo)</p>
          <code style={{ fontSize: "16px", color: "#78350F", fontFamily: "monospace" }}>{tempPwd}</code>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", backgroundColor: "var(--surface)", padding: "32px", borderRadius: "16px", border: "1px solid var(--border)" }}>

        {/* Tipo */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Rol *</label>
          <select name="userType" value={form.userType} onChange={handleChange} style={inputStyle}>
            {USER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        {/* Nombre y Apellido */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Nombre *</label>
            <input name="firstName" required value={form.firstName} onChange={handleChange} style={inputStyle} placeholder="Carlos" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Apellido *</label>
            <input name="lastName" required value={form.lastName} onChange={handleChange} style={inputStyle} placeholder="Vargas" />
          </div>
        </div>

        {/* CI y Email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>C.I. *</label>
            <input name="ci" required value={form.ci} onChange={handleChange} style={inputStyle} placeholder="87654321" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Correo institucional *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} placeholder="nuevo.doctor@uagrm.edu.bo" />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Teléfono *</label>
          <input name="phone" required value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+59170000001" />
        </div>

        {/* Campos solo para DOCTOR */}
        {isDoctor && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "20px", backgroundColor: "var(--background)", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Especialidad *</label>
              <input name="specialty" required={isDoctor} value={form.specialty} onChange={handleChange} style={inputStyle} placeholder="Medicina General" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Matrícula *</label>
              <input name="medicalLicense" required={isDoctor} value={form.medicalLicense} onChange={handleChange} style={inputStyle} placeholder="MP-9988" />
            </div>
          </div>
        )}

        <button
          type="submit" disabled={saving}
          style={{ backgroundColor: "var(--primary)", color: "white", padding: "14px", borderRadius: "10px", border: "none", fontWeight: 700, fontSize: "15px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, marginTop: "8px" }}
        >
          {saving ? "Registrando..." : "Crear Cuenta y Enviar Correo"}
        </button>
      </form>
    </div>
  );
}
