"use client";

import { useEffect, useState } from "react";
import { isTelegramMiniApp, initTelegramApp } from "@/lib/telegram";

export function TelegramAwareLayout({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    setIsMiniApp(isTelegramMiniApp());
    initTelegramApp(); // no-op in normal browser
  }, []);

  return (
    <>
      {!isMiniApp && <nav className="p-4 bg-brand text-white">{/* navbar placeholder */}</nav>}
      <main className="flex-1">{children}</main>
      {!isMiniApp && <footer className="p-4 bg-gray-100">{/* footer placeholder */}</footer>}
    </>
  );
}
