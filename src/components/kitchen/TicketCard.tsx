"use client";

import React from 'react';

export interface KitchenTicket {
  id: number;
  order_id: number;
  table_number: string;
  items: {
    id: number;
    menu_item_name: string;
    quantity: number;
    notes: string;
  }[];
  status: 'pending' | 'preparing' | 'ready';
  created_at: string;
}

interface TicketCardProps {
  ticket: KitchenTicket;
  onUpdateStatus: (id: number, newStatus: string) => void;
}

export function TicketCard({ ticket, onUpdateStatus }: TicketCardProps) {
  // Calculate elapsed time (mock static string for UI purposes, could be a real hook)
  const elapsedMinutes = Math.floor((new Date().getTime() - new Date(ticket.created_at).getTime()) / 60000);
  
  let headerColor = 'bg-[#4A3A3C]'; // default dark gray
  if (ticket.status === 'pending') headerColor = 'bg-brand';
  if (ticket.status === 'preparing') headerColor = 'bg-[#1E40AF]'; // info blue

  const isOverdue = elapsedMinutes > 15 && ticket.status !== 'ready';

  return (
    <div className={`kds-ticket flex flex-col bg-kds-surface rounded-xl overflow-hidden border ${isOverdue ? 'border-danger' : 'border-[#4A3A3C]'}`}>
      {/* Header */}
      <div className={`${headerColor} p-4 flex justify-between items-center text-kds-text shrink-0`}>
        <div className="font-display text-xl font-bold">Table {ticket.table_number || 'N/A'}</div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-mono opacity-80">#{ticket.order_id}</div>
          <div className={`font-mono px-2 py-1 rounded text-sm font-bold ${isOverdue ? 'bg-danger text-white' : 'bg-black/20 text-white'}`}>
            {elapsedMinutes}m
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {ticket.items.map(item => (
          <div key={item.id} className="flex justify-between items-start border-b border-[#4A3A3C] pb-3 last:border-0 last:pb-0">
            <div className="text-kds-text">
              <div className="font-body text-lg font-semibold leading-tight">{item.menu_item_name}</div>
              {item.notes && <div className="text-sm text-[#E8C4CB] mt-1 font-body">Note: {item.notes}</div>}
            </div>
            <div className="font-mono text-xl text-white font-bold bg-[#1A0008] px-3 py-1 rounded">
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="p-4 bg-[#1A0008] shrink-0 flex gap-2">
        {ticket.status === 'pending' && (
          <button 
            onClick={() => onUpdateStatus(ticket.id, 'start')}
            className="flex-1 min-h-[56px] bg-[#1E40AF] hover:bg-[#1E40AF]/80 text-white font-bold text-lg rounded-lg transition-colors"
          >
            Start Preparing
          </button>
        )}
        {ticket.status === 'preparing' && (
          <button 
            onClick={() => onUpdateStatus(ticket.id, 'ready')}
            className="flex-1 min-h-[56px] bg-success hover:bg-success/80 text-white font-bold text-lg rounded-lg transition-colors"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
}
