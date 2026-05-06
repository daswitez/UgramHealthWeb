export default function IAMPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontSize: "28px", marginBottom: "8px" }}>Gestión de Personal (IAM)</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        Administración centralizada de Doctores, Especialistas, Laboratoristas y Personal Administrativo.
      </p>
      
      <div style={{ padding: "24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <h3>Alta de Nuevo Personal</h3>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>El registro requiere verificación institucional.</p>
        <button className="btn-primary" style={{ marginTop: "16px" }}>+ Registrar Personal</button>
      </div>
    </div>
  );
}
