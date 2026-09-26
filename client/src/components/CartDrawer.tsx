import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import QuantitySelector from './QuantitySelector';
import EmptyState from './EmptyState';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, increment, decrement, removeItem, subtotal } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-midnight-navy/60 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-ivory z-[100] flex flex-col shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-cocoa/10">
              <h2 className="font-display text-xl text-cocoa">Your Collection</h2>
              <button aria-label="Close cart" onClick={closeDrawer} className="h-8 w-8 flex items-center justify-center text-cocoa/70 hover:text-cocoa">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <EmptyState title="Your collection is empty" message="Discover fragrances crafted to define your presence." actionLabel="Explore Shop" actionTo="/shop" />
              ) : (
                <ul className="flex flex-col divide-y divide-cocoa/10">
                  {items.map((item) => (
                    <li key={`${item.product}-${item.size}`} className="flex gap-4 py-5">
                      <img
                        src={item.image || '/images/product-placeholder.svg'}
                        alt={item.name}
                        className="h-24 w-20 object-cover rounded-sm bg-warm-cream shrink-0"
                        onError={(e) => ((e.target as HTMLImageElement).src = '/images/product-placeholder.svg')}
                      />
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link to={`/product/${item.slug}`} onClick={closeDrawer} className="font-display text-base text-cocoa leading-snug hover:text-champagne">
                              {item.name}
                            </Link>
                            <p className="text-xs text-cocoa/50 mt-0.5">{item.size}</p>
                          </div>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeItem(item.product, item.size)}
                            className="text-cocoa/40 hover:text-rose-champagne text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <QuantitySelector
                            value={item.qty}
                            max={item.stock || 99}
                            onChange={(next) => {
                              if (next > item.qty) increment(item.product, item.size);
                              else decrement(item.product, item.size);
                            }}
                          />
                          <span className="text-sm font-medium text-cocoa">{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-cocoa/10 px-6 py-5">
                <div className="flex items-center justify-between text-sm text-cocoa/70 mb-4">
                  <span>Subtotal</span>
                  <span className="font-medium text-cocoa">{formatCurrency(subtotal)}</span>
                </div>
                <Link to="/cart" onClick={closeDrawer} className="btn-outline-dark w-full mb-3">
                  View Cart
                </Link>
                <Link to="/checkout" onClick={closeDrawer} className="btn-primary w-full">
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
