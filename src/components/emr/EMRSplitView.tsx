"use client";

import React, { useState, useRef, useCallback } from "react";
import { AlertCircle, Clock, FileText, ChevronDown, ChevronUp, Pill, TestTube, Save, CheckCircle } from "lucide-react";
import styles from "./EMRSplitView.module.css";
import PrescriptionModal from "./PrescriptionModal";
import LabOrderModal from "./LabOrderModal";

// ─── MOCK PATIENT DATA ───────────────────────────────────────────────
const PATIENT = {
  name: "Juan Pérez Gómez",
  dob: "15 Mar 2002",
  ru: "220019283",
  career: "Ingeniería Informática",
  bloodType: "O+",
  allergies: ["Penicilina (Choque Anafiláctico)", "Ibuprofeno"],
  chronic: ["Asma Bronquial", "Rinitis Alérgica"],
  history: [
    { date: "12 Abr 2026", diagnosis: "Crisis asmática leve. Salbutamol 100mcg + reposo 48h.", doctor: "Dra. María López" },
    { date: "22 Feb 2026", diagnosis: "Rinitis estacional. Loratadina 10mg por 7 días.", doctor: "Dr. Carlos Vaca" },
    { date: "11 Ene 2026", diagnosis: "Control de rutina. Sin hallazgos significativos.", doctor: "Dra. María López" },
  ],
  vitals: [
    { label: "Presión Arterial", values: ["115/72", "120/78", "118/75", "122/80", "116/74"] },
    { label: "Temperatura", values: ["36.4°", "36.8°", "37.0°", "36.6°", "36.5°"] },
    { label: "Frecuencia Cardíaca", values: ["72bpm", "68bpm", "74bpm", "70bpm", "71bpm"] },
  ],
};

const SNIPPETS: Record<string, string> = {
  "/asma":    "Diagnóstico: Crisis asmática leve.\nPlan: Salbutamol 100mcg (2 puffs c/6h × 5 días). Reposo relativo 48h. Evitar exposición a alérgenos. Control en 1 semana.",
  "/rinitis": "Diagnóstico: Rinitis alérgica estacional.\nPlan: Loratadina 10mg (1 vez/día × 7 días). Lavados nasales con SSF. Evitar polvo y cambios bruscos de temperatura.",
  "/gripe":   "Diagnóstico: Síndrome gripal leve.\nPlan: Paracetamol 500mg (c/8h según fiebre). Hidratación abundante. Reposo 3 días. Retornar si persiste más de 5 días.",
  "/control": "Diagnóstico: Control médico de rutina.\nHallazgos: Sin patología significativa al momento de la evaluación. Signos vitales dentro de parámetros normales.",
};

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function EMRSplitView() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [showSnippets, setShowSnippets] = useState(false);
  const [expandHistory, setExpandHistory] = useState(true);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Modal state
  const [showPrescription, setShowPrescription] = useState(false);
  const [showLabOrder, setShowLabOrder] = useState(false);

  // Snippet detection
  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    setSaved(false);
    setShowSnippets(false);

    const lastWord = val.split(/\s/).pop() || "";
    if (lastWord.startsWith("/") && lastWord.length > 1) {
      setShowSnippets(true);
    }
  }, []);

  const applySnippet = (key: string) => {
    const lastSlash = note.lastIndexOf("/");
    const base = note.slice(0, lastSlash);
    setNote(base + SNIPPETS[key]);
    setShowSnippets(false);
    textRef.current?.focus();
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const matchingSnippets = Object.keys(SNIPPETS).filter(k =>
    note.split(/\s/).pop()?.startsWith("/") && k.includes(note.split(/\s/).pop() || "")
  );

  return (
    <div className={styles.splitWrap}>
      {/* ──────────── LEFT PANEL: PATIENT HISTORY ──────────── */}
      <aside className={styles.leftPanel}>
        
        {/* Patient Header */}
        <div className={styles.patientHeader}>
          <div className={styles.avatar}>{PATIENT.name.split(" ").map(w => w[0]).slice(0,2).join("")}</div>
          <div>
            <h2 className={styles.patientName}>{PATIENT.name}</h2>
            <p className={styles.patientMeta}>RU: {PATIENT.ru} · {PATIENT.career}</p>
            <p className={styles.patientMeta}>Nac: {PATIENT.dob} · Sangre: <strong>{PATIENT.bloodType}</strong></p>
          </div>
        </div>

        {/* ALERT BLOCK */}
        <div className={styles.alertBlock}>
          <div className={styles.alertTitle}>
            <AlertCircle size={16} color="#DC2626" />
            <span>Alertas Médicas Críticas</span>
          </div>
          <div className={styles.alertSection}>
            <p className={styles.alertLabel}>🚨 Alergias</p>
            {PATIENT.allergies.map(a => (
              <div key={a} className={styles.alertPill}>{a}</div>
            ))}
          </div>
          <div className={styles.alertSection}>
            <p className={styles.alertLabel}>🩺 Enfermedades Crónicas</p>
            {PATIENT.chronic.map(c => (
              <div key={c} className={styles.alertPill}>{c}</div>
            ))}
          </div>
        </div>

        {/* VITALS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Signos Vitales (últimas 5 consultas)</h2>
          <div className={styles.vitalsGrid}>
            {PATIENT.vitals.map(v => (
              <div key={v.label} className={styles.vitalCard}>
                <p className={styles.vitalLabel}>{v.label}</p>
                <div className={styles.vitalValues}>
                  {v.values.map((val, i) => (
                    <span key={i} className={styles.vitalVal}>{val}</span>
                  ))}
                </div>
                <p className={styles.vitalCurrent}>{v.values[v.values.length - 1]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className={styles.section}>
          <button className={styles.sectionToggle} onClick={() => setExpandHistory(h => !h)}>
            <span className={styles.sectionTitle}>Historial Clínico</span>
            {expandHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandHistory && (
            <div className={styles.historyList}>
              {PATIENT.history.map((h, i) => (
                <div key={i} className={styles.historyEntry}>
                  <div className={styles.historyDot} />
                  <div className={styles.historyContent}>
                    <div className={styles.historyHeader}>
                      <span className={styles.historyDate}><Clock size={11} /> {h.date}</span>
                      <span className={styles.historyDoctor}>{h.doctor}</span>
                    </div>
                    <p className={styles.historyDiagnosis}>{h.diagnosis}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ──────────── RIGHT PANEL: EDITOR ──────────── */}
      <main className={styles.rightPanel}>
        <div className={styles.editorHeader}>
          <div>
            <h2>Nueva Nota Clínica</h2>
            <p className={styles.editorSubtitle}>
              <FileText size={13} /> Consulta · {new Date().toLocaleDateString("es-BO", { dateStyle: "long" })}
            </p>
          </div>
          <div className={styles.editorActions}>
            {saved && (
              <span className={styles.savedIndicator}>
                <CheckCircle size={14} color="#16A34A" /> Guardado
              </span>
            )}
            <button className={styles.saveBtn} onClick={handleSave}>
              <Save size={16} />
              Guardar Ficha
            </button>
          </div>
        </div>

        {/* SNIPPET HINT */}
        <div className={styles.snippetHint}>
          💡 Escribe <code>/asma</code>, <code>/rinitis</code>, <code>/gripe</code> o <code>/control</code> para insertar una plantilla.
        </div>

        {/* TEXTAREA + SNIPPET MENU */}
        <div className={styles.textAreaWrap}>
          <textarea
            ref={textRef}
            className={styles.editor}
            placeholder="Redacta aquí la anamnesis, diagnóstico y plan de tratamiento del paciente..."
            value={note}
            onChange={handleNoteChange}
          />
          {showSnippets && matchingSnippets.length > 0 && (
            <div className={styles.snippetMenu}>
              {matchingSnippets.map(key => (
                <button key={key} className={styles.snippetOption} onClick={() => applySnippet(key)}>
                  <span className={styles.snippetKey}>{key}</span>
                  <span className={styles.snippetPreview}>{SNIPPETS[key].slice(0, 60)}…</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* QUICK ACTIONS */}
        <div className={styles.quickActions}>
          <p className={styles.quickLabel}>Órdenes Rápidas</p>
          <div className={styles.quickBtns}>
            <button className={styles.quickBtn} onClick={() => setShowLabOrder(true)}>
              <TestTube size={15} />
              Orden de Laboratorio
            </button>
            <button className={`${styles.quickBtn} ${styles.quickBtnPrimary}`} onClick={() => setShowPrescription(true)}>
              <Pill size={15} />
              Prescribir Medicamento
            </button>
          </div>
        </div>
      </main>

      {/* ── MODALS ── */}
      {showPrescription && (
        <PrescriptionModal
          patientName={PATIENT.name}
          onClose={() => setShowPrescription(false)}
        />
      )}
      {showLabOrder && (
        <LabOrderModal
          patientName={PATIENT.name}
          onClose={() => setShowLabOrder(false)}
        />
      )}
    </div>
  );
}
