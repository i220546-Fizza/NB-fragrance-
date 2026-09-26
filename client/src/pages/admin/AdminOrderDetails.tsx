import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { getApiErrorMessage } from '../../services/api';
import type { Order, OrderStatus } from '../../types';
import OrderSummaryDetail from '../../components/OrderSummaryDetail';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorNotice from '../../components/ErrorNotice';
import { useToast } from '../../components/ToastHost';
import { usePageMeta } from '../../utils/usePageMeta';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetails() {
  const { id = '' } = useParams();
  usePageMeta('Order Details', 'View and update NB Classic Scents order details.');
  const { showToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    orderService
      .getOne(id)
      .then(setOrder)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load this order.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const updateStatus = async (status: OrderStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const updated = await orderService.updateStatus(order._id, status);
      setOrder(updated);
      showToast(`Order status updated to ${status}.`);
    } catch (err) {
      showToast(getApiErrorMessage(err, 'Unable to update order status.'), 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading order" dark />;
  if (error || !order) return <ErrorNotice message={error ?? 'Order not found.'} onRetry={load} />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="text-xs uppercase tracking-wide text-cocoa/50 hover:text-champagne mb-4 inline-block">
        &larr; Back to Orders
      </Link>
      <h1 className="font-display text-2xl md:text-3xl text-cocoa mb-6">Order Details</h1>

      <div className="bg-white border border-cocoa/10 rounded-sm p-6 mb-6">
        <label className="label-field">Update Status</label>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              disabled={updating}
              onClick={() => updateStatus(s)}
              className={`text-xs px-3.5 py-2 rounded-full border transition-colors disabled:opacity-50 ${
                order.status === s ? 'bg-midnight-navy text-champagne border-midnight-navy' : 'border-cocoa/20 text-cocoa/70 hover:border-champagne'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-cocoa/10 rounded-sm p-6 sm:p-8">
        <OrderSummaryDetail order={order} />
      </div>
    </div>
  );
}
