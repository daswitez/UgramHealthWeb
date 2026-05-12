"use client";

import React, { use, useEffect, useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { getStaffById, updateStaff, StaffUser, UpdateStaffPayload } from "@/services/staff";
import { ChevronLeft, UserCheck, UserX } from "lucide-react";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px", borderRadius: "8px",
  border: "1px solid var(--border)", backgroundColor: "var(--background)",
  color: "var(--foreground)", fontSize: "14px", boxSizing: "border-box",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador/a", DOCTOR: "Doctor/a",
  LAB_TECH: "Laboratorista", RECEPTIONIST: "Recepcionista",
};

export default function StaffDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  // En Next.js 15+ params es una Promise — usamos React.use() en Client Components
  const { userId } = use(params);
  const { user }   = useAuth();

  const [staff, setStaff]     = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [form, setForm] = useState<UpdateStaffPayload>({
    ci: "", email: "", firstName: "", lastName: "", phone: "",
    active: true, medicalLicense: null, specialty: null,
  });

  useEffect(() => {
    if (!user?.token || !userId) return;
    getStaffById(user.token, userId)
      .then(res => {
        setStaff(res.data);
        setForm({
          ci:             res.data.ci,
          email:          res.data.email,
          firstName:      res.data.firstName,
          lastName:       res.data.lastName,
          phone:          res.data.phone,
          active:         res.data.active,
          medicalLicense: res.data.medicalLicense,
          specialty:      res.data.specialty,
        });
      })
      .catch(err => console.warn("[Staff Detail] Error:", err))
      .finally(() => setLoading(false));
  }, [user, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMessage({ text: "", type: "" });
    try {
      const res = await updateStaff(user!.token!, userId, form);
      if (res.success) {
        setStaff(res.data);
        setMessage({ text: "Cuenta actualizada correctamente.", type: "success" });
        setEditing(false);
      }
    } catch (err: any) {
      setMessage({ text: err.message || "Error al actualizar", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ padding: "40px" }}>Cargando...</p>;
  if (!staff)  return <p style={{ padding: "40px" }}>Cuenta no encontrada.</p>;

  const isDoctor = staff.userType === "DOCTOR";

  return (
    <div style={{ padding: "40px", maxWidth: "720px", margin: "0 auto" }}>
      <Link href="/admin/staff" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
        <ChevronLeft size={16} /> Volver al listado
      </Link>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 4px 0" }}>{staff.fullName}</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            {ROLE_LABELS[staff.userType]} · {staff.email}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {staff.active
            ? <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#065F46", fontWeight: 600, padding: "6px 12px", borderRadius: "99px", backgroundColor: "#D1FAE5" }}><UserCheck size={15} /> Activo</span>
            : <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "13px", color: "#991B1B", fontWeight: 600, padding: "6px 12px", borderRadius: "99px", backgroundColor: "#FEE2E2" }}><UserX size={15} /> Inactivo</span>
          }
        </div>
      </div>

      {message.text && (
        <div style={{ padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", backgroundColor: message.type === "success" ? "#ECFDF5" : "#FEF2F2", color: message.type === "success" ? "#065F46" : "#991B1B", fontSize: "14px" }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
        {!editing ? (
          /* ── View mode ── */
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              {([
                ["Nombre",          staff.firstName],
                ["Apellido",        staff.lastName],
                ["C.I.",            staff.ci],
                ["Teléfono",        staff.phone],
                ["Correo",          staff.email],
                ["Rol",             ROLE_LABELS[staff.userType]],
                ...(isDoctor ? [["Especialidad", staff.specialty || "—"], ["Matrícula", staff.medicalLicense || "—"]] : []),
                ["Alta",            new Date(staff.createdAt).toLocaleDateString("es-BO")],
                ["Última edición",  new Date(staff.updatedAt).toLocaleDateString("es-BO")],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>{label}</p>
                  <p style={{ fontSize: "15px", fontWeight: 500, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setEditing(true)}
              style={{ backgroundColor: "var(--primary)", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", fontWeight: 600, cursor: "pointer" }}
            >
              Editar Cuenta
            </button>
          </div>
        ) : (
          /* ── Edit mode ── */
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Nombre *</label>
                <input name="firstName" required value={form.firstName} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Apellido *</label>
                <input name="lastName" required value={form.lastName} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>C.I. *</label>
                <input name="ci" required value={form.ci} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Teléfono *</label>
                <input name="phone" required value={form.phone || ""} onChange={handleChange} style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Correo *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            {isDoctor && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "16px", backgroundColor: "var(--background)", borderRadius: "10px", border: "1px solid var(--border)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Especialidad *</label>
                  <input name="specialty" required value={form.specialty || ""} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Matrícula *</label>
                  <input name="medicalLicense" required value={form.medicalLicense || ""} onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            )}

            {/* Toggle activo */}
            <div
              onClick={() => setForm(prev => ({ ...prev, active: !prev.active }))}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", backgroundColor: "var(--background)", borderRadius: "10px", border: "1px solid var(--border)", cursor: "pointer" }}
            >
              <div style={{ width: 40, height: 22, borderRadius: 11, backgroundColor: form.active ? "#10B981" : "#CBD5E1", position: "relative", transition: "background-color 0.2s", flexShrink: 0 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "white", position: "absolute", top: 2, left: form.active ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: "14px" }}>Cuenta {form.active ? "Activa" : "Inactiva"}</p>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-secondary)" }}>{form.active ? "El usuario puede iniciar sesión" : "El acceso al sistema está bloqueado"}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" disabled={saving} style={{ flex: 1, backgroundColor: "var(--primary)", color: "white", padding: "12px", borderRadius: "10px", border: "none", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
              <button type="button" onClick={() => { setEditing(false); setMessage({ text: "", type: "" }); }} style={{ padding: "12px 20px", borderRadius: "10px", border: "1px solid var(--border)", backgroundColor: "transparent", cursor: "pointer", fontWeight: 500 }}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
