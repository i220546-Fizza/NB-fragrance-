import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { getApiErrorMessage } from '../../services/api';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import { usePageMeta } from '../../utils/usePageMeta';
import { useToast } from '../../components/ToastHost';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorNotice from '../../components/ErrorNotice';
import EmptyState from '../../components/EmptyState';

export default function AdminProducts() {
  usePageMeta('Manage Products', 'Manage the NB Classic Scents product catalogue.');
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    productService
      .list({ search: search || undefined, limit: 100 })
      .then((res) => setProducts(res.products))
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load products.')))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const t = window.setTimeout(load, 350);
    return () => window.clearTimeout(t);
  }, [load]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast('Product deleted.');
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to delete this product.'), 'error');
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-cocoa">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="input-field max-w-sm mb-6"
      />

      {loading ? (
        <LoadingSpinner label="Loading products" dark />
      ) : error ? (
        <ErrorNotice message={error} onRetry={load} />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="Try a different search or add your first fragrance." actionLabel="Add Product" actionTo="/admin/products/new" />
      ) : (
        <div className="bg-white border border-cocoa/10 rounded-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-cocoa/50 text-xs uppercase tracking-wide border-b border-cocoa/10">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-cocoa/5 hover:bg-warm-cream/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || '/images/product-placeholder.svg'} alt={p.name} className="h-10 w-10 rounded-sm object-cover bg-warm-cream" />
                      <div>
                        <p className="text-cocoa font-medium">{p.name}</p>
                        <p className="text-xs text-cocoa/50">{p.gender} &middot; {p.fragranceFamily}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-cocoa/70">{p.collectionName}</td>
                  <td className="py-3 px-4 text-cocoa">
                    {p.sizes?.length > 1 && <span className="text-[10px] text-cocoa/40 uppercase mr-1">From</span>}
                    {formatCurrency(p.price)}
                  </td>
                  <td className={`py-3 px-4 ${p.stock === 0 ? 'text-rose-champagne' : p.stock < 5 ? 'text-amber-600' : 'text-cocoa/70'}`}>{p.stock}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.featured && <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne/20 text-cocoa">Featured</span>}
                      {p.bestseller && <span className="text-[10px] px-2 py-0.5 rounded-full bg-midnight-navy/10 text-cocoa">Bestseller</span>}
                      {p.isNewArrival && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-champagne/20 text-cocoa">New</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link to={`/admin/products/${p._id}/edit`} className="text-champagne hover:text-soft-gold text-xs uppercase tracking-wide mr-4">
                      Edit
                    </Link>
                    {confirmId === p._id ? (
                      <span className="inline-flex items-center gap-2">
                        <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="text-rose-champagne text-xs uppercase tracking-wide">
                          Confirm
                        </button>
                        <button onClick={() => setConfirmId(null)} className="text-cocoa/40 text-xs uppercase tracking-wide">
                          Cancel
                        </button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmId(p._id)} className="text-cocoa/50 hover:text-rose-champagne text-xs uppercase tracking-wide">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
