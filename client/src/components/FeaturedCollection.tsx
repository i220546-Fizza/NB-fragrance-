import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { getApiErrorMessage } from '../services/api';
import type { Product } from '../types';
import ProductGrid from './ProductGrid';
import Reveal from './Reveal';

export default function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    productService
      .list({ featured: true, limit: 8 })
      .then((res) => setProducts(res.products))
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load featured fragrances.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="eyebrow text-champagne/90">Curated For You</span>
          <h2 className="section-heading text-cocoa mt-3">Featured Fragrances</h2>
          <div className="gold-divider mx-auto mt-5" />
        </Reveal>
        <ProductGrid products={products} loading={loading} error={error} onRetry={load} emptyTitle="No featured fragrances yet" emptyMessage="Check back soon for curated selections." />
        <div className="text-center mt-12">
          <Link to="/shop" className="btn-outline-dark">
            View All Fragrances
          </Link>
        </div>
      </div>
    </section>
  );
}
