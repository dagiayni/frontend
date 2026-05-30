"use client";

import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function KitchenMenuPage() {
  const mockMenu = [
    { id: 1, name: 'Special Tibs', price: 350, category: 'Mains', available: true },
    { id: 2, name: 'Shiro Tegabino', price: 150, category: 'Mains', available: true },
    { id: 3, name: 'Doro Wat', price: 450, category: 'Mains', available: true },
    { id: 4, name: 'Kitfo', price: 400, category: 'Mains', available: false },
    { id: 5, name: 'Beyaynetu', price: 280, category: 'Mains', available: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-2xl font-bold text-brand-dark">Kitchen Menu Items</h2>
        <Button variant="primary">+ Add Menu Item</Button>
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
              {mockMenu.map((item) => (
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
