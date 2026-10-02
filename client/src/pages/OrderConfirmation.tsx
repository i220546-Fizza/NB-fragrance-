import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderService } from '../services/orderService';
import { getApiErrorMessage } from '../services/api';
import type { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorNotice from '../components/ErrorNotice';
import OrderSummaryDetail from '../components/OrderSummaryDetail';
import { usePageMeta } from '../utils/usePageMeta';

export default function OrderConfirmation() {
  const { id = '' } = useParams();
  usePageMeta('Order Confirmed', 'Your NB Classic Scents order has been placed successfully.');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="pt-24">
        <LoadingSpinner label="Loading order" dark />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-24">
        <ErrorNotice message={error ?? 'Order not found.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh]">
      <div className="bg-offwhite py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto h-20 w-20 rounded-full border-2 border-champagne flex items-center justify-center relative"
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-champagne/20 blur-xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.4, opacity: 0.6 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D6B77C"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            >
              <motion.path d="M4 12l5 5 11-11" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="section-heading text-cocoa mt-6"
          >
            Thank You for Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-cocoa/60 mt-3"
          >
            A confirmation has been recorded. Your fragrance is being prepared for delivery.
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white border border-cocoa/10 rounded-sm p-6 sm:p-8">
          <OrderSummaryDetail order={order} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link to="/shop" className="btn-outline-dark">
            Continue Shopping
          </Link>
          <Link to="/account" className="btn-primary">
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
