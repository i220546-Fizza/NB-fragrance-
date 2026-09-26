import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';
import { usePageMeta } from '../utils/usePageMeta';
import { FREE_SHIPPING_THRESHOLD } from '../context/CartContext';

export default function Cart() {
  usePageMeta('Your Cart', 'Review the fragrances in your NB Classic Scents collection before checkout.');
  const { items, increment, decrement, removeItem, subtotal, shippingEstimate, total } = useCart();

  return (
    <div className="pt-16 md:pt-20 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="section-heading text-cocoa mb-10">Your Collection</h1>

        {items.length === 0 ? (
          <EmptyState
            title="Your collection is empty"
            message="Discover fragrances crafted to define your presence."
            actionLabel="Explore Shop"
            actionTo="/shop"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <ul className="lg:col-span-2 divide-y divide-cocoa/10">
              {items.map((item) => (
                <li key={`${item.product}-${item.size}`} className="flex gap-4 sm:gap-6 py-6">
                  <img
                    src={item.image || '/images/product-placeholder.svg'}
                    alt={item.name}
                    className="h-28 w-24 object-cover rounded-sm bg-warm-cream shrink-0"
                    onError={(e) => ((e.target as HTMLImageElement).src = '/images/product-placeholder.svg')}
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/product/${item.slug}`} className="font-display text-lg text-cocoa hover:text-champagne">
                          {item.name}
                        </Link>
                        <p className="text-xs text-cocoa/50 mt-1">Size: {item.size}</p>
                      </div>
                      <button onClick={() => removeItem(item.product, item.size)} className="text-cocoa/40 hover:text-rose-champagne text-xs uppercase tracking-wide">
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <QuantitySelector
                        value={item.qty}
                        max={item.stock || 99}
                        onChange={(next) => {
                          if (next > item.qty) increment(item.product, item.size);
                          else decrement(item.product, item.size);
                        }}
                      />
                      <span className="font-medium text-cocoa">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="bg-white border border-cocoa/10 rounded-sm p-6 h-fit sticky top-24">
              <h2 className="font-display text-xl text-cocoa mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-cocoa/70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-cocoa/70">
                  <span>Shipping</span>
                  <span>{shippingEstimate === 0 ? 'Free' : formatCurrency(shippingEstimate)}</span>
                </div>
                {shippingEstimate > 0 && (
                  <p className="text-[11px] text-cocoa/45">
                    Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}.
                  </p>
                )}
                <div className="flex justify-between font-medium text-cocoa text-base pt-3 border-t border-cocoa/10">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
              <Link to="/checkout" className="btn-primary w-full mt-6">
                Proceed to Checkout
              </Link>
              <Link to="/shop" className="block text-center text-xs uppercase tracking-wide text-cocoa/60 hover:text-champagne mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
