import { API_BASE_URL } from './config';
import { useAuthStore } from '../state/authStore';

export const apiDelay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export type ApiError = { status: number; message: string; details?: unknown };

export function toApiError(err: unknown): ApiError {
  if (err && typeof err === 'object' && 'status' in err && 'message' in err) {
    const e = err as ApiError;
    return { status: e.status, message: e.message, details: e.details };
  }
  if (err instanceof Error) {
    return { status: 0, message: err.message, details: err };
  }
  return { status: 0, message: String(err) };
}

const REQUEST_TIMEOUT_MS = 8000;

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      let details: unknown;
      const text = await res.text();
      try {
        details = text ? JSON.parse(text) : undefined;
      } catch {
        details = text || undefined;
      }
      throw {
        status: res.status,
        message: res.statusText || 'Request failed',
        details,
      } satisfies ApiError;
    }
    const body = await res.text();
    if (!body) return undefined as T;
    return JSON.parse(body) as T;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw { status: 408, message: 'Request timeout' } satisfies ApiError;
    }
    throw err;
  }
}
