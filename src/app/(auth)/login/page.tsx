'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [pin, setPin]     = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/v1/auth/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, pin }),
    });
    const json = await res.json();

    if (!json.success) {
      setError(json.error?.message || 'Login failed');
      return;
    }

    localStorage.setItem('jwt', json.data.access_token);
    localStorage.setItem('refresh_token', json.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(json.data.user));
    window.location.href = '/(dashboard)/pos/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4 border border-brand-light"
      >
        <h2 className="font-display text-2xl text-brand-dark font-semibold text-center">
          Staff Login
        </h2>
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
        )}
        <div>
          <label className="block text-sm font-body text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            placeholder="0912345678"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-body text-gray-700 mb-1">PIN</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
            placeholder="••••"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand text-white font-semibold py-3 rounded-md
                     hover:bg-brand-hover transition-colors text-sm"
        >
          Login
        </button>
      </form>
    </div>
  );
}
