"use client";

import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { StockForm } from '@/components/forms/StockForm';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  status: string;
}

interface StockSaveData {
  name: string;
  quantity: string;
  unit: string;
  category: string;
  status: string;
}

const initialStock: StockItem[] = [
  { id: 1, name: 'St. George Beer', quantity: 48, unit: 'pcs', category: 'Beer', status: 'optimal' },
  { id: 2, name: 'Vodka', quantity: 2.5, unit: 'L', category: 'Spirits', status: 'low' },
  { id: 3, name: 'Lime Juice', quantity: 0.5, unit: 'L', category: 'Mixers', status: 'critical' },
  { id: 4, name: 'Coca Cola', quantity: 120, unit: 'pcs', category: 'Soft Drinks', status: 'optimal' },
  { id: 5, name: 'Tequila', quantity: 1, unit: 'L', category: 'Spirits', status: 'low' },
  { id: 6, name: 'Dry Vermouth', quantity: 0.8, unit: 'L', category: 'Spirits', status: 'optimal' },
];

export default function BarStockPage() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (item: StockItem) => { setEditingItem(item); setIsFormOpen(true); };

  const getFormInitialData = () => {
    if (!editingItem) return undefined;
    return {
      ...editingItem,
      quantity: editingItem.quantity.toString(),
    };
  };

  const handleSave = (data: StockSaveData) => {
    if (editingItem) {
      setStock(prev => prev.map(s => s.id === editingItem.id ? { ...s, ...data, quantity: parseFloat(data.quantity) } : s));
    } else {
      setStock(prev => [...prev, { id: Date.now(), name: data.name, quantity: parseFloat(data.quantity), unit: data.unit, category: data.category, status: data.status }]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Bar Stock</h2>
        <Button variant="primary" onClick={handleAdd}>+ Add Stock Item</Button>
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
              {stock.map((item) => (
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
                    <button onClick={() => handleEdit(item)} className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Stock Item' : 'Add Stock Item'}>
        <StockForm type="bar" initialData={getFormInitialData()} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
