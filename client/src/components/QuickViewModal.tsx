import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import StarRating from './StarRating';
import QuantitySelector from './QuantitySelector';
import SizeSelector from './SizeSelector';
import { useCart } from '../context/CartContext';
import { useToast } from './ToastHost';

export default function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    setQty(1);
    setSelectedSize(null);
    setSizeError(false);
  }, [product?._id]);

  const activePrice = product?.sizes.find((s) => s.size === selectedSize)?.price ?? product?.price;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="fixed inset-0 bg-midnight-navy/70 backdrop-blur-sm z-[110]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view of ${product.name}`}
            className="fixed inset-x-4 top-1/2 sm:inset-x-auto sm:left-1/2 -translate-y-1/2 sm:-translate-x-1/2 z-[120] bg-offwhite rounded-sm max-w-2xl w-auto sm:w-full mx-auto grid grid-cols-1 sm:grid-cols-2 overflow-hidden max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button onClick={onClose} aria-label="Close quick view" className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3F332A" strokeWidth="1.6">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <div className="bg-warm-cream aspect-square sm:aspect-auto">
              <img
                src={product.images?.[0] || '/images/product-placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col overflow-y-auto">
              <span className="text-[10px] tracking-[0.2em] uppercase text-champagne">{product.collectionName}</span>
              <h3 className="font-display text-2xl text-cocoa mt-1">{product.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={product.rating} size={13} />
                <span className="text-xs text-cocoa/50">({product.numReviews})</span>
              </div>
              <p className="text-lg font-medium text-cocoa mt-3">
                {!selectedSize && product.sizes.length > 1 && (
                  <span className="text-[10px] text-cocoa/45 uppercase tracking-wide mr-1">From</span>
                )}
                {formatCurrency(activePrice ?? 0)}
              </p>
              <p className="text-sm text-cocoa/60 mt-3 line-clamp-3">{product.description}</p>

              <p className="label-field mt-5 mb-2">Select Size</p>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={(s) => {
                  setSelectedSize(s);
                  setSizeError(false);
                }}
                compact
                layoutId="quickview-size-bg"
              />
              {sizeError && <p className="text-xs text-rose-champagne mt-2">Please select a bottle size.</p>}

              <div className="mt-5 flex items-center gap-3">
                <QuantitySelector value={qty} onChange={setQty} max={Math.max(product.stock, 1)} />
                <button
                  disabled={product.stock === 0}
                  onClick={() => {
                    if (!selectedSize) {
                      setSizeError(true);
                      return;
                    }
                    addItem(product, selectedSize, qty);
                    showToast('Added to your collection.');
                    onClose();
                  }}
                  className="btn-primary flex-1 disabled:opacity-40"
                >
                  {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
              <Link to={`/product/${product.slug}`} onClick={onClose} className="text-xs uppercase tracking-wide text-cocoa/60 hover:text-champagne mt-5 text-center">
                View Full Details
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
