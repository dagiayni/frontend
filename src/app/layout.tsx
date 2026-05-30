import Script from 'next/script';
import './globals.css';
import { TelegramAwareLayout } from '@/components/ui/TelegramAwareLayout';

export const metadata = {
  title: 'Restaurant ERP',
  description: 'Restaurant management system — POS, Kitchen, Inventory, Payments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Telegram WebApp SDK — harmless no-op in normal browser */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body suppressHydrationWarning>
        <TelegramAwareLayout>{children}</TelegramAwareLayout>
      </body>
    </html>
  );
}

