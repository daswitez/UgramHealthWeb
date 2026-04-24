// generateHemograma.ts — PDF Hemograma Completo
// A4 Landscape, sin emojis ni Unicode especial, jsPDF puro

import { jsPDF } from "jspdf";

// ─── COLORES RGB ──────────────────────────────────────────────────────────────
const C = {
  blue:      [37,  99,  235] as [number,number,number],
  blueLt:    [219, 234, 254] as [number,number,number],
  red:       [185, 28,  28 ] as [number,number,number],
  redLt:     [254, 226, 226] as [number,number,number],
  green:     [21,  128, 61 ] as [number,number,number],
  greenLt:   [220, 252, 231] as [number,number,number],
  amber:     [180, 83,  9  ] as [number,number,number],
  amberLt:   [254, 243, 199] as [number,number,number],
  slate900:  [15,  23,  42 ] as [number,number,number],
  slate700:  [51,  65,  85 ] as [number,number,number],
  slate500:  [100, 116, 139] as [number,number,number],
  slate200:  [226, 232, 240] as [number,number,number],
  slate100:  [241, 245, 249] as [number,number,number],
  white:     [255, 255, 255] as [number,number,number],
};

interface Row { analito: string; valor: string; unidad: string; refMin: string; refMax: string; estado: "N"|"A"|"B"|"C"; }

const SERIES: { titulo: string; color: [number,number,number]; colorLt: [number,number,number]; filas: Row[] }[] = [
  {
    titulo: "SERIE ROJA — ERITROCITOS",
    color: C.red, colorLt: C.redLt,
    filas: [
      { analito: "Eritrocitos (RBC)",             valor: "4.82",  unidad: "mill./uL", refMin: "4.50", refMax: "5.90", estado: "N" },
      { analito: "Hemoglobina (HGB)",              valor: "13.2",  unidad: "g/dL",     refMin: "13.5", refMax: "17.5", estado: "B" },
      { analito: "Hematocrito (HCT)",              valor: "40.0",  unidad: "%",        refMin: "41.0", refMax: "53.0", estado: "B" },
      { analito: "VCM - Vol. Corpuscular Medio",   valor: "83.0",  unidad: "fL",       refMin: "80.0", refMax: "100.0",estado: "N" },
      { analito: "HCM - Hemoglobina Corpuscular",  valor: "27.4",  unidad: "pg",       refMin: "27.0", refMax: "33.0", estado: "N" },
      { analito: "CHCM - Conc. HGB Corpuscular",   valor: "33.0",  unidad: "g/dL",     refMin: "32.0", refMax: "36.0", estado: "N" },
      { analito: "ADE - Anisocitosis Eritrocit.",  valor: "13.8",  unidad: "%",        refMin: "11.5", refMax: "14.5", estado: "N" },
      { analito: "Reticulocitos",                  valor: "1.2",   unidad: "%",        refMin: "0.5",  refMax: "2.5",  estado: "N" },
    ],
  },
  {
    titulo: "SERIE BLANCA — LEUCOCITOS",
    color: C.blue, colorLt: C.blueLt,
    filas: [
      { analito: "Leucocitos totales (WBC)",        valor: "7.20", unidad: "mil/uL",   refMin: "4.50", refMax: "11.00",estado: "N" },
      { analito: "Neutrofilos %",                   valor: "62.5", unidad: "%",        refMin: "40.0", refMax: "75.0", estado: "N" },
      { analito: "Neutrofilos (valor absoluto)",    valor: "4.50", unidad: "mil/uL",   refMin: "1.80", refMax: "7.50", estado: "N" },
      { analito: "Linfocitos %",                    valor: "28.3", unidad: "%",        refMin: "20.0", refMax: "40.0", estado: "N" },
      { analito: "Linfocitos (valor absoluto)",     valor: "2.04", unidad: "mil/uL",   refMin: "1.00", refMax: "4.80", estado: "N" },
      { analito: "Monocitos %",                     valor: "6.8",  unidad: "%",        refMin: "2.0",  refMax: "10.0", estado: "N" },
      { analito: "Eosinofilos %",                   valor: "2.0",  unidad: "%",        refMin: "0.0",  refMax: "6.0",  estado: "N" },
      { analito: "Basofilos %",                     valor: "0.4",  unidad: "%",        refMin: "0.0",  refMax: "1.0",  estado: "N" },
    ],
  },
  {
    titulo: "PLAQUETAS — TROMBOCITOS",
    color: C.green, colorLt: C.greenLt,
    filas: [
      { analito: "Plaquetas (PLT)",                 valor: "210",  unidad: "mil/uL",   refMin: "150",  refMax: "400",  estado: "N" },
      { analito: "Vol. Medio Plaquetar (VMP)",       valor: "9.8",  unidad: "fL",       refMin: "7.5",  refMax: "12.5", estado: "N" },
      { analito: "Anisocitosis Plaquetar (ADP)",     valor: "16.2", unidad: "%",        refMin: "10.0", refMax: "17.9", estado: "N" },
    ],
  },
  {
    titulo: "FORMULA DIFERENCIAL MANUAL",
    color: C.slate700, colorLt: C.slate100,
    filas: [
      { analito: "Segmentados",     valor: "60", unidad: "%", refMin: "50", refMax: "70", estado: "N" },
      { analito: "Abastonados",     valor: "2",  unidad: "%", refMin: "0",  refMax: "5",  estado: "N" },
      { analito: "Linfocitos",      valor: "30", unidad: "%", refMin: "20", refMax: "40", estado: "N" },
      { analito: "Monocitos",       valor: "6",  unidad: "%", refMin: "2",  refMax: "10", estado: "N" },
      { analito: "Eosinofilos",     valor: "2",  unidad: "%", refMin: "0",  refMax: "6",  estado: "N" },
      { analito: "Basofilos",       valor: "0",  unidad: "%", refMin: "0",  refMax: "1",  estado: "N" },
    ],
  },
];

function estadoColor(e: Row["estado"]): [number,number,number] {
  if (e === "N") return C.green;
  if (e === "A") return C.amber;
  if (e === "B") return C.blue;
  return C.red;
}
function estadoLabel(e: Row["estado"]): string {
  if (e === "N") return "Normal";
  if (e === "A") return "ALTO";
  if (e === "B") return "BAJO";
  return "CRITICO";
}

export function generateHemogramaPDF(): void {
  // A4 landscape: 297 x 210 mm
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const PW = 297, PH = 210;
  const ML = 12, MR = 12, MT = 0;
  const CW = PW - ML - MR; // 273 mm usable width
  let y = MT;

  // ─── helpers ─────────────────────────────────────────────────────────
  const sf = (style: "normal"|"bold", size: number, rgb: [number,number,number] = C.slate900) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...rgb);
  };
  const fillRect = (x: number, yy: number, w: number, h: number, fill: [number,number,number]) => {
    doc.setFillColor(...fill);
    doc.rect(x, yy, w, h, "F");
  };
  const hLine = (yy: number, clr: [number,number,number] = C.slate200, lw = 0.25) => {
    doc.setDrawColor(...clr);
    doc.setLineWidth(lw);
    doc.line(ML, yy, PW - MR, yy);
  };

  // ═══════════════════════════════════════════════════════════════════
  //  HEADER BANNER
  // ═══════════════════════════════════════════════════════════════════
  fillRect(0, 0, PW, 28, C.blue);
  sf("bold", 17, C.white);
  doc.text("HEMOGRAMA COMPLETO — BIOMETRIA HEMATICA", ML + 2, 12);
  sf("normal", 9, [187, 215, 255] as unknown as [number,number,number]);
  doc.text("Analisis automatizado + Formula leucocitaria diferencial manual", ML + 2, 19);
  sf("bold", 8, C.white);
  doc.text("FUSUM – Centro Medico Universitario UAGRM  |  Codigo: HBC-L001-2026", ML + 2, 25);

  // Badge derecho
  fillRect(PW - 52, 4, 40, 20, [255,255,255] as unknown as [number,number,number]);
  sf("bold", 7, C.blue);
  doc.text("N. de Muestra", PW - 50, 11);
  sf("bold", 14, C.blue);
  doc.text("L001", PW - 50, 20);

  y = 32;

  // ═══════════════════════════════════════════════════════════════════
  //  INFO PACIENTE (2 columnas)
  // ═══════════════════════════════════════════════════════════════════
  fillRect(ML, y, CW, 30, C.slate100);
  doc.setDrawColor(...C.slate200);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 30, "S");

  const campos: [string, string][] = [
    ["Paciente",           "Juan Perez Gomez"],
    ["R.U.",               "220019283"],
    ["Carrera",            "Ingenieria Informatica"],
    ["Fecha de Nacimiento","15/03/2002"],
    ["Edad / Sexo",        "24 anos / Masculino"],
    ["Grupo Sanguineo",    "O+"],
    ["Medico solicitante", "Dra. Maria Lopez"],
    ["Toma de muestra",    "23 Abr 2026  07:45 AM"],
    ["Tipo de muestra",    "Sangre venosa periferica (EDTA)"],
    ["Fecha del informe",  "23 Abr 2026  09:30 AM"],
  ];

  const colCount = 5;
  const cellW = CW / colCount;
  campos.forEach(([label, val], i) => {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const cx = ML + col * cellW + 4;
    const cy = y + 8 + row * 13;
    sf("normal", 7, C.slate500);
    doc.text(label, cx, cy);
    sf("bold", 9, C.slate900);
    doc.text(val, cx, cy + 5);
  });

  y += 34;

  // ═══════════════════════════════════════════════════════════════════
  //  SERIES DE RESULTADOS — 2 COLUMNAS LADO A LADO
  // ═══════════════════════════════════════════════════════════════════
  // Columna izq: Serie Roja + Plaquetas
  // Columna der: Serie Blanca + Diferencial
  const halfW = CW / 2 - 3;
  const colX  = [ML, ML + halfW + 6];

  // Definimos grupos por columna
  const layout = [
    [SERIES[0], SERIES[2]], // izq: Roja + Plaquetas
    [SERIES[1], SERIES[3]], // der: Blanca + Diferencial
  ];

  // Columnas de la tabla (en mm, relativo al inicio de cada col)
  const TH = 7;  // row height
  const HDR = 8; // header height
  const SEC = 9; // section title height

  // Anchos de columna dentro de cada mitad
  const aW  = halfW * 0.40; // analito
  const vW  = halfW * 0.12; // valor
  const uW  = halfW * 0.15; // unidad
  const r1W = halfW * 0.10; // ref min
  const r2W = halfW * 0.10; // ref max
  const eW  = halfW * 0.13; // estado

  const drawTableHeader = (x: number, yy: number, w: number) => {
    fillRect(x, yy, w, HDR, C.slate200);
    sf("bold", 7, C.slate700);
    doc.text("ANALITO",         x + 3,       yy + 5.5);
    doc.text("RESULTADO",       x + aW + 2,  yy + 5.5);
    doc.text("UNIDAD",          x + aW + vW + 2, yy + 5.5);
    doc.text("REF MIN",         x + aW + vW + uW + 2, yy + 5.5);
    doc.text("REF MAX",         x + aW + vW + uW + r1W + 2, yy + 5.5);
    doc.text("ESTADO",          x + aW + vW + uW + r1W + r2W + 2, yy + 5.5);
  };

  const drawRow = (x: number, yy: number, w: number, row: Row, shade: boolean) => {
    if (shade) fillRect(x, yy, w, TH, C.slate100);
    // acento izquierdo
    const ec = estadoColor(row.estado);
    doc.setFillColor(...ec);
    doc.rect(x, yy, 2.5, TH, "F");

    sf("normal", 8, C.slate900);
    doc.text(row.analito,       x + 4,       yy + 5);
    sf("bold", 9, ec);
    doc.text(row.valor,         x + aW + 2,  yy + 5);
    sf("normal", 7.5, C.slate500);
    doc.text(row.unidad,        x + aW + vW + 2, yy + 5);
    doc.text(row.refMin,        x + aW + vW + uW + 2, yy + 5);
    doc.text(row.refMax,        x + aW + vW + uW + r1W + 2, yy + 5);

    // badge estado
    const el = estadoLabel(row.estado);
    const bw = el.length * 1.5 + 5;
    const bx = x + aW + vW + uW + r1W + r2W + 2;
    const by = yy + 1.5;
    const bh = TH - 3;
    if (row.estado === "N") { fillRect(bx, by, bw, bh, C.greenLt); }
    else if (row.estado === "A") { fillRect(bx, by, bw, bh, C.amberLt); }
    else if (row.estado === "B") { fillRect(bx, by, bw, bh, C.blueLt); }
    else { fillRect(bx, by, bw, bh, C.redLt); }
    sf("bold", 7, ec);
    doc.text(el, bx + 2, yy + 5);

    hLine(yy + TH, C.slate200, 0.2);
  };

  layout.forEach((seriesGroup, ci) => {
    const sx = colX[ci];
    let sy = y;

    seriesGroup.forEach((serie) => {
      const totalH = SEC + HDR + serie.filas.length * TH + 4;
      if (sy + totalH > PH - 22) { sy = y; } // no overflow en 1 pagina

      // Section title bar
      fillRect(sx, sy, halfW, SEC, serie.color);
      sf("bold", 8.5, C.white);
      doc.text(serie.titulo, sx + 4, sy + 6.5);
      sy += SEC;

      // Table header
      drawTableHeader(sx, sy, halfW);
      sy += HDR;

      // Rows
      serie.filas.forEach((fila, ri) => {
        drawRow(sx, sy, halfW, fila, ri % 2 !== 0);
        sy += TH;
      });

      sy += 5;
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  //  INTERPRETACION — banda inferior
  // ═══════════════════════════════════════════════════════════════════
  const interpY = PH - 34;
  fillRect(ML, interpY, CW, 14, C.amberLt);
  doc.setDrawColor(...C.amber);
  doc.setLineWidth(0.4);
  doc.rect(ML, interpY, CW, 14, "S");
  sf("bold", 8, C.amber);
  doc.text("INTERPRETACION CLINICA:", ML + 4, interpY + 6);
  sf("normal", 8, C.slate900);
  doc.text(
    "Hemoglobina (13.2 g/dL) y Hematocrito (40.0%) levemente bajo el limite inferior para sexo masculino. Compatible con anemia leve normocitica normocromica.",
    ML + 4, interpY + 10,
    { maxWidth: CW - 8 }
  );

  // Conclusion
  fillRect(ML, interpY + 14, CW, 12, C.blueLt);
  doc.setDrawColor(...C.blue);
  doc.setLineWidth(0.3);
  doc.rect(ML, interpY + 14, CW, 12, "S");
  sf("bold", 8, C.blue);
  doc.text("CONDUCTA SUGERIDA:", ML + 4, interpY + 20);
  sf("normal", 7.5, C.slate900);
  doc.text(
    "Solicitar perfil de hierro (ferremia, ferritina, TIBC). Control de hemograma en 30 dias. Valorar suplemento de hierro oral segun resultado. No requiere hospitalizacion.",
    ML + 4, interpY + 24,
    { maxWidth: CW - 8 }
  );

  // ═══════════════════════════════════════════════════════════════════
  //  FOOTER
  // ═══════════════════════════════════════════════════════════════════
  fillRect(0, PH - 8, PW, 8, C.slate100);
  sf("normal", 6.5, C.slate500);
  doc.text(
    "Informe de uso exclusivo medico. FUSUM – Universidad Autonoma Gabriel Rene Moreno (UAGRM).  |  Emitido el 23/04/2026 por Bioquim. Carlos Quispe  |  Pag. 1/1",
    ML, PH - 3,
    { maxWidth: CW }
  );
  // firma derecha
  sf("bold", 6.5, C.slate700);
  doc.text("Dra. Maria Lopez — MP-14512", PW - MR - 60, PH - 3);

  doc.save("Hemograma_220019283_L001.pdf");
}
