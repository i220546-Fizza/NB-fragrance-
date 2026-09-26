import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductGrid from '../components/ProductGrid';
import { usePageMeta } from '../utils/usePageMeta';

export default function Wishlist() {
  usePageMeta('Wishlist', 'Fragrances you have saved to your NB Classic Scents wishlist.');
  const { products, loading, refresh } = useWishlist();

  return (
    <div className="pt-16 md:pt-20 min-h-[70vh]">
      <div className="bg-warm-cream py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="eyebrow text-champagne/90">Saved Fragrances</span>
          <h1 className="section-heading text-cocoa mt-3">Your Wishlist</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProductGrid
          products={products}
          loading={loading}
          onRetry={refresh}
          emptyTitle="Your wishlist is empty"
          emptyMessage="Save fragrances you love by tapping the heart icon on any product."
        />
      </div>
    </div>
  );
}
