// Telegram WebApp type shim
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        initDataUnsafe: { user?: { id: number; username?: string; first_name: string } };
        setHeaderColor: (color: string) => void;
        openLink: (url: string) => void;
        BackButton: { show: () => void; hide: () => void; onClick: (fn: () => void) => void };
        MainButton: { text: string; show: () => void; hide: () => void; onClick: (fn: () => void) => void };
      };
    };
  }
}

export function isTelegramMiniApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initData;
}

export function getTelegramWebApp() {
  if (!isTelegramMiniApp()) throw new Error('Not running inside Telegram');
  return window.Telegram!.WebApp;
}

export function initTelegramApp(): void {
  if (!isTelegramMiniApp()) return;
  const tg = getTelegramWebApp();
  tg.ready();
  tg.expand();
  tg.setHeaderColor('#800020');
}
