"use client";

import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/Button';
import { SlideOver } from '@/components/ui/SlideOver';
import { RecipeForm } from '@/components/forms/RecipeForm';

interface Recipe {
  id: number;
  menuItem: string;
  ingredients: { name: string; qty: number; unit: string }[];
}

interface IngredientInput {
  name: string;
  qty: string;
  unit: string;
}

interface RecipeSaveData {
  menuItem: string;
  ingredients: IngredientInput[];
}

const initialRecipes: Recipe[] = [
  {
    id: 1,
    menuItem: 'Vodka Martini',
    ingredients: [
      { name: 'Vodka', qty: 60, unit: 'ml' },
      { name: 'Dry Vermouth', qty: 15, unit: 'ml' },
      { name: 'Olive', qty: 1, unit: 'pcs' },
    ],
  },
  {
    id: 2,
    menuItem: 'Margarita',
    ingredients: [
      { name: 'Tequila', qty: 50, unit: 'ml' },
      { name: 'Lime Juice', qty: 25, unit: 'ml' },
      { name: 'Triple Sec', qty: 20, unit: 'ml' },
    ],
  },
];

export default function BarRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Recipe | null>(null);

  const handleAdd = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (recipe: Recipe) => { setEditingItem(recipe); setIsFormOpen(true); };

  const handleSave = (data: RecipeSaveData) => {
    const parsed = {
      ...data,
      ingredients: data.ingredients.map((i: IngredientInput) => ({ ...i, qty: parseFloat(i.qty) })),
    };
    if (editingItem) {
      setRecipes(prev => prev.map(r => r.id === editingItem.id ? { ...r, ...parsed } : r));
    } else {
      setRecipes(prev => [...prev, { id: Date.now(), ...parsed }]);
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Bar Recipes</h2>
        <Button variant="primary" onClick={handleAdd}>+ Create Recipe</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recipes.map((recipe, idx) => (
          <AnimatedCard key={recipe.id} delay={idx * 0.1}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display text-xl font-bold text-brand-dark">{recipe.menuItem}</h3>
              <button onClick={() => handleEdit(recipe)} className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
            </div>
            <div className="bg-brand-light/20 rounded-md p-4 border border-brand-light">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/50 mb-3">Ingredients Needed</h4>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between text-sm font-body">
                    <span className="text-brand-dark font-medium">{ing.name}</span>
                    <span className="text-brand-dark/70">{ing.qty} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <SlideOver isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} title={editingItem ? 'Edit Recipe' : 'Create Recipe'}>
        <RecipeForm type="bar" initialData={editingItem} onSave={handleSave} onCancel={() => { setIsFormOpen(false); setEditingItem(null); }} />
      </SlideOver>
    </div>
  );
}
