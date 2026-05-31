import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface MenuItemData {
  name: string;
  category: string;
  price: string;
  available: boolean;
}

interface MenuFormProps {
  initialData?: Partial<MenuItemData>;
  onSave: (data: MenuItemData) => void;
  onCancel: () => void;
  type: 'bar' | 'kitchen';
}

export function MenuForm({ initialData, onSave, onCancel, type }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    available: initialData?.available ?? true
  });

  const barCategories = [
    { label: 'Beer', value: 'Beer' },
    { label: 'Cocktails', value: 'Cocktails' },
    { label: 'Soft Drinks', value: 'Soft Drinks' },
  ];

  const kitchenCategories = [
    { label: 'Mains', value: 'Mains' },
    { label: 'Appetizers', value: 'Appetizers' },
    { label: 'Desserts', value: 'Desserts' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <Input 
          label="Menu Item Name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder={type === 'bar' ? "e.g. Margarita" : "e.g. Special Tibs"} 
          required 
        />
        
        <Select 
          label="Category" 
          name="category" 
          value={formData.category} 
          onChange={handleChange} 
          options={type === 'bar' ? barCategories : kitchenCategories}
          required
        />

        <Input 
          label="Selling Price (ETB)" 
          name="price" 
          type="number"
          step="0.01"
          value={formData.price} 
          onChange={handleChange} 
          required 
        />

        <div className="flex items-center mt-4">
          <input
            id="available"
            name="available"
            type="checkbox"
            checked={formData.available}
            onChange={handleChange}
            className="h-4 w-4 text-brand focus:ring-brand border-gray-300 rounded"
          />
          <label htmlFor="available" className="ml-2 block text-sm text-brand-dark font-body font-medium">
            Item is currently available for sale
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-brand-light flex justify-end gap-3 shrink-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Menu Item</Button>
      </div>
    </form>
  );
}
