import { fetchWithAuth, ApiResponse } from "./scheduling";

export interface DoctorProfile {
  firstName: string;
  lastName: string;
  phone: string;
  specialty: string;
  medicalLicense: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Re-implementamos fetchWithAuth aquí o lo importamos si se exportó.
// Como no exportamos fetchWithAuth en scheduling.ts, lo re-declaramos temporalmente o lo exportamos.
// Mejor lo re-declaramos para no tener conflictos de exportación.

export async function fetchProfileWithAuth<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
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
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: Respuesta vacía del servidor.`);
    }
    return { success: true, message: "OK", data: null, timestamp: new Date().toISOString() } as unknown as ApiResponse<T>;
  }

  if (!response.ok) {
    if (data && !data.success && data.message) {
      throw new Error(data.message);
    }
    throw new Error(`Error en la petición: ${response.status}`);
  }

  return data;
}


export const getDoctorProfile = (token: string) => 
  fetchProfileWithAuth<DoctorProfile>('/doctors/me/profile', token);

export const updateDoctorProfile = (token: string, profile: Partial<DoctorProfile>) => 
  fetchProfileWithAuth<DoctorProfile>('/doctors/me/profile', token, {
    method: 'PUT',
    body: JSON.stringify(profile),
  });
