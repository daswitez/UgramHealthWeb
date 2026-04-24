"use client";

import React, { useState, useEffect } from "react";
import { X, TestTube, CheckCircle, Loader2, AlertTriangle, Search } from "lucide-react";
import styles from "./OrderModal.module.css";

// ─── LAB CATALOG ──────────────────────────────────────────────────────────────
const LAB_CATALOG = [
  {
    group: "Hematología",
    tests: [
      { id: "hbc", name: "Hemograma Completo (CBC)", turnaround: "2-4 hs" },
      { id: "hem", name: "Hematocrito y Hemoglobina", turnaround: "1-2 hs" },
      { id: "plq", name: "Recuento de Plaquetas", turnaround: "2 hs" },
      { id: "tp",  name: "Tiempo de Protrombina (TP/INR)", turnaround: "3 hs" },
      { id: "tpta", name: "Tiempo de Tromboplastina (TPTA)", turnaround: "3 hs" },
    ],
  },
  {
    group: "Bioquímica General",
    tests: [
      { id: "gluc", name: "Glucosa en Ayunas", turnaround: "1-2 hs" },
      { id: "urea", name: "Urea / BUN", turnaround: "2 hs" },
      { id: "crea", name: "Creatinina Sérica", turnaround: "2 hs" },
      { id: "acur", name: "Ácido Úrico", turnaround: "2 hs" },
      { id: "alt",  name: "Transaminasa ALT (TGP)", turnaround: "3 hs" },
      { id: "ast",  name: "Transaminasa AST (TGO)", turnaround: "3 hs" },
      { id: "bt",   name: "Bilirrubina Total y Fraccionada", turnaround: "3 hs" },
      { id: "prot", name: "Proteínas Totales y Albúmina", turnaround: "3 hs" },
    ],
  },
  {
    group: "Lípidos y Riesgo Cardiovascular",
    tests: [
      { id: "col",  name: "Colesterol Total", turnaround: "2 hs" },
      { id: "ldl",  name: "LDL Colesterol", turnaround: "2 hs" },
      { id: "hdl",  name: "HDL Colesterol", turnaround: "2 hs" },
      { id: "trig", name: "Triglicéridos", turnaround: "2 hs" },
    ],
  },
  {
    group: "Tiroides",
    tests: [
      { id: "tsh",  name: "TSH (Hormona Estimulante de Tiroides)", turnaround: "4-6 hs" },
      { id: "t3",   name: "T3 Libre", turnaround: "4-6 hs" },
      { id: "t4",   name: "T4 Libre", turnaround: "4-6 hs" },
    ],
  },
  {
    group: "Microbiología e Infecciosas",
    tests: [
      { id: "vdrl", name: "VDRL (Sífilis)", turnaround: "24 hs" },
      { id: "hiv",  name: "VIH (Prueba Rápida + Confirmatoria)", turnaround: "1-24 hs" },
      { id: "hbsag", name: "HBsAg (Hepatitis B)", turnaround: "4-6 hs" },
      { id: "hcv",  name: "Anti-HCV (Hepatitis C)", turnaround: "4-6 hs" },
      { id: "pcr",  name: "PCR (Proteína C Reactiva)", turnaround: "2 hs" },
      { id: "vsr",  name: "VSR / Velocidad de Sedimentación", turnaround: "2 hs" },
      { id: "dengue", name: "Dengue NS1 + IgG/IgM", turnaround: "2-4 hs" },
      { id: "malar", name: "Gota Gruesa (Malaria)", turnaround: "3-4 hs" },
    ],
  },
  {
    group: "Orina y Riñón",
    tests: [
      { id: "ea",   name: "Examen de Orina Completo (EGO)", turnaround: "1-2 hs" },
      { id: "cult", name: "Urocultivo + Antibiograma", turnaround: "48-72 hs" },
      { id: "mau",  name: "Microalbuminuria 24 hs", turnaround: "24 hs" },
    ],
  },
  {
    group: "Hormonas y Endocrinología",
    tests: [
      { id: "hcg",  name: "β-hCG (Prueba de Embarazo)", turnaround: "1-2 hs" },
      { id: "ins",  name: "Insulina en Ayunas", turnaround: "4 hs" },
      { id: "cort", name: "Cortisol Matutino", turnaround: "4-6 hs" },
    ],
  },
];

interface Props {
  patientName: string;
  onClose: () => void;
}

type Priority = "routine" | "urgent";
type Phase = "form" | "loading" | "success";

export default function LabOrderModal({ patientName, onClose }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [priority, setPriority] = useState<Priority>("routine");
  const [clinicalNote, setClinicalNote] = useState("");
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState<Phase>("form");

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filteredCatalog = LAB_CATALOG.map(group => ({
    ...group,
    tests: group.tests.filter(t =>
      search.length === 0 ||
      t.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(g => g.tests.length > 0);

  const allSelectedNames = LAB_CATALOG.flatMap(g => g.tests)
    .filter(t => selected.has(t.id))
    .map(t => t.name);

  const emit = () => {
    if (selected.size === 0) return;
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1800);
    setTimeout(() => onClose(), 3600);
  };

  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlay}>
      <div className={`${styles.modal} ${styles.modalLarge}`} role="dialog" aria-modal="true">

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className={styles.stateScreen}>
            <Loader2 size={48} className={styles.spinner} color="#2563EB" />
            <p className={styles.stateText}>Enviando orden al laboratorio…</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {phase === "success" && (
          <div className={styles.stateScreen}>
            <div className={styles.checkCircle}><CheckCircle size={52} color="#16A34A" /></div>
            <p className={styles.stateTitle}>Orden Enviada</p>
            <p className={styles.stateText}>
              {selected.size} examen{selected.size > 1 ? "es" : ""} solicitado{selected.size > 1 ? "s" : ""} para {patientName}
            </p>
            {priority === "urgent" && (
              <div className={styles.urgentBadge}>
                <AlertTriangle size={14} /> Prioridad URGENTE — Notificado al Lab
              </div>
            )}
          </div>
        )}

        {/* ── FORM ── */}
        {phase === "form" && (<>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitleRow}>
              <div className={styles.modalIcon} data-color="teal"><TestTube size={20} /></div>
              <div>
                <h2 className={styles.modalTitle}>Orden de Laboratorio</h2>
                <p className={styles.modalSubtitle}>Paciente: <strong>{patientName}</strong></p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
          </div>

          <div className={styles.labBody}>
            {/* LEFT: CATALOG */}
            <div className={styles.labCatalog}>
              {/* Search */}
              <div className={styles.labSearchWrap}>
                <Search size={14} className={styles.labSearchIcon} />
                <input
                  type="text"
                  className={styles.labSearch}
                  placeholder="Filtrar exámenes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Test groups */}
              <div className={styles.catalogList}>
                {filteredCatalog.map(group => (
                  <div key={group.group} className={styles.testGroup}>
                    <p className={styles.groupTitle}>{group.group}</p>
                    {group.tests.map(test => (
                      <label key={test.id} className={`${styles.testItem} ${selected.has(test.id) ? styles.testSelected : ""}`}>
                        <input
                          type="checkbox"
                          className={styles.testCheck}
                          checked={selected.has(test.id)}
                          onChange={() => toggle(test.id)}
                        />
                        <span className={styles.testName}>{test.name}</span>
                        <span className={styles.testTurnaround}>{test.turnaround}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: SUMMARY + OPTIONS */}
            <div className={styles.labSummary}>
              {/* Priority */}
              <div className={styles.priorityBlock}>
                <p className={styles.formLabel}>Prioridad</p>
                <div className={styles.priorityBtns}>
                  <button
                    className={`${styles.priorityBtn} ${priority === "routine" ? styles.priorityActive : ""}`}
                    onClick={() => setPriority("routine")}
                  >
                    🟢 Rutina
                  </button>
                  <button
                    className={`${styles.priorityBtn} ${styles.priorityUrgent} ${priority === "urgent" ? styles.priorityUrgentActive : ""}`}
                    onClick={() => setPriority("urgent")}
                  >
                    🔴 Urgente
                  </button>
                </div>
                {priority === "urgent" && (
                  <div className={styles.urgentWarning}>
                    <AlertTriangle size={13} />
                    Los resultados urgentes notificarán al médico en tiempo real.
                  </div>
                )}
              </div>

              {/* Selected Summary */}
              <div className={styles.selectedBlock}>
                <p className={styles.formLabel}>
                  Exámenes seleccionados ({selected.size})
                </p>
                {selected.size === 0 ? (
                  <p className={styles.emptySelected}>Selecciona exámenes del catálogo.</p>
                ) : (
                  <ul className={styles.selectedList}>
                    {allSelectedNames.map(name => (
                      <li key={name} className={styles.selectedItem}>
                        <span className={styles.selectedDot} />
                        {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Clinical Note */}
              <div className={styles.noteBlock}>
                <p className={styles.formLabel}>Nota clínica para el laboratorio</p>
                <textarea
                  className={styles.labNoteArea}
                  rows={3}
                  placeholder="Ej: Paciente en ayunas de 8 hs. Sospecha de anemia ferropénica. Comparar con CBC previo del 12 Abr."
                  value={clinicalNote}
                  onChange={e => setClinicalNote(e.target.value)}
                />
              </div>

              <button
                className={`${styles.emitBtn} ${priority === "urgent" ? styles.emitUrgent : ""}`}
                onClick={emit}
                disabled={selected.size === 0}
              >
                <TestTube size={16} />
                {priority === "urgent" ? "🚨 Enviar URGENTE" : "Enviar al Laboratorio"}
                {selected.size > 0 && ` (${selected.size})`}
              </button>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
}
