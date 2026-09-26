import React from 'react';
import { Link } from 'react-router-dom';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../utils/social';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-midnight-navy text-ivory/70">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src="/images/logo-mark.svg" alt="NB Classic Scents logo" className="h-9 mb-4" />
          <p className="text-sm leading-relaxed max-w-xs">
            Fragrances crafted in small batches to define presence and leave a lasting impression.
          </p>
        </div>
        <div>
          <h4 className="text-ivory text-xs tracking-[0.2em] uppercase mb-4">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-champagne">All Fragrances</Link></li>
            <li><Link to="/collection/Men" className="hover:text-champagne">For Him</Link></li>
            <li><Link to="/collection/Women" className="hover:text-champagne">For Her</Link></li>
            <li><Link to="/collection/Gift Sets" className="hover:text-champagne">Gift Sets</Link></li>
            <li><Link to="/scent-finder" className="hover:text-champagne">Scent Finder</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-ivory text-xs tracking-[0.2em] uppercase mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-champagne">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-champagne">Contact</Link></li>
            <li><Link to="/account" className="hover:text-champagne">My Account</Link></li>
            <li><Link to="/wishlist" className="hover:text-champagne">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-ivory text-xs tracking-[0.2em] uppercase mb-4">Follow Us</h4>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`NB Classic Scents on Instagram, ${INSTAGRAM_HANDLE}`}
            className="inline-flex items-center gap-2.5 group"
          >
            <span className="h-9 w-9 shrink-0 rounded-full border border-champagne/30 flex items-center justify-center text-ivory/70 group-hover:border-champagne group-hover:text-champagne transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </span>
            <span className="text-sm text-ivory/70 group-hover:text-champagne transition-colors">
              Instagram
              <span className="block text-xs text-ivory/45 group-hover:text-champagne/80">{INSTAGRAM_HANDLE}</span>
            </span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/50">
          <span>&copy; {new Date().getFullYear()} NB Classic Scents. All rights reserved.</span>
          <span>Crafted with intention.</span>
        </div>
      </div>
    </footer>
  );
}
