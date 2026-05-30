'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [pin, setPin]     = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const res = await fetch(`${apiBase}/api/v1/auth/pin`, {
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
    window.location.href = '/pos';
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-light p-4">
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

      {/* Demo Helpers */}
      <div className="mt-8 text-center w-full max-w-sm">
        <p className="text-sm text-brand-dark/70 mb-3 font-semibold font-body">Demo Login Accounts</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Owner', phone: '0900000001', pin: '1111' },
            { label: 'Manager', phone: '0900000002', pin: '2222' },
            { label: 'Cashier', phone: '0900000003', pin: '3333' },
            { label: 'Waiter', phone: '0900000004', pin: '4444' },
            { label: 'Kitchen', phone: '0900000005', pin: '5555' },
          ].map(role => (
            <button
              key={role.label}
              onClick={() => {
                setPhone(role.phone);
                setPin(role.pin);
              }}
              className="text-xs bg-white text-brand border border-brand/30 px-3 py-1.5 rounded-full hover:bg-brand hover:text-white transition-colors"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
