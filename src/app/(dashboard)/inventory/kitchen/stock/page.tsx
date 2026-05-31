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
  { id: 1, name: 'Teff Flour', quantity: 50, unit: 'kg', category: 'Dry Goods', status: 'optimal' },
  { id: 2, name: 'Berbere Spice', quantity: 2, unit: 'kg', category: 'Spices', status: 'low' },
  { id: 3, name: 'Cooking Oil', quantity: 0, unit: 'L', category: 'Oils', status: 'critical' },
  { id: 4, name: 'Onions', quantity: 30, unit: 'kg', category: 'Vegetables', status: 'optimal' },
  { id: 5, name: 'Beef (Boneless)', quantity: 12, unit: 'kg', category: 'Meat', status: 'low' },
];

export default function KitchenStockPage() {
  const [stock, setStock] = useState<StockItem[]>(initialStock);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

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
      const newItem: StockItem = {
        id: Date.now(),
        name: data.name,
        quantity: parseFloat(data.quantity),
        unit: data.unit,
        category: data.category,
        status: data.status,
      };
      setStock(prev => [...prev, newItem]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Kitchen Stock</h2>
        <Button variant="primary" onClick={handleAdd}>+ Add Stock Item</Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedCard>
      </div>

      {/* Mobile Cards Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {stock.map((item, idx) => (
          <AnimatedCard 
            key={item.id} 
            delay={idx * 0.05} 
            className="flex flex-col justify-between hover:border-brand-mid transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-body font-semibold text-brand-dark text-base leading-tight">{item.name}</h3>
                <span className="text-xs text-brand-dark/50 mt-1.5 inline-block bg-brand-light px-2.5 py-0.5 rounded-full capitalize font-semibold tracking-wide">
                  {item.category}
                </span>
              </div>
              <Badge variant={
                item.status === 'optimal' ? 'success' :
                item.status === 'low' ? 'warning' : 'danger'
              }>
                {item.status}
              </Badge>
            </div>
            
            <div className="flex justify-between items-end mt-4 pt-3 border-t border-brand-light/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-brand-dark/40 block font-body font-bold mb-0.5">Current Stock</span>
                <span className="font-mono text-lg font-bold text-brand-dark">
                  {item.quantity} <span className="text-xs font-semibold text-brand-dark/65">{item.unit}</span>
                </span>
              </div>
              <button
                onClick={() => handleEdit(item)}
                className="px-3.5 py-1.5 bg-brand-light/70 hover:bg-brand text-brand hover:text-white font-body font-bold text-xs uppercase tracking-wide rounded-md transition-all duration-200"
              >
                Edit
              </button>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <SlideOver
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
        title={editingItem ? 'Edit Stock Item' : 'Add Stock Item'}
      >
        <StockForm
          type="kitchen"
          initialData={getFormInitialData()}
          onSave={handleSave}
          onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
        />
      </SlideOver>
    </div>
  );
}
