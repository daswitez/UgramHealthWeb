"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Pill, Plus, Trash2, CheckCircle, Loader2, Search } from "lucide-react";
import styles from "./OrderModal.module.css";

// ─── DRUG CATALOG ────────────────────────────────────────────────────────────
const DRUG_CATALOG = [
  { name: "Amoxicilina 500mg", category: "Antibiótico" },
  { name: "Amoxicilina 250mg (Pediátrico)", category: "Antibiótico" },
  { name: "Azitromicina 500mg", category: "Antibiótico" },
  { name: "Ciprofloxacina 500mg", category: "Antibiótico" },
  { name: "Paracetamol 500mg", category: "Analgésico / Antipirético" },
  { name: "Paracetamol 1g", category: "Analgésico / Antipirético" },
  { name: "Ibuprofeno 400mg", category: "AINE" },
  { name: "Ibuprofeno 600mg", category: "AINE" },
  { name: "Diclofenaco 75mg (IM)", category: "AINE" },
  { name: "Salbutamol 100mcg (Inhalador)", category: "Broncodilatador" },
  { name: "Budesonida 200mcg (Inhalador)", category: "Corticoesteroide Inhalado" },
  { name: "Loratadina 10mg", category: "Antihistamínico" },
  { name: "Cetirizina 10mg", category: "Antihistamínico" },
  { name: "Metformina 850mg", category: "Antidiabético Oral" },
  { name: "Enalapril 10mg", category: "Antihipertensivo" },
  { name: "Losartán 50mg", category: "Antihipertensivo" },
  { name: "Omeprazol 20mg", category: "Protector Gástrico" },
  { name: "Ranitidina 150mg", category: "Protector Gástrico" },
  { name: "Metoclopramida 10mg", category: "Antiemético" },
  { name: "Dimenhidrinato 50mg", category: "Antiemético" },
  { name: "Loperamida 2mg", category: "Antidiarreico" },
  { name: "Vitamina C 500mg", category: "Suplemento" },
  { name: "Complejo B", category: "Suplemento" },
  { name: "Sales de Rehidratación Oral", category: "Electrolitos" },
  { name: "Prednisona 20mg", category: "Corticoesteroide" },
  { name: "Dexametasona 4mg", category: "Corticoesteroide" },
];

const FREQUENCIES = [
  "Cada 4 horas", "Cada 6 horas", "Cada 8 horas",
  "Cada 12 horas", "Una vez al día", "Dos veces al día",
  "Tres veces al día", "Según necesidad (SOS)", "Con las comidas",
];

const DURATIONS = [
  "3 días", "5 días", "7 días", "10 días", "14 días",
  "21 días", "30 días", "Tratamiento continuo",
];

const ROUTES = ["Oral", "Inhalada", "Intramuscular (IM)", "Intravenosa (IV)", "Tópica", "Sublingual"];

interface Drug {
  id: string;
  name: string;
  category: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  notes: string;
}

interface Props {
  patientName: string;
  onClose: () => void;
}

type Phase = "form" | "loading" | "success";

export default function PrescriptionModal({ patientName, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<typeof DRUG_CATALOG[0] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [route, setRoute] = useState("Oral");
  const [notes, setNotes] = useState("");
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [phase, setPhase] = useState<Phase>("form");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const filtered = DRUG_CATALOG.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8);

  const selectDrug = (drug: typeof DRUG_CATALOG[0]) => {
    setSelectedDrug(drug);
    setSearch(drug.name);
    setShowDropdown(false);
  };

  const addDrug = () => {
    if (!selectedDrug || !dose || !frequency || !duration) return;
    setDrugs(prev => [...prev, {
      id: crypto.randomUUID(),
      name: selectedDrug.name,
      category: selectedDrug.category,
      dose, frequency, duration, route, notes,
    }]);
    setSelectedDrug(null);
    setSearch(""); setDose(""); setFrequency(""); setDuration(""); setRoute("Oral"); setNotes("");
  };

  const removeDrug = (id: string) => setDrugs(prev => prev.filter(d => d.id !== id));

  const emit = () => {
    if (drugs.length === 0) return;
    setPhase("loading");
    setTimeout(() => setPhase("success"), 1600);
    setTimeout(() => onClose(), 3400);
  };

  // ── OVERLAY CLICK ──
  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">

        {/* ── LOADING ── */}
        {phase === "loading" && (
          <div className={styles.stateScreen}>
            <Loader2 size={48} className={styles.spinner} color="#2563EB" />
            <p className={styles.stateText}>Emitiendo receta médica…</p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {phase === "success" && (
          <div className={styles.stateScreen}>
            <div className={styles.checkCircle}><CheckCircle size={52} color="#16A34A" /></div>
            <p className={styles.stateTitle}>Receta Emitida</p>
            <p className={styles.stateText}>
              {drugs.length} medicamento{drugs.length > 1 ? "s" : ""} prescrito{drugs.length > 1 ? "s" : ""} para {patientName}
            </p>
          </div>
        )}

        {/* ── FORM ── */}
        {phase === "form" && (<>
          <div className={styles.modalHeader}>
            <div className={styles.modalTitleRow}>
              <div className={styles.modalIcon} data-color="blue"><Pill size={20} /></div>
              <div>
                <h2 className={styles.modalTitle}>Prescripción de Medicamentos</h2>
                <p className={styles.modalSubtitle}>Paciente: <strong>{patientName}</strong></p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
          </div>

          <div className={styles.modalBody}>
            {/* DRUG SEARCH */}
            <div className={styles.formSection}>
              <p className={styles.formLabel}>Buscar Medicamento *</p>
              <div className={styles.searchWrap}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  ref={searchRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Ej: Amoxicilina, Salbutamol, Paracetamol…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDropdown(true); setSelectedDrug(null); }}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && search.length > 0 && filtered.length > 0 && (
                  <div className={styles.dropdown}>
                    {filtered.map(d => (
                      <button key={d.name} className={styles.dropdownItem} onMouseDown={() => selectDrug(d)}>
                        <span className={styles.drugName}>{d.name}</span>
                        <span className={styles.drugCategory}>{d.category}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedDrug && (
                <div className={styles.selectedBadge}>
                  ✓ <strong>{selectedDrug.name}</strong> — {selectedDrug.category}
                </div>
              )}
            </div>

            {/* DOSE + ROUTE */}
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <p className={styles.formLabel}>Dosis *</p>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Ej: 1 comprimido, 2 puffs, 5ml…"
                  value={dose}
                  onChange={e => setDose(e.target.value)}
                />
              </div>
              <div className={styles.formCol}>
                <p className={styles.formLabel}>Vía de Administración</p>
                <select className={styles.formSelect} value={route} onChange={e => setRoute(e.target.value)}>
                  {ROUTES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* FREQUENCY + DURATION */}
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <p className={styles.formLabel}>Frecuencia *</p>
                <select className={styles.formSelect} value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="">Seleccionar frecuencia…</option>
                  {FREQUENCIES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className={styles.formCol}>
                <p className={styles.formLabel}>Duración *</p>
                <select className={styles.formSelect} value={duration} onChange={e => setDuration(e.target.value)}>
                  <option value="">Seleccionar duración…</option>
                  {DURATIONS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* NOTES */}
            <div className={styles.formSection}>
              <p className={styles.formLabel}>Indicaciones especiales</p>
              <textarea
                className={styles.formTextarea}
                rows={2}
                placeholder="Ej: Tomar con alimentos. Evitar alcohol. No romper el comprimido."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* ADD BTN */}
            <button
              className={styles.addBtn}
              onClick={addDrug}
              disabled={!selectedDrug || !dose || !frequency || !duration}
            >
              <Plus size={16} /> Agregar a la Receta
            </button>

            {/* DRUG LIST */}
            {drugs.length > 0 && (
              <div className={styles.drugList}>
                <p className={styles.formLabel}>Medicamentos en esta receta ({drugs.length})</p>
                {drugs.map((d, i) => (
                  <div key={d.id} className={styles.drugEntry}>
                    <div className={styles.drugNum}>{i + 1}</div>
                    <div className={styles.drugInfo}>
                      <p className={styles.drugEntryName}>{d.name}</p>
                      <p className={styles.drugEntryDetail}>
                        {d.dose} · {d.route} · {d.frequency} · {d.duration}
                      </p>
                      {d.notes && <p className={styles.drugEntryNotes}>{d.notes}</p>}
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeDrug(d.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button
              className={styles.emitBtn}
              onClick={emit}
              disabled={drugs.length === 0}
            >
              <Pill size={16} />
              Emitir Receta ({drugs.length} medicamento{drugs.length !== 1 ? "s" : ""})
            </button>
          </div>
        </>)}
      </div>
    </div>
  );
}
