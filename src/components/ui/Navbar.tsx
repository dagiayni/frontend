"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>('owner');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.role) setUserRole(user.role);
      if (user.name) setUserName(user.name);
    }
  }, []);

  const allLinks = [
    { name: 'POS', path: '/pos', roles: ['owner', 'manager', 'cashier', 'waiter'] },
    { name: 'Kitchen', path: '/kitchen', roles: ['owner', 'manager', 'kitchen'] },
    { name: 'Inventory', path: '/inventory', roles: ['owner', 'manager'] },
    { name: 'Customers', path: '/customers', roles: ['owner', 'manager', 'cashier'] },
    { name: 'Employees', path: '/employees', roles: ['owner', 'manager'] },
    { name: 'Analytics', path: '/analytics', roles: ['owner', 'manager'] },
    { name: 'Settings', path: '/settings', roles: ['owner'] },
  ];

  const links = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <aside className="w-64 bg-brand-dark text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-brand-hover/30">
        <h1 className="font-display text-2xl font-bold tracking-wide">MANDELA<br/>HOUSE</h1>
        {userName && <div className="mt-4 inline-block px-2 py-1 bg-brand text-xs font-bold rounded capitalize">{userName} ({userRole})</div>}
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
