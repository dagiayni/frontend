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
      } catch (_err) {
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
    } catch (_e) {
      alert('Network error submitting order');
      return null;
    }
  }

  if (isLoading) return <div className="p-8 text-brand font-semibold animate-pulse">Loading POS...</div>;
  if (error) return <div className="p-8 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-screen flex flex-col md:flex-row overflow-hidden page-enter">
      {/* 60% Left Side - Menu Grid */}
      <div className="w-full md:w-[60%] lg:w-[65%] h-full p-6 bg-off-white flex flex-col">
        <h1 className="font-display text-3xl text-brand-deeper font-bold mb-6">Point of Sale</h1>
        <div className="flex-1 overflow-hidden">
          <MenuGrid items={menuItems} onItemClick={handleAddItem} />
        </div>
      </div>

      {/* 40% Right Side - Order Ticket */}
      <div className="w-full md:w-[40%] lg:w-[35%] h-full md:h-screen shadow-[-10px_0_20px_rgba(128,0,32,0.05)] z-10">
        <OrderTicket 
          items={orderItems} 
          onRemoveItem={handleRemoveItem}
          onUpdateQuantity={handleUpdateQuantity}
          onClear={() => setOrderItems([])}
          onSubmitOrder={handleSubmitOrder}
        />
      </div>
    </div>
  );
}
