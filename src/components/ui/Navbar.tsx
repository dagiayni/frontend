"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>('owner');
  const [userName, setUserName] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-brand-dark text-white h-16 px-4 flex items-center justify-between shadow-md md:hidden shrink-0 w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-md hover:bg-brand-hover/50 text-white transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display font-bold text-xl tracking-wide">MANDELA HOUSE</span>
        </div>
        {userName && (
          <div className="px-2.5 py-1 bg-brand text-[10px] font-bold rounded capitalize tracking-wide shadow-sm">
            {userName} ({userRole})
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop with subtle blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content container */}
          <div className="relative flex flex-col w-full max-w-[280px] bg-brand-dark text-white h-full shadow-2xl z-10 animate-slideInLeft">
            {/* Close Button & Brand Title */}
            <div className="p-6 border-b border-brand-hover/30 flex justify-between items-center">
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wide leading-none">MANDELA</h1>
                <span className="font-display text-lg font-semibold tracking-wide text-brand-light/70">HOUSE</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-brand-hover/50 text-white transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Navigation Links */}
            <nav className="flex-1 py-4 overflow-y-auto">
              {links.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3.5 font-body text-sm font-semibold transition-colors ${
                    pathname.startsWith(link.path) 
                      ? 'bg-brand text-white border-l-4 border-brand-light' 
                      : 'text-white/70 hover:bg-brand hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Sidebar Footer */}
            <div className="p-4 border-t border-brand-hover/30">
              {userName && (
                <div className="mb-4 px-4 py-2 bg-brand/20 rounded capitalize text-xs text-brand-light/90">
                  Staff: <span className="font-bold text-white">{userName}</span> ({userRole})
                </div>
              )}
              <button 
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white/70 hover:text-white hover:bg-red-950/20 rounded-md transition-colors flex items-center gap-2" 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Persistent Sidebar */}
      <aside className="w-64 bg-brand-dark text-white min-h-screen hidden md:flex flex-col shrink-0">
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
    </>
  );
}
