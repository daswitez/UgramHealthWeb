import KanbanCalendar from "../components/calendar/KanbanCalendar";

export default function Home() {
  return (
    <div style={{ height: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "28px 40px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", backgroundColor: "var(--surface)" }}>
        <div>
          <h2>Agenda Total</h2>
          <p className="text-secondary" style={{ marginTop: "4px", fontSize: "14px" }}>
            Vista semana completa — FUSUM Sede Central
          </p>
        </div>
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          + Registrar Urgencia
        </button>
      </div>
      <KanbanCalendar />
    </div>
  );
}
