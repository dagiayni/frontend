"use client";

import { useEffect, useState } from 'react';
import { MenuGrid, MenuItem } from '@/components/pos/MenuGrid';
import { OrderTicket, OrderItem } from '@/components/pos/OrderTicket';
import { getAuthToken } from '@/lib/auth';

export default function PosPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'cart'>('menu');

  useEffect(() => {
    async function loadMenu() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiBase}/api/v1/menu/items`);
        const json = await res.json();
        if (json.success) {
          setMenuItems(json.data);
        } else {
          setError('Failed to load menu');
        }
      } catch {
        setError('Error connecting to server');
      } finally {
        setIsLoading(false);
      }
    }
    loadMenu();
  }, []);

  function handleAddItem(item: MenuItem) {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, cartId: `${item.id}-${Date.now()}`, quantity: 1 }];
    });
  }

  function handleRemoveItem(cartId: string) {
    setOrderItems(prev => prev.filter(i => i.cartId !== cartId));
  }

  function handleUpdateQuantity(cartId: string, delta: number) {
    setOrderItems(prev => prev.map(i => {
      if (i.cartId === cartId) {
        const newQ = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQ };
      }
      return i;
    }).filter(i => i.quantity > 0));
  }

  async function handleSubmitOrder(): Promise<number | null> {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    const token = await getAuthToken();
    
    try {
      const payload = {
        table_number: "1", // TODO: read from state
        items: orderItems.map(i => ({
          menu_item_id: i.id,
          quantity: i.quantity,
          notes: i.notes || ""
        }))
      };

      const res = await fetch(`${apiBase}/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const json = await res.json();
      if (json.success) {
        return json.data.id;
      }
      alert('Failed to submit order: ' + (json.error?.message || 'Unknown error'));
      return null;
    } catch {
      alert('Network error submitting order');
      return null;
    }
  }

  if (isLoading) return <div className="p-8 text-brand font-semibold animate-pulse">Loading POS...</div>;
  if (error) return <div className="p-8 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen flex flex-col overflow-hidden page-enter">
      {/* Mobile View Navigation Toggle */}
      <div className="flex md:hidden bg-white border-b border-brand-light p-2 sticky top-0 z-20 justify-around font-body font-semibold">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-grow py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'menu' ? 'bg-brand text-white shadow-sm' : 'text-brand-dark hover:bg-brand-light/35'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Menu
        </button>
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex-grow py-2 text-center rounded-lg transition-colors flex items-center justify-center gap-2 relative ${
            activeTab === 'cart' ? 'bg-brand text-white shadow-sm' : 'text-brand-dark hover:bg-brand-light/35'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Order Ticket
          {orderItems.length > 0 && (
            <span className="absolute -top-1 right-2 bg-brand text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
              {orderItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Menu Grid */}
        <div className={`w-full md:w-[60%] lg:w-[65%] h-full p-4 md:p-6 bg-off-white flex flex-col ${activeTab === 'menu' ? 'flex' : 'hidden md:flex'}`}>
          <h1 className="font-display text-2xl md:text-3xl text-brand-deeper font-bold mb-4 md:mb-6 hidden md:block">Point of Sale</h1>
          <div className="flex-1 overflow-hidden">
            <MenuGrid items={menuItems} onItemClick={handleAddItem} />
          </div>
        </div>

        {/* Right Side - Order Ticket */}
        <div className={`w-full md:w-[40%] lg:w-[35%] h-full md:h-screen shadow-[-10px_0_20px_rgba(128,0,32,0.05)] z-10 ${activeTab === 'cart' ? 'block' : 'hidden md:block'}`}>
          <OrderTicket 
            items={orderItems} 
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClear={() => setOrderItems([])}
            onSubmitOrder={handleSubmitOrder}
          />
        </div>
      </div>
    </div>
  );
}
