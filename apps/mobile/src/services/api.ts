// Plain fetch client – usable from background tasks (no React / Redux needed).
import { API_URL } from '../config';
import { tokenStorage } from './tokenStorage';

let refreshing: Promise<string | null> | null = null;

async function refreshAccess(): Promise<string | null> {
  const { refresh } = await tokenStorage.get();
  if (!refresh) return null;
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: refresh }),
  });
  if (!res.ok) { await tokenStorage.clear(); return null; }
  const data = await res.json();
  await tokenStorage.set(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const call = async (token: string | null) => fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  let res = await call((await tokenStorage.get()).access);
  if (res.status === 401) {
    refreshing ??= refreshAccess().finally(() => (refreshing = null));
    const t = await refreshing;
    if (t) res = await call(t);
  }
  if (!res.ok) throw Object.assign(new Error(`API ${res.status}: ${await res.text()}`), { status: res.status });
  return res.status === 204 ? (undefined as T) : res.json();
}
