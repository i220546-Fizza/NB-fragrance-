import React, { useState } from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';
import EmptyState from './EmptyState';
import ErrorNotice from './ErrorNotice';
import QuickViewModal from './QuickViewModal';

export default function ProductGrid({
  products,
  loading,
  error,
  onRetry,
  emptyTitle = 'No fragrances match your filters',
  emptyMessage = 'Try adjusting your search or filters to discover more of the collection.',
  enableQuickView = true,
}: {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  enableQuickView?: boolean;
}) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-warm-beige/60 rounded-sm" />
            <div className="h-3 bg-warm-beige/60 rounded mt-3 w-1/2" />
            <div className="h-4 bg-warm-beige/60 rounded mt-2 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorNotice message={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((p, i) => (
          <ProductCard
            key={p._id}
            product={p}
            index={i}
            onQuickView={enableQuickView ? setQuickViewProduct : undefined}
          />
        ))}
      </div>
      {enableQuickView && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </>
  );
}
