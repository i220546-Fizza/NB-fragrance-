import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/homepage', label: 'Homepage' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-warm-cream">
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-midnight-navy text-ivory flex flex-col transition-transform duration-300 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo-mark.svg" alt="NB Classic Scents logo" className="h-8" />
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-sm text-sm tracking-wide transition-colors ${
                  isActive ? 'bg-champagne/15 text-champagne' : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-xs text-ivory/50 mb-2">Signed in as</p>
          <p className="text-sm text-ivory mb-3">{user?.name}</p>
          <button onClick={logout} className="text-xs tracking-wide uppercase text-champagne hover:text-soft-gold">
            Sign Out
          </button>
        </div>
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-cocoa/10 flex items-center justify-between px-4 sm:px-8 lg:hidden">
          <button aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="text-cocoa">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
          <span className="font-display text-cocoa">Admin</span>
          <Link to="/" className="text-xs uppercase tracking-wide text-cocoa/60">
            View Site
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
