import styles from "./page.module.css";

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      
      {/* Sidebar Mock Placeholder */}
      <div style={{ flex: 1, display: 'flex' }}>
        <aside style={{ width: '280px', borderRight: '1px solid var(--border)', padding: '24px', backgroundColor: 'var(--surface-hover)'}}>
          <h1 style={{ color: 'var(--primary)' }}>Ugram Health</h1>
          <p className="text-secondary" style={{ marginTop: '8px' }}>Portal Clínico Administrativo</p>
          
          <nav style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--background)', borderRadius: '12px', outline: '1px solid var(--border)', fontWeight: 600}}>
              📅 Agenda Total
            </div>
            <div style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 500}}>
              📊 Dashboard FUSUM
            </div>
            <div style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 500}}>
              🔬 Laboratorio Central
            </div>
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main style={{ flex: 1, padding: '40px' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2>Visión General de Citas</h2>
            <button className="btn-primary">+ Registrar Urgencia</button>
          </header>

          <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '400px',
            border: '2px dashed var(--border)',
            borderRadius: '24px'
          }}>
            <div style={{ textAlign: 'center'}}>
              <h2 style={{color: 'var(--primary)', opacity: 0.5, fontSize: '48px'}}>📂</h2>
              <h2 style={{marginTop: '16px'}}>El Kanban-Grid está en construcción</h2>
              <p className="text-secondary" style={{marginTop: '8px'}}>Sprint W2 requerido para leer la base de datos de los teléfonos.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
