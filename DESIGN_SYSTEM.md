# Ugram Health: Design System & UX Guidelines
_Arquitectura Visual: Swiss Modernism 2.0 Adaptativo_

Este documento engloba todas las decisiones estéticas, cromáticas y de experiencia de usuario que conforman la identidad del proyecto **Ugram Health**. Debe ser consultado antes de introducir nuevos componentes a la plataforma.

---

## 🎨 1. Paleta Cromática (Color Tokens)
El alma visual del sistema radica en colores quirúrgicos, transmitiendo absoluta confianza, pero con destellos cálidos para no perder la cercanía humana, usando fondos amplios.

* **Fondo Principal (`colors.background`):** `#FFFFFF` (Blanco Puro). Da la sensación inmaculada de un consultorio recién limpio. Espacios negativos abismales.
* **Tinta Principal (`colors.primary`):** `#2563EB` (Royal Blue). Utilizado en botones primarios, badges de enfoque y estados de carga.
* **Textos Oscuros (`colors.textBase`):** `#1E293B` (Slate 800). Nunca usamos negro puro para evitar fatiga visual del doctor.
* **Textos Secundarios (`colors.textSecondary`):** `#64748B` (Slate 500). Para subtítulos, fechas y aclaraciones sutiles.
* **Superficies / Tarjetas (`colors.surfaceHover`):** `#F8FAFC` (Slate 50). Un gris casi imperceptible que da relieve 3D indirecto sin depender de sombras pesadas.

### Colores Semánticos (Alertas Médicas)
Nunca deben ser utilizados con fines decorativos. Tienen implicaciones biológicas:
* **Éxito / Confirmados (`colors.success`):** `#10B981` (Emerald). "Cita asignada", "Valores normales".
* **Peligro / Crónico (`colors.error` / `#DC2626`):** "Alergia Grave", "Cita Cancelada", "Emergencia".
* **Atención / Espera (`colors.warning`):** `#F59E0B` (Amber). Pacientes aguardando, pruebas en proceso.

---

## 🔤 2. Tipografía (Jerarquía)
La fuente oficial es **Inter** de Google Fonts. Su lectura limpia de palo seco acelera la lectura rápida de historiales médicos gigantescos en pantallas chiquitas.

1. **`h1` (Títulos Maestros):** Inter-Bold | 28px. (*Ej: "Ugram Health"*).
2. **`h2` (Títulos de Secciones):** Inter-SemiBold | 20px. (*Ej: "Agenda del Día", "Próximas Citas"*).
3. **`body` (Contenido de lectura):** Inter-Regular | 16px. El mínimo aceptable de la OMS para evitar miopía temporal en doctores que miran la app 8 horas al día.
4. **`label` (Metadatos):** Inter-Medium | 14px. Para horas de cita (09:30 AM) o estados.

---

## 📐 3. Radio y Estructuras (Shapes y Layouts)
Las curvas orgánicas dictan nuestra estructura. Ugram Health no utiliza bordes punzocortantes.

* **Tarjetas (`Cards`):** `borderRadius: 16`. Deben poseer bordes sutiles `borderWidth: 1, borderColor: '#E2E8F0'` y separar todo contenido ajeno.
* **Botones Básicos (`Buttons`):** `borderRadius: 12`. Botones gruesos (Min: 48px de altura) fáciles de tocar caminando apresurado en la clínica FUSUM.
* **Modales:** Curvas extremas (`borderRadius: 24` solo arriba) para elementos flotantes que surgen del piso engañando el visor 3D nativo celular (`animationType="slide"`).

---

## 🧠 4. Reglas de Experiencia de Usuario (UX)

#### Los Tres Tiempos del Flujo
1. **Empty States Obligatorios:** Jamás dejes una pantalla de la app en un vacío blanco profundo. Si no hay exámenes o no hay consultas, un `SVG` ilustrado animando a "Agendar cita" deberá inyectarse usando componentes de `<EmptyState />` estéticos (con borde de trazos curvos intermitentes).
2. **Estados No-Destructivos (Modales de Confirmación):** Cuando se toca "Crear Orden Médica" o "Confirmar Ficha", el OS te sumerge en una animación de `Loading Spinner` en overlay negro, seguido de un gigantesco check visual (`✓`) por 1.5s antes de eyectarte a la página nativa. **Se acabaron las transiciones abruptas**.
3. **Prevenir Amputaciones (Auto-Guards):** Todo TextField (`Input`) multilínea largo en la Ficha Médica requiere lógica de estado volátil `AsyncStorage`. El doctor debe poder cerrar la pestaña de forma accidental sin que la receta desaparezca de manera definitiva de su RAM local.
