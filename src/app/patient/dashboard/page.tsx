export default function PatientDashboard() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", color: "var(--foreground)", marginBottom: "8px" }}>Bienvenido a tu Portal</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "32px" }}>
        Consulta tus recetas médicas, órdenes de laboratorio y programa tus próximas citas.
      </p>

      <div style={{ padding: "24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <h3>No tienes citas próximas</h3>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>Puedes agendar una nueva cita en cualquier momento.</p>
        <button className="btn-primary" style={{ marginTop: "16px" }}>Agendar Cita</button>
      </div>
    </div>
  );
}
