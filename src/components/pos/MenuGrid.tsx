"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  is_available: boolean;
}

interface MenuGridProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export function MenuGrid({ items, onItemClick }: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {/* Categories Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 whitespace-nowrap rounded-full font-body text-sm font-semibold transition-colors ${
              activeCategory === cat 
                ? 'bg-brand text-white' 
                : 'bg-white text-brand border border-brand-light hover:bg-brand-light'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
        {filteredItems.map(item => (
          <button 
            key={item.id}
            onClick={() => onItemClick(item)}
            disabled={!item.is_available}
            className={`text-left transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${!item.is_available ? 'cursor-not-allowed' : ''}`}
          >
            <Card className="h-full flex flex-col justify-between hover:border-brand-mid transition-colors">
              <div className="font-body font-semibold text-gray-900 line-clamp-2 mb-2 leading-snug">
                {item.name}
              </div>
              <div className="font-mono text-brand font-medium">
                {parseFloat(item.price).toFixed(2)} ETB
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
