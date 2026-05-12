const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface StaffUser {
  id: string;
  email: string;
  ci: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  userType: "ADMIN" | "DOCTOR" | "LAB_TECH" | "RECEPTIONIST";
  active: boolean;
  specialty: string | null;
  medicalLicense: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  ci: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: "ADMIN" | "DOCTOR" | "LAB_TECH" | "RECEPTIONIST";
  medicalLicense?: string;
  specialty?: string;
}

export interface UpdateStaffPayload {
  ci: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  active: boolean;
  medicalLicense?: string | null;
  specialty?: string | null;
}

export interface CreateStaffResponse {
  email: string;
  role: string;
  tempPassword: string;
  emailSent: string;
}

async function authFetch<T>(endpoint: string, token: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  });

  const text = await res.text();
  if (!text) {
    if (!res.ok) throw new Error(`HTTP ${res.status}: respuesta vacía.`);
    return { success: true, message: "OK", data: null as T, timestamp: new Date().toISOString() };
  }

  let data;
  try { data = JSON.parse(text); } catch { throw new Error(`Respuesta no es JSON válido (${res.status})`); }

  if (!res.ok) throw new Error(data?.message || `Error ${res.status}`);
  return data;
}

export const getStaffList  = (token: string) =>
  authFetch<StaffUser[]>('/admin/users/staff', token);

export const getStaffById  = (token: string, userId: string) =>
  authFetch<StaffUser>(`/admin/users/staff/${userId}`, token);

export const createStaff   = (token: string, payload: CreateStaffPayload) =>
  authFetch<CreateStaffResponse>('/admin/users/staff', token, { method: 'POST', body: JSON.stringify(payload) });

export const updateStaff   = (token: string, userId: string, payload: UpdateStaffPayload) =>
  authFetch<StaffUser>(`/admin/users/staff/${userId}`, token, { method: 'PUT', body: JSON.stringify(payload) });
