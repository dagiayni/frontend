"use client";

import { useEffect, useState } from 'react';
import { TicketCard, KitchenTicket } from '@/components/kitchen/TicketCard';
import { getBarTickets, updateBarTicketStatus } from '@/lib/mockStorage';

export default function BarDisplayPage() {
  const [tickets, setTickets] = useState<KitchenTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState(new Date());

  function loadTickets() {
    try {
      const mockTickets = getBarTickets();
      // Strictly filter to ensure only drink items are shown
      const strictTickets = mockTickets
        .map(t => ({
          ...t,
          items: t.items.filter(item => item.type === 'drink')
        }))
        .filter(t => t.items.length > 0);

      setTickets(strictTickets);
      setIsLoading(false);
    } catch {
      setError('Error loading bar tickets');
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  // Live clock
  useEffect(() => {
    const clockInterval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(clockInterval);
  }, []);

  function handleUpdateStatus(ticketId: number, action: string) {
    const success = updateBarTicketStatus(ticketId, action);
    if (success) {
      loadTickets();
    }
  }

  function handleArchive(ticketId: number) {
    const success = updateBarTicketStatus(ticketId, 'archive');
    if (success) {
      loadTickets();
    }
  }

  const activeTickets = tickets.filter(t => t.status !== 'served');
  const servedTickets = tickets.filter(t => t.status === 'served');

  if (isLoading) return <div className="p-8 text-kds-text font-semibold bg-kds-bg min-h-screen animate-pulse">Loading Bar Display...</div>;
  if (error) return <div className="p-8 text-danger font-semibold bg-kds-bg min-h-screen">{error}</div>;

  return (
    <div className="min-h-screen bg-kds-bg p-4 sm:p-6 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-2 mb-6 border-b border-[#4A3A3C] pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-kds-text font-bold tracking-wider">BAR DISPLAY</h1>
          <p className="text-kds-text/40 text-xs font-body mt-0.5">Drink orders from POS</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-kds-text/50 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {activeTickets.length} active
          </div>
          <div className="text-kds-text/60 font-mono text-sm sm:text-base tabular-nums">
            {clock.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Active Tickets */}
      {activeTickets.length === 0 && servedTickets.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-kds-text/30 font-body">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
          <p className="text-xl">No active drink orders. Bar is clear!</p>
        </div>
      ) : (
        <>
          {activeTickets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start auto-rows-max">
              {activeTickets.map(ticket => (
                <TicketCard 
                  key={ticket.id} 
                  ticket={ticket} 
                  onUpdateStatus={handleUpdateStatus}
                  onArchive={handleArchive}
                />
              ))}
            </div>
          )}

          {/* Served / Completed Section */}
          {servedTickets.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display text-lg text-kds-text/50 font-bold tracking-wide">COMPLETED</h2>
                <div className="h-px flex-1 bg-[#4A3A3C]" />
                <span className="text-kds-text/30 text-xs font-mono">{servedTickets.length} served</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start auto-rows-max opacity-60">
                {servedTickets.map(ticket => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    onUpdateStatus={handleUpdateStatus}
                    onArchive={handleArchive}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
