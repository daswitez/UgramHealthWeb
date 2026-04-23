# Ugram Health: Portal Web Administrativo / Clínico
_Especificaciones Arquitectónicas (Solo Médico)_

Mientras que la App Móvil de UgramHealth priorizó a los Estudiantes y herramientas sobre-la-marcha para los Doctores, el **Portal Web (ugram-health-web)** debe diseñarse de forma exclusiva y tiránica como un ecosistema clínico Desktop High-Performance.

Este entorno **no existirá** para los estudiantes. Solo permite inicio de sesión a credenciales de la Caja FUSUM/Médicos.

---

## 🏥 1. Autenticación Restringida de Alto Nivel
A diferencia del OTP rápido del celular, el ingreso Web de escritorio deberá ser cerrado.
* **Login Biométrico / Entra ID:** Uso de SSO (Single Sign-On) atado directo al tenant general `@uagrm.edu.bo`. 
* **Control de Autorización (RBAC):** La web tendrá roles. `Médico General`, `Doctor Especialista`, y un rol que en móvil no existía: `Recepcionista / Triage` (Administrativos de FUSUM que manejan inventarios pero no pueden ver el campo "Diagnóstico" cifrado).

---

## 📅 2. El Módulo "Kanban-Calendar" de Agenda Completa
La web supera las limitaciones de espacio móvil. En la web el listado de tarjetas se destruye; bienvenido el formato **Grilla (Grid)**.
* **Librería Core:** Implementación de algo como `FullCalendar` en modo Semana/Mes completo.
* **Drafting de Horarios (Drag & Drop):** En la web, el médico podrá tomar al paciente *Juan Pérez* (bloque de 9:00 AM) y, arrastrando el ratón en la pantalla web, soltarlo sobre las 11:30 AM enviando automáticamente a la arquitectura de la nube la replanificación de hora, impactando el móvil en tiempo real.
* **Filtros Compuestos:** El dashboard tendrá una barra inmensa arriba para mutar agendas: `[Ver Todas las Citas] | [Ver solo Urgencias] | [Ver solo Dermatología]`.

---

## 📋 3. Electronic Medical Record (EMR) Superlativo
El "Formulario de Ficha Clínica" del móvil es muy básico. La Web alojará el Verdadero Monstruo.
Hablaremos de un esquema de **Pantalla Dividida (Split View):**
1. **Lado Izquierdo Lector (40% de patalla):**
   * Panel scrolleable que recarga APIs en bucle infinito. 
   * Árbol de Alergias, Patologías Crónicas de forma gigante. 
   * **Gráficas de Evolución:** (Ej: Gráficas de líneas Chart.js con la Presión Arterial reportada el último semestre para ver curvas y promedios).
2. **Lado Derecho Escritor (60% de pantalla):**
   * El formulario de diagnóstico muta de ser un simple campo a un Rich Text Editor (Markdown).
   * **Plantillas Rápidas (Snippets):** El médico podría guardar templates. Escribe `/asma` en el teclado y el lado derecho autocompleta con todo el tratamiento oficial para asma estándar que tiene UAGRM asignado, permitiendo prescribir en 4 segundos.

---

## 🔬 4. El Laboratorio (Central Desk)
Una característica puramente de PC ausente en móviles.
* **Dashboard Batch-Approval:** Herramienta Web para observar decenas de resultados de test sanguíneos despachados desde laboratorios internos y marcar `[x] Aprobar Grupo`, firmando e impactando los teléfonos móviles masivos de estudiantes que estaban suplicando actualizaciones en su "LabResultsScreen".
* **Arrastrar y Soltar PDF:** Dropzone inmenso de lectura del disco de computadora para subir los resultados de ecoscopias o placas directas del hardware del ecógrafo del campus y publicarlo al perfil web del Estudiante instantáneamente.

---

## 📊 5. Panel de Analíticas Universitarias (Epidemiología)
Al tener a mano el poder de una PC, el Directorio del FUSUM accederá a este mapa directivo:
- **Mapas de Calor Clínicos:** Analizar la demanda de atenciones "Odontológicas" vs "Generales" mediante Data Tables gigantescas en `.xlsx`.
- Si existen "Brote de Dengue" o "Faringitis", el sistema traza curvas de campana sobre los alumnos que han asistido indicando con banderas amarillas posibles aislamientos universitarios automáticos.

> [!IMPORTANTE]  
> Toda esta arquitectura web debe conservar íntegramente de extremo a extremo las variables UI declaradas en el `DESIGN_SYSTEM.md`. Jamás usar otra tipografía que no sea **Inter** y respetar el "Azul Royal" (`#2563EB`) para seguir extendiendo la sensación clínica corporativa UAGRM. 
