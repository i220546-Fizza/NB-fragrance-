import React, { useCallback, useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import { getApiErrorMessage } from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import OrderTable from '../../components/OrderTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorNotice from '../../components/ErrorNotice';
import EmptyState from '../../components/EmptyState';
import { usePageMeta } from '../../utils/usePageMeta';

const STATUSES: (OrderStatus | '')[] = ['', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  usePageMeta('Manage Orders', 'Manage NB Classic Scents customer orders.');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    orderService
      .list({ status: status || undefined, search: search || undefined })
      .then(setOrders)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load orders.')))
      .finally(() => setLoading(false));
  }, [status, search]);

  useEffect(() => {
    const t = window.setTimeout(load, 300);
    return () => window.clearTimeout(t);
  }, [load]);

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-6">Orders</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by customer name or email..."
          className="input-field max-w-sm"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus | '')} className="input-field w-auto">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s || 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading orders" dark />
      ) : error ? (
        <ErrorNotice message={error} onRetry={load} />
      ) : orders.length === 0 ? (
        <EmptyState title="No orders found" message="Orders will appear here as customers check out." />
      ) : (
        <div className="bg-white border border-cocoa/10 rounded-sm">
          <OrderTable orders={orders} adminLink />
        </div>
      )}
    </div>
  );
}
