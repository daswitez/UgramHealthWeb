# Plan de Implementación y Decisiones - Módulo de Scheduling (Frontend)

En base al análisis del documento `02_SCHEDULING_NEXTJS.md` y la estructura actual de nuestro proyecto frontend, este es el plan de implementación y las adaptaciones necesarias para integrar correctamente el flujo de agendamiento (Scheduling).

## 1. Análisis del Estado Actual vs. Requerido

**Lo que tenemos:**
- Una base de rutas estructuradas bajo `src/app/` con módulos como `/admin`, `/patient`, `/dashboard`, etc.
- Un manejo inicial de contexto en `src/store/AuthContext.tsx`.
- Reglas de autenticación e identidad definidas (RBAC).

**Lo que falta adaptar/crear:**
- No existe el entorno exclusivo para las vistas del médico (falta la carpeta base `/doctor` y sus subrutas de scheduling).
- Falta la integración con el backend usando el token de autorización (Bearer Token) para interactuar con los nuevos endpoints del calendario y disponibilidad.
- Faltan componentes de UI para configurar la disponibilidad semanal y las restricciones institucionales, así como para el buscador de citas de pacientes.

## 2. Decisiones Arquitectónicas y Estructurales

Para integrar fluidamente el nuevo módulo de Scheduling y mantener la arquitectura limpia (Swiss Modernism 2.0 y separación de roles), se toman las siguientes decisiones:

1.  **Creación de las Rutas de Doctor:** Se debe estructurar la ruta `/app/doctor` para encapsular todas las vistas y el `layout.tsx` específico de este rol.
2.  **Manejo Global del "Readiness":** El estado de preparación del médico (`readyForPublishing`) no debe ser solo una vista, sino un componente global (como un `AlertBanner` o `Notice`) dentro del `layout.tsx` del `/doctor`, para que el sistema obligue visualmente al médico a completar su disponibilidad, duración de consulta y perfil antes de empezar a operar, apoyándose en la propiedad `missingRequirements`.
3.  **Encapsulamiento de API:** Las llamadas (GET, PUT, POST, DELETE) deben centralizarse en utilidades o *Server Actions* (ej. `src/services/schedulingService.ts` o similar) para asegurar la inyección automática del Header de `Authorization` y parsear el response envelope `{ success, data, message, timestamp }`.

## 3. Plan de Implementación (Orden de Flujo)

El flujo de trabajo se dividirá en 4 fases ordenadas lógicamente:

### Fase 1: Capa de Servicios y Componentes Base
- Crear funciones fetcher tipadas para interactuar con los endpoints descritos.
- Asegurar que el interceptor de peticiones u AuthContext pueda inyectar el token en las cabeceras a `http://localhost:8080/api/v1`.
- Crear componentes base de UI (Selectores de horas, Días de la semana Enum, Modales de confirmación) respetando la estética definida.

### Fase 2: Módulo del Médico (Configuración Core)
- **Settings:** Implementar `/doctor/schedule/settings` para que el médico configure la duración de su consulta (usando `GET` y `PUT /doctors/me/schedule-settings`).
- **Availability:** Implementar `/doctor/schedule/availability` permitiendo enviar el payload semanal exacto a `PUT /doctors/me/availability` (validando horas y evitando solapamientos desde la UI).
- **Readiness Alert:** Conectar `GET /doctors/me/schedule-readiness` al layout principal del doctor para mostrar advertencias de bloqueo hasta que la configuración esté completa.

### Fase 3: Excepciones y Restricciones (Bloqueos y Feriados)
- **Bloqueos del Doctor:** Implementar `/doctor/schedule/blocks` (CRUD) para manejar licencias médicas, vacaciones, etc. Usar el endpoint de bloques puntuales.
- **Calendario Institucional (Admin):** Implementar en el rol de administrador la ruta `/admin/calendar/holidays` para poder bloquear de manera global feriados totales o parciales institucionales. Se debe incluir un calendario visual para facilitar su uso.

### Fase 4: Vista del Paciente (Búsqueda de Slots)
- Implementar `/patient/appointments/search`.
- Construir una interfaz que envíe al backend el `doctorId` y el `date` usando `GET /appointments/slots`.
- Almacenar la respuesta y dibujar en la interfaz las franjas (slots) devueltas, permitiendo su selección.
- **Importante:** La lógica de cálculo de disponibilidad la confiaremos enteramente al backend (como se especifica); el frontend solo actuará como presentador de la información `slots`.

## 4. Próximos Pasos Técnicos Inmediatos
1. Crear el árbol de directorios `src/app/doctor/schedule/...`
2. Construir el componente global de chequeo de Readiness.
3. Crear el formulario de "Availability Semanal".
