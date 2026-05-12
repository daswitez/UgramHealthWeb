import React from "react";

interface TimeSelectorProps {
  label: string;
  value: string; // HH:mm
  onChange: (val: string) => void;
  required?: boolean;
}

export default function TimeSelector({ label, value, onChange, required = false }: TimeSelectorProps) {
  // Genera opciones de tiempo en intervalos de 30 minutos (00:00 - 23:30)
  const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const min = m.toString().padStart(2, "0");
        times.push(`${hour}:${min}`);
      }
    }
    return times;
  };

  const options = generateTimeOptions();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--foreground)" }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
          color: "var(--foreground)",
          fontSize: "14px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="" disabled>Seleccione...</option>
        {options.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}
