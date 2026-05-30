import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface StockFormProps {
  initialData?: any; // To be typed later based on API
  onSave: (data: any) => void;
  onCancel: () => void;
  type: 'bar' | 'kitchen';
}

export function StockForm({ initialData, onSave, onCancel, type }: StockFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || '',
    unit: initialData?.unit || 'kg',
    status: initialData?.status || 'optimal'
  });

  const barCategories = [
    { label: 'Beer', value: 'Beer' },
    { label: 'Spirits', value: 'Spirits' },
    { label: 'Mixers', value: 'Mixers' },
    { label: 'Soft Drinks', value: 'Soft Drinks' },
  ];

  const kitchenCategories = [
    { label: 'Dry Goods', value: 'Dry Goods' },
    { label: 'Spices', value: 'Spices' },
    { label: 'Oils', value: 'Oils' },
    { label: 'Vegetables', value: 'Vegetables' },
    { label: 'Meat', value: 'Meat' },
  ];

  const units = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Liters (L)', value: 'L' },
    { label: 'Pieces (pcs)', value: 'pcs' },
    { label: 'Grams (g)', value: 'g' },
    { label: 'Milliliters (ml)', value: 'ml' },
  ];

  const statuses = [
    { label: 'Optimal', value: 'optimal' },
    { label: 'Low', value: 'low' },
    { label: 'Critical', value: 'critical' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <Input 
          label="Item Name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="e.g. Teff Flour" 
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

        <div className="flex gap-4">
          <div className="flex-1">
            <Input 
              label="Quantity" 
              name="quantity" 
              type="number"
              step="0.01"
              value={formData.quantity} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="flex-1">
            <Select 
              label="Unit" 
              name="unit" 
              value={formData.unit} 
              onChange={handleChange} 
              options={units}
            />
          </div>
        </div>

        <Select 
          label="Status Level" 
          name="status" 
          value={formData.status} 
          onChange={handleChange} 
          options={statuses}
        />
      </div>

      <div className="pt-6 border-t border-brand-light flex justify-end gap-3 shrink-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Item</Button>
      </div>
    </form>
  );
}
