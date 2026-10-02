import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/scent-finder', label: 'Scent Finder' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const { products } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setScrolled(window.scrollY > 24);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-offwhite/95 backdrop-blur-md shadow-md border-b border-champagne/15' : 'bg-offwhite/0'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="NB Classic Scents home">
          <img src="/images/logo-mark.svg" alt="NB Classic Scents logo" className="h-9 md:h-10 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
                    isActive ? 'text-champagne' : 'text-cocoa/80 hover:text-champagne'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="hidden sm:flex h-9 w-9 items-center justify-center text-cocoa hover:text-champagne transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/wishlist" aria-label="Wishlist" className="relative h-9 w-9 hidden sm:flex items-center justify-center text-cocoa hover:text-champagne transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M12 20s-7-4.35-9.5-8.5C.7 8 2 4.5 5.5 4.5c2 0 3.5 1 4.5 2.5.7 1 1 1 1 1s.3 0 1-1c1-1.5 2.5-2.5 4.5-2.5 3.5 0 4.8 3.5 3 7C19 15.65 12 20 12 20z" />
            </svg>
            {products.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-champagne text-midnight-navy text-[9px] flex items-center justify-center font-semibold">
                {products.length}
              </span>
            )}
          </Link>

          <button
            aria-label="Open cart"
            onClick={openDrawer}
            className="relative h-9 w-9 flex items-center justify-center text-cocoa hover:text-champagne transition-colors"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L4.5 3H2" strokeLinecap="round" />
              <circle cx="9.5" cy="19.5" r="1.4" />
              <circle cx="17.5" cy="19.5" r="1.4" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-champagne text-midnight-navy text-[9px] flex items-center justify-center font-semibold">
                {itemCount}
              </span>
            )}
          </button>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative group">
                <Link to="/account" className="text-xs tracking-[0.15em] uppercase text-cocoa/90 hover:text-champagne">
                  {user?.name?.split(' ')[0] ?? 'Account'}
                </Link>
                <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col bg-white border border-cocoa/10 rounded-sm py-2 min-w-[160px] shadow-lg">
                  <Link to="/account" className="px-4 py-2 text-xs text-cocoa/80 hover:text-champagne uppercase tracking-wide">
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="px-4 py-2 text-xs text-cocoa/80 hover:text-champagne uppercase tracking-wide">
                      Admin
                    </Link>
                  )}
                  <button onClick={logout} className="text-left px-4 py-2 text-xs text-cocoa/80 hover:text-champagne uppercase tracking-wide">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-xs tracking-[0.2em] uppercase text-cocoa/90 hover:text-champagne">
                Sign In
              </Link>
            )}
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden h-9 w-9 flex items-center justify-center text-cocoa"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-champagne/15 bg-offwhite/98 overflow-hidden"
          >
            <form onSubmit={submitSearch} className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fragrances..."
                className="flex-1 bg-transparent border-b border-cocoa/30 text-cocoa placeholder:text-cocoa/40 py-2 focus:outline-none focus:border-champagne text-sm"
              />
              <button type="submit" className="text-champagne text-xs tracking-widest uppercase">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-offwhite z-[60] flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <img src="/images/logo-mark.svg" alt="NB Classic Scents logo" className="h-9" />
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="h-9 w-9 flex items-center justify-center text-cocoa">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <form onSubmit={submitSearch} className="px-6 pt-2 pb-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fragrances..."
                className="w-full bg-transparent border-b border-cocoa/30 text-cocoa placeholder:text-cocoa/40 py-2 focus:outline-none focus:border-champagne text-sm"
              />
            </form>
            <ul className="flex flex-col gap-1 px-6 mt-2">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block py-3 text-lg font-display ${isActive ? 'text-champagne' : 'text-cocoa/90'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li className="border-t border-cocoa/10 mt-2 pt-2">
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-display text-cocoa/90">
                  Wishlist
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/account" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-display text-cocoa/90">
                      My Account
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-display text-cocoa/90">
                        Admin
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="block py-3 text-lg font-display text-cocoa/90 text-left w-full"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block py-3 text-lg font-display text-champagne">
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
