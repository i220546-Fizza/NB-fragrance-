import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from './ToastHost';
import StarRating from './StarRating';

export default function ProductCard({
  product,
  index = 0,
  onQuickView,
}: {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [imgError, setImgError] = useState(false);
  const wished = isWishlisted(product._id);
  const image = !imgError && product.images?.[0] ? product.images[0] : '/images/product-placeholder.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: Math.min(index, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden border border-cocoa/10 hover:border-champagne/50 hover:shadow-gold-sm transition-all duration-500"
    >
      <button
        type="button"
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={(e) => {
          e.preventDefault();
          toggle(product);
        }}
        className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill={wished ? '#D6B77C' : 'none'} stroke="#3A2C25" strokeWidth="1.4">
          <path d="M12 20s-7-4.35-9.5-8.5C.7 8 2 4.5 5.5 4.5c2 0 3.5 1 4.5 2.5.7 1 1 1 1 1s.3 0 1-1c1-1.5 2.5-2.5 4.5-2.5 3.5 0 4.8 3.5 3 7C19 15.65 12 20 12 20z" />
        </svg>
      </button>

      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-warm-cream">
        <img
          src={image}
          alt={`${product.name} — ${product.collectionName} collection fragrance bottle`}
          loading="lazy"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute top-3 left-3 bg-midnight-navy/90 text-champagne text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            Bestseller
          </span>
        )}
        {product.isNewArrival && !product.bestseller && (
          <span className="absolute top-3 left-3 bg-champagne text-midnight-navy text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            New
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute bottom-3 left-3 bg-espresso/90 text-ivory text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm">
            Sold Out
          </span>
        )}
        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center bg-ivory/95 text-cocoa text-[10px] tracking-[0.18em] uppercase py-2.5 rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400"
          >
            Quick View
          </button>
        )}
      </Link>

      <div className="flex flex-col gap-1.5 p-4 flex-1">
        <span className="text-[10px] tracking-[0.2em] uppercase text-champagne/90">{product.collectionName}</span>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-lg leading-snug text-cocoa hover:text-espresso transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[11px] text-cocoa/50">({product.numReviews})</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-medium text-cocoa">
            {product.sizes.length > 1 && <span className="text-[10px] text-cocoa/45 uppercase tracking-wide mr-1">From</span>}
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            disabled={product.stock === 0}
            onClick={(e) => {
              e.preventDefault();
              const cheapest = [...product.sizes].sort((a, b) => a.price - b.price)[0];
              if (!cheapest) return;
              addItem(product, cheapest.size, 1);
              showToast(`Added ${cheapest.size} to your collection.`);
            }}
            className="text-[10px] tracking-[0.15em] uppercase font-semibold text-cocoa border-b border-champagne pb-0.5 hover:text-champagne transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
