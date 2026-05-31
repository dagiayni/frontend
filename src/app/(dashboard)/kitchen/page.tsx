"use client";

import { useEffect, useState } from 'react';
import { TicketCard, KitchenTicket } from '@/components/kitchen/TicketCard';
import { getAuthToken } from '@/lib/auth';

export default function KitchenPage() {
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTickets() {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const token = await getAuthToken();
      const res = await fetch(`${apiBase}/api/v1/kitchen/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setTickets(json.data);
      } else {
        setError('Failed to load tickets');
      }
    } catch {
      setError('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, []);

  async function handleUpdateStatus(ticketId: number, action: string) {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const token = await getAuthToken();
      const res = await fetch(`${apiBase}/api/v1/kitchen/tickets/${ticketId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        // Refresh instantly on success
        loadTickets();
      }
    } catch {
      alert("Failed to update status");
    }
  }

  if (isLoading) return <div className="p-8 text-kds-text font-semibold bg-kds-bg min-h-screen">Loading Kitchen...</div>;
  if (error) return <div className="p-8 text-danger font-semibold bg-kds-bg min-h-screen">{error}</div>;

  return (
    <div className="min-h-screen bg-kds-bg p-6 page-enter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl text-kds-text font-bold tracking-wider">KITCHEN DISPLAY SYSTEM</h1>
        <div className="text-kds-text/60 font-mono">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {tickets.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-kds-text/30 font-body">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xl">No active tickets. Kitchen is clear!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start auto-rows-max">
          {tickets.map(ticket => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
