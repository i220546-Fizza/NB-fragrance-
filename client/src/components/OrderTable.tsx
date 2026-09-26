import React from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const statusStyles: Record<string, string> = {
  Pending: 'bg-warm-beige text-cocoa',
  Confirmed: 'bg-blue-100 text-blue-800',
  Processing: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-indigo-100 text-indigo-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full tracking-wide ${statusStyles[status] ?? 'bg-cocoa/10 text-cocoa'}`}>
      {status}
    </span>
  );
}

export default function OrderTable({ orders, adminLink = false }: { orders: Order[]; adminLink?: boolean }) {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[640px]">
        <thead>
          <tr className="text-left text-cocoa/50 text-xs uppercase tracking-wide border-b border-cocoa/10">
            <th className="py-3 px-4">Order</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b border-cocoa/5 hover:bg-warm-cream/40">
              <td className="py-3 px-4 font-medium text-cocoa">#{o._id.slice(-6).toUpperCase()}</td>
              <td className="py-3 px-4 text-cocoa/60">{formatDate(o.createdAt)}</td>
              <td className="py-3 px-4 text-cocoa/70">{o.customerInfo?.fullName}</td>
              <td className="py-3 px-4 text-cocoa">{formatCurrency(o.totalPrice)}</td>
              <td className="py-3 px-4">
                <StatusBadge status={o.status} />
              </td>
              <td className="py-3 px-4 text-right">
                <Link
                  to={adminLink ? `/admin/orders/${o._id}` : `/order-confirmation/${o._id}`}
                  className="text-champagne hover:text-soft-gold text-xs uppercase tracking-wide"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
