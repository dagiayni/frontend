import { isTelegramMiniApp, getTelegramWebApp } from './telegram';

export async function getAuthToken(): Promise<string | null> {
  if (isTelegramMiniApp()) {
    const cached = sessionStorage.getItem('jwt');
    if (cached) return cached;

    const tg = getTelegramWebApp();
    const res = await fetch('/api/v1/miniapp/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData: tg.initData }),
    });
    const { success, data } = await res.json();
    if (!success) return null;
    sessionStorage.setItem('jwt', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    return data.token;
  }

  return localStorage.getItem('jwt');
}

export function getStoredUser(): Record<string, unknown> | null {
  const raw = (isTelegramMiniApp() ? sessionStorage : localStorage).getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth(): void {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');
  sessionStorage.removeItem('jwt');
  sessionStorage.removeItem('user');
}
