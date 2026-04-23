"use client";

import React, { useState, useRef } from "react";
import {
  CheckSquare, Square, CheckCircle, Clock, Upload,
  FileText, Filter, AlertCircle, Download, X, ChevronDown
} from "lucide-react";
import styles from "./LabCentral.module.css";

// ─── TYPES ────────────────────────────────────────────────────────────
type LabStatus = "pending" | "ready" | "approved" | "urgent";

interface LabResult {
  id: string;
  patient: string;
  ru: string;
  test: string;
  category: string;
  orderedBy: string;
  orderedDate: string;
  status: LabStatus;
  result?: string;
  flag?: "normal" | "high" | "low" | "critical";
}

// ─── MOCK DATA ────────────────────────────────────────────────────────
const MOCK_LABS: LabResult[] = [
  { id: "L001", patient: "Juan Pérez Gómez",    ru: "220019283", test: "Hemograma Completo",      category: "Hematología",     orderedBy: "Dra. López",   orderedDate: "23 Abr", status: "ready",   result: "HGB: 13.2 g/dL · HCT: 40% · PLT: 210k · WBC: 7.2k",  flag: "normal" },
  { id: "L002", patient: "Ana Torres Salinas",  ru: "221038472", test: "Glucosa en Ayunas",       category: "Bioquímica",      orderedBy: "Dr. Vaca",     orderedDate: "23 Abr", status: "ready",   result: "Glucosa: 185 mg/dL",                                  flag: "high"   },
  { id: "L003", patient: "Roberto Suárez",       ru: "220087341", test: "PCR para Dengue",         category: "Infectología",    orderedBy: "Dra. López",   orderedDate: "22 Abr", status: "ready",   result: "Resultado: NEGATIVO",                                  flag: "normal" },
  { id: "L004", patient: "María Calderón",       ru: "223019284", test: "Dengue IgG/IgM",          category: "Infectología",    orderedBy: "Dr. Ramos",    orderedDate: "22 Abr", status: "ready",   result: "IgM: Positivo · IgG: Negativo",                        flag: "critical"},
  { id: "L005", patient: "Luis Vaca Torrico",    ru: "219034821", test: "Perfil Lipídico",          category: "Bioquímica",      orderedBy: "Dra. López",   orderedDate: "22 Abr", status: "ready",   result: "LDL: 142 mg/dL · HDL: 48 mg/dL · TG: 180 mg/dL",     flag: "high"  },
  { id: "L006", patient: "Carla Méndez Ríos",   ru: "222045678", test: "Orina Completa",           category: "Urológico",       orderedBy: "Dr. Vaca",     orderedDate: "21 Abr", status: "pending", },
  { id: "L007", patient: "Diego Roca Parada",   ru: "220091234", test: "Rx Tórax PA",              category: "Imagenología",    orderedBy: "Dra. López",   orderedDate: "21 Abr", status: "pending", },
  { id: "L008", patient: "Sofía Gutiérrez",     ru: "221056789", test: "Espirometría",             category: "Neumológico",     orderedBy: "Dr. Ramos",    orderedDate: "20 Abr", status: "urgent",  result: "FEV1: 58% del esperado — Patrón obstructivo severo",   flag: "critical"},
  { id: "L009", patient: "Marcos León",          ru: "223012345", test: "Hemograma Completo",      category: "Hematología",     orderedBy: "Dra. López",   orderedDate: "20 Abr", status: "approved",result: "Sin alteraciones significativas.",                     flag: "normal" },
  { id: "L010", patient: "Patricia Soto",        ru: "220078901", test: "PCR para Dengue",         category: "Infectología",    orderedBy: "Dr. Vaca",     orderedDate: "19 Abr", status: "approved",result: "Resultado: NEGATIVO",                                  flag: "normal" },
];

const STATUS_CFG: Record<LabStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: "Pendiente",  color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  ready:    { label: "Listo",      color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  approved: { label: "Aprobado",   color: "#16A34A", bg: "#F0FDF4", border: "#86EFAC" },
  urgent:   { label: "Urgente",    color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5" },
};

const FLAG_CFG: Record<string, { label: string; color: string }> = {
  normal:   { label: "Normal",   color: "#16A34A" },
  high:     { label: "Alto",     color: "#D97706" },
  low:      { label: "Bajo",     color: "#2563EB" },
  critical: { label: "Crítico",  color: "#DC2626" },
};

const CATEGORIES = ["Todas", "Hematología", "Bioquímica", "Infectología", "Imagenología", "Urológico", "Neumológico"];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────
export default function LabCentral() {
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [approved, setApproved]       = useState<Set<string>>(new Set());
  const [filter, setFilter]           = useState<"all" | LabStatus>("all");
  const [category, setCategory]       = useState("Todas");
  const [detail, setDetail]           = useState<LabResult | null>(null);
  const [dropActive, setDropActive]   = useState(false);
  const [uploadedFiles, setUploaded]  = useState<string[]>([]);
  const [batchDone, setBatchDone]     = useState(false);
  const fileRef                       = useRef<HTMLInputElement>(null);

  // Derived
  const labs = MOCK_LABS.map(l => ({
    ...l,
    status: approved.has(l.id) ? "approved" as LabStatus : l.status,
  }));

  const filtered = labs.filter(l => {
    const statusOk = filter === "all" || l.status === filter;
    const catOk    = category === "Todas" || l.category === category;
    return statusOk && catOk;
  });

  const readyIds = filtered.filter(l => l.status === "ready").map(l => l.id);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const selectAllReady = () => {
    const allSelected = readyIds.every(id => selected.has(id));
    if (allSelected) {
      setSelected(prev => { const n = new Set(prev); readyIds.forEach(id => n.delete(id)); return n; });
    } else {
      setSelected(prev => { const n = new Set(prev); readyIds.forEach(id => n.add(id)); return n; });
    }
  };

  const approveSelected = () => {
    setApproved(prev => { const n = new Set(prev); selected.forEach(id => n.add(id)); return n; });
    setSelected(new Set());
    setBatchDone(true);
    setTimeout(() => setBatchDone(false), 3000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    const files = Array.from(e.dataTransfer.files).map(f => f.name);
    setUploaded(prev => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).map(f => f.name);
    setUploaded(prev => [...prev, ...files]);
  };

  const counts = {
    total:    labs.length,
    pending:  labs.filter(l => l.status === "pending").length,
    ready:    labs.filter(l => l.status === "ready").length,
    urgent:   labs.filter(l => l.status === "urgent").length,
    approved: labs.filter(l => l.status === "approved").length,
  };

  return (
    <div className={styles.wrap}>

      {/* ── HEADER ── */}
      <div className={styles.pageHeader}>
        <div>
          <h2>Laboratorio Central</h2>
          <p className={styles.subtitle}>Gestión masiva de exámenes · FUSUM Sede Central</p>
        </div>
        <div className={styles.statRow}>
          {[
            { label: "Total",    val: counts.total,    color: "var(--foreground)" },
            { label: "Listos",   val: counts.ready,    color: "var(--primary)"    },
            { label: "Urgentes", val: counts.urgent,   color: "var(--error)"      },
            { label: "Aprobados",val: counts.approved, color: "var(--success)"    },
          ].map(s => (
            <div key={s.label} className={styles.statChip}>
              <span className={styles.statVal} style={{ color: s.color }}>{s.val}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.body}>
        {/* ── LEFT: TABLE ── */}
        <div className={styles.tableCol}>

          {/* Filters */}
          <div className={styles.toolbar}>
            <div className={styles.filterGroup}>
              {(["all","pending","ready","urgent","approved"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`${styles.filterPill} ${filter === f ? styles.filterPillActive : ""}`}
                >
                  {f === "all" ? "Todos" : STATUS_CFG[f].label}
                </button>
              ))}
            </div>
            <select
              className={styles.catSelect}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Batch approve bar */}
          {selected.size > 0 && (
            <div className={styles.batchBar}>
              <span><strong>{selected.size}</strong> resultados seleccionados</span>
              <button className={styles.approveBtn} onClick={approveSelected}>
                <CheckCircle size={16} /> Aprobar grupo y notificar estudiantes
              </button>
            </div>
          )}

          {batchDone && (
            <div className={styles.successBanner}>
              <CheckCircle size={16} color="#16A34A" />
              Resultados aprobados y enviados a los teléfonos de los estudiantes.
            </div>
          )}

          {/* Table */}
          <div className={styles.table}>
            {/* Table header */}
            <div className={styles.tableHead}>
              <div style={{ width: 32 }}>
                <button className={styles.checkBtn} onClick={selectAllReady}>
                  {readyIds.every(id => selected.has(id)) && readyIds.length > 0
                    ? <CheckSquare size={16} color="var(--primary)" />
                    : <Square size={16} color="#94A3B8" />}
                </button>
              </div>
              <div style={{ flex: 2 }}>Paciente</div>
              <div style={{ flex: 2 }}>Examen</div>
              <div style={{ flex: 1 }}>Categoría</div>
              <div style={{ flex: 1 }}>Ordenado por</div>
              <div style={{ width: 80 }}>Fecha</div>
              <div style={{ width: 100 }}>Estado</div>
              <div style={{ width: 80 }}>Resultado</div>
            </div>

            {/* Rows */}
            {filtered.map(lab => {
              const cfg = STATUS_CFG[lab.status];
              const isSelectable = lab.status === "ready" || lab.status === "urgent";
              return (
                <div
                  key={lab.id}
                  className={`${styles.tableRow} ${lab.status === "urgent" ? styles.rowUrgent : ""}`}
                  onClick={() => setDetail(lab)}
                >
                  <div style={{ width: 32 }} onClick={e => e.stopPropagation()}>
                    {isSelectable && (
                      <button className={styles.checkBtn} onClick={() => toggleSelect(lab.id)}>
                        {selected.has(lab.id)
                          ? <CheckSquare size={16} color="var(--primary)" />
                          : <Square size={16} color="#94A3B8" />}
                      </button>
                    )}
                  </div>
                  <div style={{ flex: 2 }}>
                    <p className={styles.patName}>{lab.patient}</p>
                    <p className={styles.patRU}>RU: {lab.ru}</p>
                  </div>
                  <div style={{ flex: 2 }}>
                    <p className={styles.testName}>{lab.test}</p>
                    {lab.flag && lab.status !== "pending" && (
                      <span style={{ fontSize: 11, color: FLAG_CFG[lab.flag].color, fontWeight: 600 }}>
                        ● {FLAG_CFG[lab.flag].label}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, fontSize: 13, color: "#64748B" }}>{lab.category}</div>
                  <div style={{ flex: 1, fontSize: 13, color: "#64748B" }}>{lab.orderedBy}</div>
                  <div style={{ width: 80, fontSize: 13, color: "#64748B" }}>{lab.orderedDate}</div>
                  <div style={{ width: 100 }}>
                    <span className={styles.statusBadge} style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}>
                      {cfg.label}
                    </span>
                  </div>
                  <div style={{ width: 80 }}>
                    {lab.result && (
                      <button className={styles.viewBtn} onClick={e => { e.stopPropagation(); setDetail(lab); }}>
                        <FileText size={14} /> Ver
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: DROPZONE ── */}
        <aside className={styles.dropCol}>
          <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>
            Subir Evidencias / Imágenes
          </h2>
          <div
            className={`${styles.dropzone} ${dropActive ? styles.dropzoneActive : ""}`}
            onDragOver={e => { e.preventDefault(); setDropActive(true); }}
            onDragLeave={() => setDropActive(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={32} color={dropActive ? "var(--primary)" : "#94A3B8"} />
            <p className={styles.dropText}>Arrastra archivos PDF, JPG o DICOM aquí</p>
            <p className={styles.dropSub}>o haz click para seleccionar desde disco</p>
            <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFileInput} accept=".pdf,.jpg,.png,.dcm" />
          </div>

          {uploadedFiles.length > 0 && (
            <div className={styles.uploadedList}>
              <p className={styles.uploadedTitle}>Archivos listos para adjuntar:</p>
              {uploadedFiles.map((f, i) => (
                <div key={i} className={styles.uploadedItem}>
                  <FileText size={14} color="var(--primary)" />
                  <span>{f}</span>
                  <button className={styles.removeFile} onClick={() => setUploaded(prev => prev.filter((_, j) => j !== i))}>
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button className={styles.attachBtn}>
                <CheckCircle size={14} /> Adjuntar al EMR seleccionado
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ── DETAIL MODAL ── */}
      {detail && (
        <div className={styles.modalOverlay} onClick={() => setDetail(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 style={{ marginBottom: 4 }}>{detail.test}</h2>
                <p style={{ fontSize: 14, color: "#64748B" }}>{detail.patient} · RU {detail.ru}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setDetail(null)}><X size={20} /></button>
            </div>
            <div className={styles.modalBody}>
              {detail.status === "pending" ? (
                <div className={styles.pendingBox}>
                  <Clock size={32} color="#D97706" />
                  <p style={{ fontWeight: 600, marginTop: 12 }}>Examen en proceso</p>
                  <p style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>El laboratorio aún no ha despachado los resultados.</p>
                </div>
              ) : (
                <>
                  {detail.flag === "critical" && (
                    <div className={styles.criticalBanner}>
                      <AlertCircle size={18} color="#DC2626" />
                      <span>Resultado con valor crítico — requiere atención inmediata</span>
                    </div>
                  )}
                  <div className={styles.resultBox}>
                    <p className={styles.resultLabel}>Resultado</p>
                    <p className={styles.resultValue}>{detail.result}</p>
                  </div>
                  <div className={styles.modalMeta}>
                    <div><span>Categoría</span><strong>{detail.category}</strong></div>
                    <div><span>Ordenado por</span><strong>{detail.orderedBy}</strong></div>
                    <div><span>Fecha</span><strong>{detail.orderedDate}</strong></div>
                    <div><span>Indicador</span><strong style={{ color: detail.flag ? FLAG_CFG[detail.flag].color : "inherit" }}>{detail.flag ? FLAG_CFG[detail.flag].label : "—"}</strong></div>
                  </div>
                  <div className={styles.modalActions}>
                    {detail.status === "ready" || detail.status === "urgent" ? (
                      <button className={styles.approveBtn} onClick={() => {
                        setApproved(prev => new Set([...prev, detail.id]));
                        setDetail(null);
                      }}>
                        <CheckCircle size={16} /> Aprobar y Notificar Paciente
                      </button>
                    ) : null}
                    <button className={styles.downloadBtn}>
                      <Download size={16} /> Descargar PDF
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
