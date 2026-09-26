import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { getApiErrorMessage } from '../services/api';
import type { Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import { usePageMeta } from '../utils/usePageMeta';

export default function Collection() {
  const { category = '' } = useParams();
  usePageMeta(`${category} Collection`, `Explore NB Classic Scents fragrances curated for ${category}.`);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    productService
      .list({ category, limit: 24 })
      .then((res) => setProducts(res.products))
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load this collection right now.')))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="pt-16 md:pt-20">
      <div className="bg-warm-cream py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="eyebrow text-champagne/90">Curated Collection</span>
          <h1 className="section-heading text-cocoa mt-3">{category}</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProductGrid
          products={products}
          loading={loading}
          error={error}
          onRetry={load}
          emptyTitle="No fragrances in this collection yet"
          emptyMessage="Explore our full shop to find your signature scent."
        />
      </div>
    </div>
  );
}
