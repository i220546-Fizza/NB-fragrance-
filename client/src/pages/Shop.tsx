import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { getApiErrorMessage } from '../services/api';
import type { FragranceFamily, Gender, Product } from '../types';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar, { emptyFilters, ShopFilters } from '../components/FilterSidebar';
import { usePageMeta } from '../utils/usePageMeta';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

function parseFiltersFromParams(params: URLSearchParams): ShopFilters {
  return {
    gender: (params.get('gender')?.split(',').filter(Boolean) as Gender[]) ?? [],
    fragranceFamily: (params.get('fragranceFamily')?.split(',').filter(Boolean) as FragranceFamily[]) ?? [],
    minPrice: params.get('minPrice') ?? '',
    maxPrice: params.get('maxPrice') ?? '',
    featured: params.get('featured') === 'true',
    bestseller: params.get('bestseller') === 'true',
    newArrival: params.get('newArrival') === 'true',
  };
}

export default function Shop() {
  usePageMeta('Shop All Fragrances', 'Browse the full NB Classic Scents catalogue — filter by gender, fragrance family, and price to find your signature scent.');
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const debounceRef = useRef<number | null>(null);

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);
  const search = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const page = Number(searchParams.get('page') ?? '1');
  const collectionParam = searchParams.get('collection') ?? '';

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const applyFilters = (next: ShopFilters) => {
    updateParams({
      gender: next.gender.join(','),
      fragranceFamily: next.fragranceFamily.join(','),
      minPrice: next.minPrice,
      maxPrice: next.maxPrice,
      featured: next.featured ? 'true' : undefined,
      bestseller: next.bestseller ? 'true' : undefined,
      newArrival: next.newArrival ? 'true' : undefined,
      page: undefined,
    });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(search ? { search } : {}));
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const onSearchInput = (value: string) => {
    setSearchInput(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      updateParams({ search: value || undefined, page: undefined });
    }, 450);
  };

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    productService
      .list({
        search: search || undefined,
        gender: filters.gender.join(',') || undefined,
        fragranceFamily: filters.fragranceFamily.join(',') || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        featured: filters.featured || undefined,
        bestseller: filters.bestseller || undefined,
        newArrival: filters.newArrival || undefined,
        collectionName: collectionParam || undefined,
        sort: sort || undefined,
        page,
        limit: 12,
      })
      .then((res) => {
        setProducts(res.products);
        setTotal(res.total);
        setPages(res.pages);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load fragrances right now.')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, JSON.stringify(filters), sort, page, collectionParam]);

  useEffect(() => {
    load();
  }, [load]);

  const activeFilterCount =
    filters.gender.length + filters.fragranceFamily.length + (filters.featured ? 1 : 0) + (filters.bestseller ? 1 : 0) + (filters.newArrival ? 1 : 0) + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  return (
    <div className="pt-16 md:pt-20">
      <div className="bg-offwhite py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="eyebrow text-champagne/90">The Full Collection</span>
          <h1 className="section-heading text-cocoa mt-3">Shop All Fragrances</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
        <aside className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={applyFilters} onClear={clearFilters} />
        </aside>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  value={searchInput}
                  onChange={(e) => onSearchInput(e.target.value)}
                  placeholder="Search fragrances..."
                  className="input-field pl-9 w-full sm:w-64"
                  aria-label="Search fragrances"
                />
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3F332A" strokeOpacity="0.4" strokeWidth="1.8" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                </svg>
              </div>
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden btn-outline-dark whitespace-nowrap"
              >
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-cocoa/50 hidden sm:inline">{total} results</span>
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value || undefined, page: undefined })}
                className="input-field !py-2 text-xs w-auto"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {collectionParam && (
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xs text-cocoa/60">Collection: {collectionParam}</span>
              <button onClick={() => updateParams({ collection: undefined })} className="text-xs text-champagne hover:text-soft-gold">
                Clear
              </button>
            </div>
          )}

          <ProductGrid products={products} loading={loading} error={error} onRetry={load} />

          {!loading && !error && pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParams({ page: String(i + 1) })}
                  className={`h-9 w-9 rounded-sm text-sm border transition-colors ${
                    page === i + 1 ? 'bg-midnight-navy text-champagne border-midnight-navy' : 'border-cocoa/15 text-cocoa/70 hover:border-champagne'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-midnight-navy/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-xs bg-offwhite overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3F332A" strokeWidth="1.6">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={applyFilters} onClear={clearFilters} />
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full mt-6">
              Show {total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
