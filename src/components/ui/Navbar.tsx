"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>('owner');
  const [userName, setUserName] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isDisplayOpen, setIsDisplayOpen] = useState(false);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.role) setUserRole(user.role);
      if (user.name) setUserName(user.name);
    }
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/finance')) {
      setIsFinanceOpen(true);
    }
    if (pathname?.startsWith('/display')) {
      setIsDisplayOpen(true);
    }
  }, [pathname]);

  const hasAccess = (roles: string[]) => roles.includes(userRole);

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', roles: ['owner', 'manager'] },
    { name: 'POS / Order', path: '/pos', roles: ['owner', 'manager', 'cashier', 'waiter'] },
    { name: 'Table Management', path: '/table-management', roles: ['owner', 'manager', 'cashier', 'waiter'] },
  ];

  const financeSubLinks = [
    { name: 'Revenue Management', path: '/finance/revenue', roles: ['owner', 'manager'] },
    { name: 'Expenses Management', path: '/finance/expenses', roles: ['owner', 'manager'] },
    { name: 'Bill Management', path: '/finance/bills', roles: ['owner', 'manager'] },
  ];

  const displaySubLinks = [
    { name: 'Kitchen Display', path: '/display/kitchen', roles: ['owner', 'manager', 'kitchen'] },
    { name: 'Bar Display', path: '/display/bar', roles: ['owner', 'manager', 'waiter', 'kitchen'] },
  ];

  const bottomLinks = [
    { name: 'Butchery', path: '/butchery', roles: ['owner', 'manager', 'kitchen'] },
    { name: 'Inventory', path: '/inventory', roles: ['owner', 'manager'] },
    { name: 'Customers', path: '/customers', roles: ['owner', 'manager', 'cashier'] },
    { name: 'Employees', path: '/employees', roles: ['owner', 'manager'] },
    { name: 'Settings', path: '/settings', roles: ['owner'] },
  ];

  const renderLink = (link: { name: string; path: string }, isSub = false) => {
    const isActive = pathname === link.path || (!isSub && pathname?.startsWith(link.path) && link.path !== '/dashboard');
    return (
      <Link
        key={link.name}
        href={link.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`block font-body text-sm font-semibold transition-colors ${
          isSub 
            ? 'pl-10 pr-6 py-2.5 text-white/60 hover:text-white hover:bg-brand/30' 
            : 'px-6 py-3.5 text-white/70 hover:bg-brand hover:text-white'
        } ${isActive ? (isSub ? 'text-white bg-brand/40 font-bold border-l-2 border-brand-light' : 'bg-brand text-white border-l-4 border-brand-light') : ''}`}
      >
        {link.name}
      </Link>
    );
  };

  const showFinanceDropdown = hasAccess(['owner', 'manager']);
  const showDisplayDropdown = hasAccess(['owner', 'manager', 'kitchen', 'waiter']);

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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex flex-col w-full max-w-[280px] bg-brand-dark text-white h-full shadow-2xl z-10 animate-slideInLeft">
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

            {/* Scrollable Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto">
              {mainLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link))}
              
              {/* Finance Dropdown Mobile */}
              {showFinanceDropdown && (
                <div>
                  <button
                    onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                    className="w-full flex items-center justify-between px-6 py-3.5 font-body text-sm font-semibold text-white/70 hover:bg-brand hover:text-white transition-colors text-left"
                  >
                    <span>Finance Management</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isFinanceOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isFinanceOpen && (
                    <div className="bg-brand-dark/50 border-y border-brand-hover/10 py-1">
                      {financeSubLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link, true))}
                    </div>
                  )}
                </div>
              )}

              {/* Display System Dropdown Mobile */}
              {showDisplayDropdown && (
                <div>
                  <button
                    onClick={() => setIsDisplayOpen(!isDisplayOpen)}
                    className="w-full flex items-center justify-between px-6 py-3.5 font-body text-sm font-semibold text-white/70 hover:bg-brand hover:text-white transition-colors text-left"
                  >
                    <span>Display System</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isDisplayOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDisplayOpen && (
                    <div className="bg-brand-dark/50 border-y border-brand-hover/10 py-1">
                      {displaySubLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link, true))}
                    </div>
                  )}
                </div>
              )}

              {bottomLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link))}
            </nav>

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
      <aside className="w-64 bg-brand-dark text-white min-h-screen hidden md:flex flex-col shrink-0 border-r border-brand-hover/20">
        <div className="p-6 border-b border-brand-hover/30">
          <h1 className="font-display text-2xl font-bold tracking-wide">MANDELA<br/>HOUSE</h1>
          {userName && <div className="mt-4 inline-block px-2 py-1 bg-brand text-xs font-bold rounded capitalize">{userName} ({userRole})</div>}
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {mainLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link))}

          {/* Finance Dropdown Desktop */}
          {showFinanceDropdown && (
            <div>
              <button
                onClick={() => setIsFinanceOpen(!isFinanceOpen)}
                className="w-full flex items-center justify-between px-6 py-3 font-body text-sm font-semibold text-white/70 hover:bg-brand hover:text-white transition-colors text-left"
              >
                <span>Finance Management</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isFinanceOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isFinanceOpen && (
                <div className="bg-brand-dark/40 py-1 transition-all">
                  {financeSubLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link, true))}
                </div>
              )}
            </div>
          )}

          {/* Display System Dropdown Desktop */}
          {showDisplayDropdown && (
            <div>
              <button
                onClick={() => setIsDisplayOpen(!isDisplayOpen)}
                className="w-full flex items-center justify-between px-6 py-3 font-body text-sm font-semibold text-white/70 hover:bg-brand hover:text-white transition-colors text-left"
              >
                <span>Display System</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isDisplayOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDisplayOpen && (
                <div className="bg-brand-dark/40 py-1 transition-all">
                  {displaySubLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link, true))}
                </div>
              )}
            </div>
          )}

          {bottomLinks.filter(l => hasAccess(l.roles)).map(link => renderLink(link))}
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
