'use client';

/**
 * ════════════════════════════════════════════════════════════
 * PaymentButton — Request Payment with SSE Live Status Tracking
 * ════════════════════════════════════════════════════════════
 *
 * OPTIMIZATION 1: Uses native EventSource (Server-Sent Events) to listen
 * for payment status changes in real-time, replacing the aggressive
 * short-polling approach that would trigger cPanel CPU throttles.
 *
 * Works in both the web dashboard and Telegram Mini App contexts.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { isTelegramMiniApp, getTelegramWebApp } from '@/lib/telegram';

type PaymentStatus = 'idle' | 'loading' | 'pending' | 'success' | 'failed' | 'error';

interface PaymentButtonProps {
  orderId: number;
  onStatusChange?: (status: PaymentStatus) => void;
}

const STATUS_BADGE: Record<string, { emoji: string; label: string; color: string }> = {
  idle:    { emoji: '',   label: '',                color: '' },
  loading: { emoji: '⏳', label: 'Initialising…',   color: 'text-gray-500' },
  pending: { emoji: '🟡', label: 'Payment Pending',  color: 'text-yellow-600' },
  success: { emoji: '🟢', label: 'Payment Received', color: 'text-green-700' },
  failed:  { emoji: '🔴', label: 'Payment Failed',   color: 'text-red-600' },
  error:   { emoji: '⚠️', label: 'Error',            color: 'text-red-500' },
};

export function PaymentButton({ orderId, onStatusChange }: PaymentButtonProps) {
  const [status, setStatus]           = useState<PaymentStatus>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [txRef, setTxRef]             = useState<string | null>(null);
  const [errorMsg, setErrorMsg]       = useState<string | null>(null);
  const eventSourceRef                = useRef<EventSource | null>(null);

  // ── Cleanup EventSource on unmount ─────────────────────────
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  // ── Notify parent on status change ─────────────────────────
  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  // ── Token helper ───────────────────────────────────────────
  const getToken = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    return (isTelegramMiniApp() ? sessionStorage : localStorage).getItem('jwt');
  }, []);

  // ── SSE Stream (OPTIMIZATION 1) ───────────────────────────
  const startSSEStream = useCallback((ref: string) => {
    const token = getToken();
    if (!token) {
      setStatus('error');
      setErrorMsg('Not authenticated');
      return;
    }

    // Close any existing stream
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const url = `${apiBase}/api/v1/payments/stream/${encodeURIComponent(ref)}?token=${encodeURIComponent(token)}`;

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.status === 'success') {
          setStatus('success');
          es.close();
          eventSourceRef.current = null;
        } else if (data.status === 'failed') {
          setStatus('failed');
          es.close();
          eventSourceRef.current = null;
        } else if (data.status === 'timeout') {
          // Server-side timeout — reconnect after a brief pause
          es.close();
          eventSourceRef.current = null;
          setTimeout(() => startSSEStream(ref), 2000);
        }
        // 'pending' → keep listening
      } catch {
        // Ignore parse errors on heartbeat comments
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects on transient network errors.
      // Only handle if permanently closed.
      if (es.readyState === EventSource.CLOSED) {
        eventSourceRef.current = null;
        // If we're still pending, try to reconnect
        if (status === 'pending') {
          setTimeout(() => startSSEStream(ref), 3000);
        }
      }
    };
  }, [getToken, status]);

  // ── Initiate Payment ──────────────────────────────────────
  const handleRequest = useCallback(async () => {
    setStatus('loading');
    setErrorMsg(null);

    const token = getToken();
    if (!token) {
      setStatus('error');
      setErrorMsg('Not authenticated. Please log in.');
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${apiBase}/api/v1/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setStatus('error');
        setErrorMsg(json.error?.message || 'Failed to initiate payment');
        return;
      }

      const { tx_ref, checkout_url } = json.data;
      setTxRef(tx_ref);
      setCheckoutUrl(checkout_url);
      setStatus('pending');

      // In Telegram Mini App: open Chapa checkout in Telegram browser
      if (isTelegramMiniApp()) {
        getTelegramWebApp().openLink(checkout_url);
      }

      // Start SSE stream to track payment status in real-time
      startSSEStream(tx_ref);
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  }, [orderId, getToken, startSSEStream]);

  // ── Reset ─────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus('idle');
    setCheckoutUrl(null);
    setTxRef(null);
    setErrorMsg(null);
  }, []);

  const badge = STATUS_BADGE[status];

  return (
    <div className="font-body" id={`payment-container-${orderId}`}>

      {/* ── Idle: Show request button ── */}
      {status === 'idle' && (
        <button
          onClick={handleRequest}
          id={`payment-btn-${orderId}`}
          className="w-full bg-brand text-white font-semibold py-3 px-6 rounded-md
                     hover:bg-brand-hover transition-colors duration-150
                     text-[0.9375rem] tracking-wide"
        >
          Request Payment
        </button>
      )}

      {/* ── Loading ── */}
      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 py-3 text-gray-500">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Initialising payment…</span>
        </div>
      )}

      {/* ── Pending: QR code + status badge ── */}
      {status === 'pending' && checkoutUrl && (
        <div className="space-y-4">
          {/* Status badge */}
          <div className={`flex items-center gap-2 text-sm font-semibold ${badge.color}`}>
            <span className="text-lg">{badge.emoji}</span>
            <span>{badge.label}</span>
            <span className="ml-auto">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            </span>
          </div>

          {/* QR Code — only in web browser, not Telegram */}
          {typeof window !== 'undefined' && !isTelegramMiniApp() && (
            <div className="flex flex-col items-center gap-3 p-4 bg-white rounded-lg border border-brand-light">
              <p className="text-xs text-gray-500 font-body">
                Scan QR or share link with customer
              </p>
              <QRCodeSVG
                value={checkoutUrl}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#1A0008"
                level="M"
                includeMargin
              />
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand text-xs underline hover:text-brand-hover break-all text-center"
              >
                Open Checkout ↗
              </a>
            </div>
          )}

          {/* Telegram context — reopen button */}
          {typeof window !== 'undefined' && isTelegramMiniApp() && (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Waiting for customer to complete payment…
              </p>
              <button
                onClick={() => getTelegramWebApp().openLink(checkoutUrl)}
                className="text-brand text-sm font-semibold underline"
              >
                Reopen Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Success ── */}
      {status === 'success' && (
        <div className="flex items-center gap-2 py-3 px-4 bg-green-50 rounded-lg border border-green-200">
          <span className="text-xl">🟢</span>
          <span className="text-green-700 font-semibold text-sm">
            ✅ Payment Received — Paid
          </span>
        </div>
      )}

      {/* ── Failed ── */}
      {status === 'failed' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 py-3 px-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-xl">🔴</span>
            <span className="text-red-600 font-semibold text-sm">
              Payment Failed
            </span>
          </div>
          <button
            onClick={handleRetry}
            className="w-full text-brand text-sm font-semibold py-2 border border-brand rounded-md
                       hover:bg-brand-light transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {status === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 py-3 px-4 bg-red-50 rounded-lg border border-red-200">
            <span className="text-xl">⚠️</span>
            <span className="text-red-500 text-sm">
              {errorMsg || 'Something went wrong'}
            </span>
          </div>
          <button
            onClick={handleRetry}
            className="w-full text-brand text-sm font-semibold py-2 border border-brand rounded-md
                       hover:bg-brand-light transition-colors duration-150"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
