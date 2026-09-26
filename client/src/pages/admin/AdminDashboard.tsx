import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { getApiErrorMessage } from '../../services/api';
import type { AdminStats } from '../../types';
import StatCard from '../../components/StatCard';
import SalesTrendChart from '../../components/SalesTrendChart';
import OrderTable from '../../components/OrderTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorNotice from '../../components/ErrorNotice';
import { formatCurrency } from '../../utils/formatCurrency';
import { usePageMeta } from '../../utils/usePageMeta';

export default function AdminDashboard() {
  usePageMeta('Admin Dashboard', 'NB Classic Scents admin dashboard overview.');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    adminService
      .getStats()
      .then(setStats)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load dashboard statistics.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingSpinner label="Loading dashboard" dark />;
  if (error || !stats) return <ErrorNotice message={error ?? 'No data available.'} onRetry={load} />;

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        <StatCard label="Total Orders" value={stats.totalOrders} accent />
        <StatCard label="Total Sales" value={formatCurrency(stats.totalSales)} />
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Low Stock" value={stats.lowStockCount} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white border border-cocoa/10 rounded-sm p-6">
          <SalesTrendChart data={stats.salesTrend} />
        </div>
        <div className="bg-white border border-cocoa/10 rounded-sm p-6">
          <h4 className="text-xs tracking-[0.15em] uppercase text-cocoa/50 mb-4">Order Status Breakdown</h4>
          <ul className="space-y-3">
            {Object.entries(stats.statusBreakdown ?? {}).map(([status, count]) => (
              <li key={status} className="flex items-center justify-between text-sm">
                <span className="text-cocoa/70">{status}</span>
                <span className="font-medium text-cocoa">{count}</span>
              </li>
            ))}
            {Object.keys(stats.statusBreakdown ?? {}).length === 0 && (
              <p className="text-sm text-cocoa/50">No order data yet.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white border border-cocoa/10 rounded-sm p-6">
        <h4 className="text-xs tracking-[0.15em] uppercase text-cocoa/50 mb-4">Recent Orders</h4>
        {stats.recentOrders?.length ? (
          <OrderTable orders={stats.recentOrders} adminLink />
        ) : (
          <p className="text-sm text-cocoa/50">No recent orders.</p>
        )}
      </div>
    </div>
  );
}
