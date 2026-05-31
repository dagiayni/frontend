"use client";

import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { MenuForm } from '@/components/forms/MenuForm';

interface MenuItemData {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
}

interface MenuSaveData {
  name: string;
  price: string;
  category: string;
  available: boolean;
}

const initialMenu: MenuItemData[] = [
  { id: 1, name: 'Special Tibs', price: 350, category: 'Mains', available: true },
  { id: 2, name: 'Shiro Tegabino', price: 150, category: 'Mains', available: true },
  { id: 3, name: 'Doro Wat', price: 450, category: 'Mains', available: true },
  { id: 4, name: 'Kitfo', price: 400, category: 'Mains', available: false },
  { id: 5, name: 'Beyaynetu', price: 280, category: 'Mains', available: true },
];

export default function KitchenMenuPage() {
  const [menu, setMenu] = useState<MenuItemData[]>(initialMenu);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (item: MenuItemData) => { setEditingItem(item); setIsFormOpen(true); };

  const getFormInitialData = () => {
    if (!editingItem) return undefined;
    return {
      ...editingItem,
      price: editingItem.price.toString(),
    };
  };

  const handleSave = (data: MenuSaveData) => {
    if (editingItem) {
      setMenu(prev => prev.map(m => m.id === editingItem.id ? { ...m, ...data, price: parseFloat(data.price) } : m));
    } else {
      setMenu(prev => [...prev, { id: Date.now(), name: data.name, price: parseFloat(data.price), category: data.category, available: data.available }]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Kitchen Menu Items</h2>
        <Button variant="primary" onClick={handleAdd}>+ Add Menu Item</Button>
      </div>

      <AnimatedCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-light text-sm text-brand-dark/60 font-semibold uppercase tracking-wider">
                <th className="p-4">Menu Item</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm font-body divide-y divide-brand-light">
              {menu.map((item) => (
                <tr key={item.id} className="hover:bg-brand-light/10 transition-colors">
                  <td className="p-4 font-semibold text-brand-dark">{item.name}</td>
                  <td className="p-4 text-brand-dark/70">{item.category}</td>
                  <td className="p-4 text-right font-medium">{item.price.toFixed(2)} ETB</td>
                  <td className="p-4">
                    <Badge variant={item.available ? 'success' : 'danger'}>
                      {item.available ? 'Available' : 'Sold Out'}
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

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}>
        <MenuForm type="kitchen" initialData={getFormInitialData()} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
