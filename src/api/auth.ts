import { API_BASE_URL } from './config';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

async function request<T>(path: string, body: object): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error((data as { error?: string })?.error ?? res.statusText ?? 'Request failed');
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return data as T;
}

export async function registerUser(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', params);
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', params);
}
