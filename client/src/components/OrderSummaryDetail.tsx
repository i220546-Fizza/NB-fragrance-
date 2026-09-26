import React from 'react';
import type { Order } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, estimatedDeliveryRange } from '../utils/formatDate';
import { StatusBadge } from './OrderTable';

export default function OrderSummaryDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50">Order Number</p>
          <p className="font-display text-xl text-cocoa">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Placed On</p>
          <p className="text-cocoa">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Estimated Delivery</p>
          <p className="text-cocoa">{estimatedDeliveryRange(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Payment</p>
          <p className="text-cocoa">{order.paymentMethod}</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-3">Items</p>
        <ul className="divide-y divide-cocoa/10 border-t border-b border-cocoa/10">
          {order.orderItems.map((item, i) => (
            <li key={i} className="flex gap-4 py-4">
              <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} className="h-16 w-14 object-cover rounded-sm bg-warm-cream" />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className="text-sm text-cocoa">{item.name}</p>
                  <p className="text-xs text-cocoa/50">Qty {item.qty} &middot; {item.size}</p>
                </div>
                <span className="text-sm text-cocoa">{formatCurrency(item.price * item.qty)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-2">Customer</p>
          <p className="text-sm text-cocoa">{order.customerInfo?.fullName}</p>
          <p className="text-sm text-cocoa/60">{order.customerInfo?.email}</p>
          <p className="text-sm text-cocoa/60">{order.customerInfo?.phone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-2">Shipping Address</p>
          <p className="text-sm text-cocoa">{order.shippingAddress?.address}</p>
          <p className="text-sm text-cocoa/60">
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </p>
        </div>
      </div>

      {order.notes && (
        <div>
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Notes</p>
          <p className="text-sm text-cocoa/70">{order.notes}</p>
        </div>
      )}

      <div className="border-t border-cocoa/10 pt-5 space-y-2 text-sm max-w-xs ml-auto">
        <div className="flex justify-between text-cocoa/70">
          <span>Subtotal</span>
          <span>{formatCurrency(order.itemsPrice)}</span>
        </div>
        <div className="flex justify-between text-cocoa/70">
          <span>Delivery Charge</span>
          <span>{formatCurrency(order.deliveryCharge)}</span>
        </div>
        <div className="flex justify-between font-medium text-cocoa text-base pt-2 border-t border-cocoa/10">
          <span>Total</span>
          <span>{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}
