const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// === Tipos Base ===

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export interface WeeklySlot {
  id?: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" o "HH:mm:ss"
  endTime: string;
}

export interface ScheduleSettings {
  doctorUserId: string;
  appointmentDurationMinutes: number;
  configured: boolean;
}

export interface ScheduleReadiness {
  doctorUserId: string;
  profileComplete: boolean;
  weeklyAvailabilityConfigured: boolean;
  scheduleSettingsConfigured: boolean;
  readyForPublishing: boolean;
  missingRequirements: string[];
}

export interface DoctorBlock {
  id?: string;
  doctorUserId?: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  reason: string;
}

export interface Holiday {
  id?: string;
  date: string;
  type: "TOTAL" | "PARTIAL";
  startTime?: string;
  endTime?: string;
  reason: string;
}

export interface AppointmentSlot {
  startAt: string; // ISO DateTime
  endAt: string;
}

export interface SlotsResponse {
  doctorId: string;
  date: string;
  appointmentDurationMinutes: number;
  readyForPublishing: boolean;
  slots: AppointmentSlot[];
}

// === Funciones Fetcher Core ===

async function fetchWithAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  // Fallback dev token if empty (so UI doesn't break entirely if testing without backend login)
  const actualToken = token || "DEV_DUMMY_TOKEN"; 

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${actualToken}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  const text = await response.text();
  let data;
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: El servidor no devolvió un JSON válido.`);
      }
      throw new Error(`Error parseando respuesta JSON del servidor: ${error}`);
    }
  } else {
    // Si la respuesta está vacía (ej. 204 No Content o un 401 vacío)
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Respuesta vacía del servidor.`);
    }
    // Emular un success object para mantener los tipos
    return { success: true, message: "OK", data: null, timestamp: new Date().toISOString() } as unknown as ApiResponse<T>;
  }

  // Si no es un estatus OK, y el servidor envía su propio formato de error, lo propagamos
  if (!response.ok) {
    if (data && !data.success && data.message) {
      throw new Error(data.message); // Propaga el error de negocio
    }
    throw new Error(`Error en la petición: ${response.status}`);
  }

  return data;
}

// === Endpoints de Configuración del Doctor ===

export const getDoctorAvailability = (token: string) => 
  fetchWithAuth<{ doctorUserId: string; weeklyAvailability: WeeklySlot[] }>('/doctors/me/availability', token);

export const updateDoctorAvailability = (token: string, weeklyAvailability: WeeklySlot[]) => 
  fetchWithAuth<{ doctorUserId: string; weeklyAvailability: WeeklySlot[] }>('/doctors/me/availability', token, {
    method: 'PUT',
    body: JSON.stringify({ weeklyAvailability }),
  });

export const getScheduleSettings = (token: string) => 
  fetchWithAuth<ScheduleSettings>('/doctors/me/schedule-settings', token);

export const updateScheduleSettings = (token: string, appointmentDurationMinutes: number) => 
  fetchWithAuth<ScheduleSettings>('/doctors/me/schedule-settings', token, {
    method: 'PUT',
    body: JSON.stringify({ appointmentDurationMinutes }),
  });

export const getScheduleReadiness = (token: string) => 
  fetchWithAuth<ScheduleReadiness>('/doctors/me/schedule-readiness', token);

// === Endpoints de Bloqueos Puntuales ===

export const getDoctorBlocks = (token: string, dateFrom?: string, dateTo?: string) => {
  const query = (dateFrom && dateTo) ? `?dateFrom=${dateFrom}&dateTo=${dateTo}` : '';
  return fetchWithAuth<DoctorBlock[]>(`/doctors/me/blocks${query}`, token);
};

export const createDoctorBlock = (token: string, block: Partial<DoctorBlock>) => 
  fetchWithAuth<DoctorBlock>('/doctors/me/blocks', token, {
    method: 'POST',
    body: JSON.stringify(block),
  });

export const updateDoctorBlock = (token: string, blockId: string, block: Partial<DoctorBlock>) => 
  fetchWithAuth<DoctorBlock>(`/doctors/me/blocks/${blockId}`, token, {
    method: 'PUT',
    body: JSON.stringify(block),
  });

export const deleteDoctorBlock = (token: string, blockId: string) => 
  fetchWithAuth<null>(`/doctors/me/blocks/${blockId}`, token, {
    method: 'DELETE',
  });

// === Endpoints de Calendario Institucional ===

export const getHolidays = (token: string, dateFrom?: string, dateTo?: string) => {
  const query = (dateFrom && dateTo) ? `?dateFrom=${dateFrom}&dateTo=${dateTo}` : '';
  return fetchWithAuth<Holiday[]>(`/calendar/holidays${query}`, token);
};

export const createHoliday = (token: string, holiday: Partial<Holiday>) => 
  fetchWithAuth<Holiday>('/calendar/holidays', token, {
    method: 'POST',
    body: JSON.stringify(holiday),
  });

export const updateHoliday = (token: string, holidayId: string, holiday: Partial<Holiday>) => 
  fetchWithAuth<Holiday>(`/calendar/holidays/${holidayId}`, token, {
    method: 'PUT',
    body: JSON.stringify(holiday),
  });

export const deleteHoliday = (token: string, holidayId: string) => 
  fetchWithAuth<null>(`/calendar/holidays/${holidayId}`, token, {
    method: 'DELETE',
  });

// === Endpoints de Consulta de Slots ===

export const getAppointmentSlots = (token: string, doctorId: string, date: string) => 
  fetchWithAuth<SlotsResponse>(`/appointments/slots?doctorId=${doctorId}&date=${date}`, token);
