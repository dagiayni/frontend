"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'POS', path: '/pos' },
    { name: 'Kitchen', path: '/kitchen' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Customers', path: '/customers' },
    { name: 'Employees', path: '/employees' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-brand-dark text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-brand-hover/30">
        <h1 className="font-display text-2xl font-bold tracking-wide">MANDELA<br/>HOUSE</h1>
      </div>
      <nav className="flex-1 py-4">
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.path}
            className={`block px-6 py-3 font-body text-sm font-semibold transition-colors ${
              pathname.startsWith(link.path) 
                ? 'bg-brand text-white border-l-4 border-brand-light' 
                : 'text-white/70 hover:bg-brand hover:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-hover/30">
        <button className="w-full text-left px-2 py-2 text-sm text-white/70 hover:text-white transition-colors" onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>
          Log out
        </button>
      </div>
    </aside>
  );
}
