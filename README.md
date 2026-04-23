# 🏥 Ugram Health - Portal Web Administrativo
_El Ecosistema EMR (Electronic Medical Record) centralizado para la FUSUM._

Ugram Health Web es la bóveda administrativa diseñada exclusivamente en **Next.js + TypeScript** que maneja, orquesta y dirige todas las peticiones móviles de los usuarios y estudiantes de la UAGRM. 

Cuenta con estándares visuales **Swiss Modernism 2.0**, absteniéndose del desorden y priorizando la velocidad operativa de médicos de guardia mediante *CSS Vainilla*.

---

## 🚀 Inicio Rápido (Despliegue Local)

Asegúrate de contar con Node.js `20.x` o superior para garantizar que el motor de renderizado asíncrono no arroje alertas.

\`\`\`bash
# 1. Instalar las dependencias estrictas
npm install

# 2. Levantar el entorno de Desarrollo (Puerto 3000)
npm run dev

# 3. Compilación limpia para Producción (Caja de Salud)
npm run build && npm start
\`\`\`

---

## 🧠 Arquitectura de Módulos (En Desarrollo)

El Portal Web Administrativo restringe por completo el acceso a Estudiantes; su uso requiere verificación *Single Sign-On (SSO)* por correos de dominio institucional.

1. **Dashboard (Kanban-Grid):** *(WIP Sprint 2)* - Interface táctil para reprogramar turnos bajo formato *Drag and Drop* de lunes a viernes.
2. **Editor Clínico Split-View:** Formulario en pantalla doble con historial persistente para recetar a los estudiantes rápidamente mediante atajos.
3. **Caché Masivo Bio-Químico:** Lotes web para leer archivos PDF e inyectar decenas de resultados ecográficos directamente en los perfiles móviles de los usuarios en tiempo récord.

---

### 🛡️ Políticas de Estilo y CSS
Este proyecto tiene **estrictamente baneado el uso de frameworks CSS genéricos (TailwindCSS/Bootstrap)**.
Todas las operaciones estilísticas deben referirse primero al Token base en `/src/app/globals.css`. Todo componente debe diseñarse aislando el ruido bajo la filosofía de "Espacio en blanco curativo". Ver más en `DESIGN_SYSTEM.md`.

> Este software conforma la suite "Ugram Health".
> Creado para revolucionar el seguro clínico estudiantil.
