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

      {/* Desktop Table View */}
      <div className="hidden md:block">
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
      </div>

      {/* Mobile Cards Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {menu.map((item, idx) => (
          <AnimatedCard 
            key={item.id} 
            delay={idx * 0.05} 
            className="flex flex-col justify-between hover:border-brand-mid transition-all animate-fadeIn"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-body font-semibold text-brand-dark text-base leading-tight">{item.name}</h3>
                <span className="text-xs text-brand-dark/50 mt-1.5 inline-block bg-brand-light px-2.5 py-0.5 rounded-full capitalize font-semibold tracking-wide">
                  {item.category}
                </span>
              </div>
              <Badge variant={item.available ? 'success' : 'danger'}>
                {item.available ? 'Available' : 'Sold Out'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-end mt-4 pt-3 border-t border-brand-light/50">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-brand-dark/40 block font-body font-bold mb-0.5">Selling Price</span>
                <span className="font-mono text-lg font-bold text-brand">
                  {item.price.toFixed(2)} <span className="text-xs font-semibold text-brand-dark/65">ETB</span>
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

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}>
        <MenuForm type="kitchen" initialData={getFormInitialData()} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
