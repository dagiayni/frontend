"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAuthToken } from '@/lib/auth';

interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  quantity: string;
  low_stock_threshold: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getAuthToken();
        const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiBase}/api/v1/inventory/ingredients`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        if (json.success) setItems(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <div className="p-8 animate-pulse">Loading Inventory...</div>;

  return (
    <div className="p-8 page-enter max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">Inventory Management</h1>
          <p className="text-gray-600 font-body mt-1">Track and manage raw ingredients and stock levels.</p>
        </div>
        <Button>+ Add Ingredient</Button>
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left font-body">
          <thead className="bg-gray-50 border-b border-brand-light">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Item Name</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Quantity In Stock</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Threshold</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {items.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No inventory items found.</td></tr>
            ) : (
              items.map(item => {
                const qty = parseFloat(item.quantity);
                const threshold = parseFloat(item.low_stock_threshold);
                const isLow = qty <= threshold;
                const isOut = qty <= 0;

                let rowClass = "hover:bg-gray-50 transition-colors";
                let statusBadge = <Badge status="done" label="In Stock" />;
                
                if (isOut) {
                  rowClass = "bg-red-50 border-l-4 border-l-danger hover:bg-red-100";
                  statusBadge = <Badge status="cancelled" label="Out of Stock" />;
                } else if (isLow) {
                  rowClass = "bg-orange-50 border-l-4 border-l-warning hover:bg-orange-100";
                  statusBadge = <Badge status="pending" label="Low Stock" />;
                }

                return (
                  <tr key={item.id} className={rowClass}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{qty} <span className="text-gray-500 text-sm">{item.unit}</span></td>
                    <td className="px-6 py-4 font-mono text-gray-500">{threshold} {item.unit}</td>
                    <td className="px-6 py-4">{statusBadge}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="secondary" className="px-3 py-1.5 text-xs">Update Stock</Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
