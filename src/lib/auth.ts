import { isTelegramMiniApp } from './telegram';

export async function getAuthToken(): Promise<string | null> {
  if (isTelegramMiniApp()) {
    const cached = sessionStorage.getItem('jwt');
    if (cached) return cached;

    // Simulated Auth for Frontend Only Mode
    const fakeToken = "simulated-jwt-token-mini-app";
    const fakeUser = { id: 1, name: "MiniApp User", role: "staff" };
    
    sessionStorage.setItem('jwt', fakeToken);
    sessionStorage.setItem('user', JSON.stringify(fakeUser));
    return fakeToken;
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
