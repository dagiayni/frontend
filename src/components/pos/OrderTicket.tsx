"use client";

import React, { useState } from 'react';
import { MenuItem } from './MenuGrid';
import { PaymentButton } from './PaymentButton';
import { Button } from '@/components/ui/Button';

export interface OrderItem extends MenuItem {
  cartId: string;
  quantity: number;
  notes?: string;
}

interface OrderTicketProps {
  items: OrderItem[];
  onRemoveItem: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onClear: () => void;
  onSubmitOrder: () => Promise<number | null>; // Returns created order_id
}

export function OrderTicket({ items, onRemoveItem, onUpdateQuantity, onClear, onSubmitOrder }: OrderTicketProps) {
  const [tableNumber, setTableNumber] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const tax = subtotal * 0.15; // Assuming 15% tax
  const total = subtotal + tax;

  async function handleSubmit() {
    setIsSubmitting(true);
    const orderId = await onSubmitOrder();
    if (orderId) {
      setCreatedOrderId(orderId);
    }
    setIsSubmitting(false);
  }

  function handleNewOrder() {
    onClear();
    setCreatedOrderId(null);
  }

  return (
    <div className="bg-white border-l border-brand-light h-full flex flex-col shadow-[-4px_0_15px_rgba(128,0,32,0.03)]">
      {/* Header */}
      <div className="bg-brand text-white p-4 flex justify-between items-center shrink-0">
        <h2 className="font-display text-xl font-bold">Current Order</h2>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm text-white/80">Table</span>
          <select 
            value={tableNumber} 
            onChange={e => setTableNumber(e.target.value)}
            disabled={createdOrderId !== null}
            className="bg-brand-dark text-white border-none rounded px-2 py-1 font-mono outline-none"
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 font-body">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p>No items added yet</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.cartId} className="flex justify-between items-start border-b border-brand-light pb-4">
              <div className="flex-1">
                <div className="font-body font-semibold text-gray-900 leading-snug">{item.name}</div>
                <div className="text-sm text-brand font-mono mt-1">{parseFloat(item.price).toFixed(2)} ETB</div>
              </div>
              
              <div className="flex flex-col items-end gap-2 ml-4">
                {!createdOrderId && (
                  <div className="flex items-center gap-3 bg-off-white rounded-lg p-1">
                    <button onClick={() => onUpdateQuantity(item.cartId, -1)} className="w-8 h-8 rounded-md bg-white shadow-sm text-brand font-bold flex items-center justify-center hover:bg-brand hover:text-white transition-colors">-</button>
                    <span className="font-mono w-6 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.cartId, 1)} className="w-8 h-8 rounded-md bg-white shadow-sm text-brand font-bold flex items-center justify-center hover:bg-brand hover:text-white transition-colors">+</button>
                  </div>
                )}
                <div className="font-mono font-bold text-gray-900">
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} ETB
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Totals */}
      <div className="bg-off-white p-4 shrink-0 border-t border-brand-light">
        <div className="space-y-2 mb-4 font-body text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">{subtotal.toFixed(2)} ETB</span>
          </div>
          <div className="flex justify-between text-brand-dark">
            <span>Tax (15%)</span>
            <span className="font-mono">{tax.toFixed(2)} ETB</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-brand mt-2 pt-2 border-t border-brand-light/50">
            <span>Total</span>
            <span className="font-mono text-3xl">{total.toFixed(2)}</span>
          </div>
        </div>

        {items.length > 0 && !createdOrderId && (
          <Button 
            className="w-full text-lg py-4 shadow-md" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Send to Kitchen
          </Button>
        )}

        {createdOrderId && (
          <div className="animate-pageIn">
            <PaymentButton orderId={createdOrderId} />
            <Button 
              variant="secondary" 
              className="w-full mt-3" 
              onClick={handleNewOrder}
            >
              Start New Order
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
