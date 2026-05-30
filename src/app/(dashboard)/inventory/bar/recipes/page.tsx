"use client";

import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/Button';

export default function BarRecipesPage() {
  const mockRecipes = [
    { 
      id: 1, 
      menuItem: 'Vodka Martini', 
      ingredients: [
        { name: 'Vodka', qty: 60, unit: 'ml' },
        { name: 'Dry Vermouth', qty: 15, unit: 'ml' },
        { name: 'Olive', qty: 1, unit: 'pcs' }
      ]
    },
    { 
      id: 2, 
      menuItem: 'Margarita', 
      ingredients: [
        { name: 'Tequila', qty: 50, unit: 'ml' },
        { name: 'Lime Juice', qty: 25, unit: 'ml' },
        { name: 'Triple Sec', qty: 20, unit: 'ml' }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Bar Recipes</h2>
        <Button variant="primary">+ Create Recipe</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockRecipes.map((recipe, idx) => (
          <AnimatedCard key={recipe.id} delay={idx * 0.1}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-display text-xl font-bold text-brand-dark">{recipe.menuItem}</h3>
              <button className="text-brand hover:text-brand-dark font-semibold text-xs uppercase tracking-wide">Edit</button>
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
    </div>
  );
}
