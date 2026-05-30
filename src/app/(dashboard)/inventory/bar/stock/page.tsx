"use client";

import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function BarStockPage() {
  const mockStock = [
    { id: 1, name: 'St. George Beer', quantity: 48, unit: 'pcs', category: 'Beer', status: 'optimal' },
    { id: 2, name: 'Vodka', quantity: 2.5, unit: 'L', category: 'Spirits', status: 'low' },
    { id: 3, name: 'Lime Juice', quantity: 0.5, unit: 'L', category: 'Mixers', status: 'critical' },
    { id: 4, name: 'Coca Cola', quantity: 120, unit: 'pcs', category: 'Soft Drinks', status: 'optimal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Bar Stock</h2>
        <Button variant="primary">+ Add Stock Item</Button>
      </div>

      <AnimatedCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-light text-sm text-brand-dark/60 font-semibold uppercase tracking-wider">
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Quantity</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body divide-y divide-brand-light">
              {mockStock.map((item) => (
                <tr key={item.id} className="hover:bg-brand-light/10 transition-colors">
                  <td className="p-4 font-semibold text-brand-dark">{item.name}</td>
                  <td className="p-4 text-brand-dark/70">{item.category}</td>
                  <td className="p-4 text-right font-medium">
                    {item.quantity} <span className="text-xs text-brand-dark/50">{item.unit}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant={
                      item.status === 'optimal' ? 'success' : 
                      item.status === 'low' ? 'warning' : 'danger'
                    }>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
}
