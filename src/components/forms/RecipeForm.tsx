import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface Ingredient {
  name: string;
  qty: string;
  unit: string;
}

interface RecipeFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  type: 'bar' | 'kitchen';
}

export function RecipeForm({ initialData, onSave, onCancel, type }: RecipeFormProps) {
  const [menuItem, setMenuItem] = useState(initialData?.menuItem || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || [{ name: '', qty: '', unit: 'g' }]
  );

  const units = [
    { label: 'Grams (g)', value: 'g' },
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Milliliters (ml)', value: 'ml' },
    { label: 'Liters (L)', value: 'L' },
    { label: 'Pieces (pcs)', value: 'pcs' },
  ];

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', qty: '', unit: 'g' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients(prev =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ menuItem, ingredients });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1">
        <Input
          label="Menu Item Name"
          name="menuItem"
          value={menuItem}
          onChange={(e) => setMenuItem(e.target.value)}
          placeholder={type === 'bar' ? "e.g. Vodka Martini" : "e.g. Special Tibs"}
          required
        />

        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider">Ingredients</h3>
            <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
              + Add Ingredient
            </Button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-end gap-2 bg-brand-light/10 rounded-lg p-3 border border-brand-light/50">
                <div className="flex-[2]">
                  <Input
                    label={idx === 0 ? "Ingredient" : ""}
                    name={`ing-name-${idx}`}
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                    placeholder="e.g. Vodka"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={idx === 0 ? "Qty" : ""}
                    name={`ing-qty-${idx}`}
                    type="number"
                    step="0.01"
                    value={ing.qty}
                    onChange={(e) => updateIngredient(idx, 'qty', e.target.value)}
                    placeholder="0.0"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Select
                    label={idx === 0 ? "Unit" : ""}
                    name={`ing-unit-${idx}`}
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, 'unit', e.target.value)}
                    options={units}
                  />
                </div>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(idx)}
                    className="mb-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove ingredient"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-brand-light flex justify-end gap-3 shrink-0">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary">Save Recipe</Button>
      </div>
    </form>
  );
}
