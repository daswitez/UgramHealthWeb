# Frontend Next.js - Identity Admin y Login Enriquecido

## 1. Alcance

Este documento cubre lo nuevo y vigente en `identity` para consumo frontend:

- `POST /auth/login` con `userType`, `firstName`, `lastName` y `specialty` en `data`
- `POST /auth/refresh` con el mismo contrato enriquecido
- alta de staff por `ADMIN`
- listado de cuentas de staff
- detalle de cuenta de staff
- edición de cuenta de staff

No cubre:

- auto-registro de estudiante
- módulos de scheduling
- EMR
- laboratorio

## 2. Login Response (ya implementado)

El backend devuelve en `data`:

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userType": "ADMIN",
  "firstName": "Administrador",
  "lastName": "FUSUM",
  "specialty": null,
  "user": { "id": "USER_ID", "email": "...", ... }
}
```

**Valores válidos de `userType`:** `ADMIN`, `DOCTOR`, `STUDENT`, `LAB_TECH`, `RECEPTIONIST`

El frontend usa `data.userType` directamente para rutear sin llamar a `/profile`.

## 3. Staff CRUD (Admin)

| Método | Endpoint | Uso |
|---|---|---|
| `GET` | `/admin/users/staff` | Listar todo el personal |
| `POST` | `/admin/users/staff` | Crear nueva cuenta de staff |
| `GET` | `/admin/users/staff/{userId}` | Detalle de una cuenta |
| `PUT` | `/admin/users/staff/{userId}` | Editar una cuenta |

### Rutas frontend implementadas

- `/admin/staff` — tabla de personal
- `/admin/staff/new` — formulario de alta
- `/admin/staff/[userId]` — detalle + edición

### Reglas importantes

- `specialty` y `medicalLicense` solo aplican cuando `userType === "DOCTOR"`
- `active` es obligatorio en PUT
- el PUT no cambia `userType`
- `tempPassword` vuelve en la respuesta del POST como fallback operativo

## 4. Decisión: sin llamada extra a /profile

El frontend NO debe llamar a `/profile` para obtener el rol. El login ya incluye `userType`, `firstName`, `lastName` y `specialty`.
