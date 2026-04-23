# Backlog de Producto: Ugram Health Web Portal
_Ecosistema Desktop para Médicos, Doctores y Administración de Clínicas (FUSUM)._

Este entorno utilizará Next.js con una arquitectura inmensamente robusta y puritana, guiada por el **Swiss Modernism 2.0**.

---

## 🏃 Sprint W1: Foundation Cimientos y Autenticación (P1)
_La base del muro administrativo. Despliegue de layout puritano y seguridad._

- [ ] **HW-01:** Configuración de `globals.css` con tokens maestros estipulados en `DESIGN_SYSTEM.md`. Limpieza de Tailwind y código repetitivo.
- [ ] **HW-02:** Armado de Estructura Administrativa (Root Layout): `Sidebar` lateral izquierdo colapsable oscuro, Navbar superior con "Buscador Global" de estudiantes.
- [ ] **HW-03:** Pantalla de Login Institucional: Ingreso restringido biológico/SSO para doctores (no OTP móvil). Integrar estado básico global.

---

## 🏃 Sprint W2: The "Kanban" Grid - Agenda Maestra (P2)
_Abandono del modelo lineal telefónico por un control masivo de calendario semanal._

- [ ] **HW-04:** Integración de la vista "Semana Completa". Diseño en grilla (Lunes a Viernes). Tarjetas comprimidas con nombre, hora y estado de la cita.
- [ ] **HW-05:** Filtros Clínicos Superiores: Botonera nativa para cambiar qué citas veo (e.j., "Solo Urgencias", "Odontología", "Dr. López").
- [ ] **HW-06:** Reprogramación Inteligente (Drag & Drop UI): Permitir agarrar una cita con el mouse y arrastrarla a un slot disponible el Miércoles e invocar modal "Confirmar re-ajuste".

---

## 🏃 Sprint W3: EMR (Electronic Medical Record) Split View (P3)
_El corazón del diagnóstico PC. Escritura y lectura analítica a doble pantalla._

- [ ] **HW-07:** Implementación de Ficha Clínica. Lado Izquierdo: Línea de tiempo densa scrolleable con historial cronológico, botones de "Ver recetario" guardado, Alergias en rojo masivo.
- [ ] **HW-08:** Implementación de Ficha Clínica. Lado Derecho: Editor Rich Text para que el médico tipee fluidamente sus anamnesis y los diagnósticos pre-aprobados.
- [ ] **HW-09:** Atajos / Snippets de teclado: Programar macro básico para que al teclear `/`, salte un menú contextual con plantillas pregrabadas.

---

## 🏃 Sprint W4: Integraciones Batch y Laboratorio Masivo (P4)
_Liberando cuellos de botella en informes para el paciente estudiantil._

- [ ] **HW-10:** Vista "Laboratorio Central". Tabla infinita (DataGrid) con exámenes emitidos y pendientes de los estudiantes, agrupados por Doctor de origen.
- [ ] **HW-11:** Aprobación por Lotes: Capacidad de marcar `[x] [x] [x]` en 20 resultados negativos de Dengue y darle "Aprobar Grupo", disparando cambios para los alumnos.
- [ ] **HW-12:** Dropzone de Evidencias: Cajón de subir archivos arrastrando `.pdf` de Ecografías / Rayos X desde la computadora para atarlo directo al EMR del universitario.
