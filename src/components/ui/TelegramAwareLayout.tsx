"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isTelegramMiniApp, initTelegramApp } from "@/lib/telegram";

import { Navbar } from "@/components/ui/Navbar";

export function TelegramAwareLayout({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMiniApp(isTelegramMiniApp());
    initTelegramApp(); // no-op in normal browser
  }, []);

  const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/auth');

  if (isMiniApp) {
    return <main className="flex-1 bg-off-white min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-off-white">
      {!isAuthRoute && <Navbar />}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
