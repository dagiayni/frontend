"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Determine active section
  const isBar = pathname?.includes('/inventory/bar');
  const isKitchen = pathname?.includes('/inventory/kitchen');

  const currentSection = isBar ? 'bar' : 'kitchen';

  const subTabs = [
    { name: 'Stock', path: `/inventory/${currentSection}/stock` },
    { name: 'Menu', path: `/inventory/${currentSection}/menu` },
    { name: 'Recipes', path: `/inventory/${currentSection}/recipes` },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Main Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark">Inventory Management</h1>
          <p className="text-sm text-brand-dark/60 font-body mt-1">Manage stock, menus, and recipes for the Bar and Kitchen.</p>
        </div>
        
        {/* Bar / Kitchen Toggle */}
        <div className="flex bg-white rounded-lg shadow-sm border border-brand-light p-1 w-full sm:w-auto shrink-0">
          <Link
            href="/inventory/bar/stock"
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-semibold text-center text-sm transition-colors ${
              isBar ? 'bg-brand text-white shadow' : 'text-brand-dark hover:bg-brand-light/30'
            }`}
          >
            Bar Inventory
          </Link>
          <Link
            href="/inventory/kitchen/stock"
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md font-semibold text-center text-sm transition-colors ${
              isKitchen ? 'bg-brand text-white shadow' : 'text-brand-dark hover:bg-brand-light/30'
            }`}
          >
            Kitchen Inventory
          </Link>
        </div>
      </div>

      {/* Sub Navigation (Stock, Menu, Recipes) */}
      <div className="border-b border-brand-light overflow-x-auto scrollbar-none">
        <nav className="-mb-px flex space-x-8 flex-nowrap min-w-max pb-1">
          {subTabs.map((tab) => {
            const isActive = pathname?.startsWith(tab.path);
            return (
              <Link
                key={tab.name}
                href={tab.path}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors
                  ${isActive 
                    ? 'border-brand text-brand' 
                    : 'border-transparent text-brand-dark/60 hover:text-brand hover:border-brand-light'
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Page Content Rendered Here */}
      <div className="pt-4">
        {children}
      </div>

    </div>
  );
}
