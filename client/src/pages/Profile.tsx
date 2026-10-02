import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { getApiErrorMessage } from '../services/api';
import type { Order } from '../types';
import { usePageMeta } from '../utils/usePageMeta';
import { useToast } from '../components/ToastHost';
import OrderTable from '../components/OrderTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorNotice from '../components/ErrorNotice';

type Tab = 'profile' | 'orders';

export default function Profile() {
  usePageMeta('My Account', 'Manage your NB Classic Scents profile and view your order history.');
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('profile');

  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: user?.address?.address ?? '',
    city: user?.address?.city ?? '',
    postalCode: user?.address?.postalCode ?? '',
    password: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const loadOrders = () => {
    setOrdersLoading(true);
    setOrdersError(null);
    orderService
      .myOrders()
      .then(setOrders)
      .catch((err) => setOrdersError(getApiErrorMessage(err, 'Unable to load your orders.')))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        phone: form.phone,
        address: { address: form.address, city: form.city, postalCode: form.postalCode },
      };
      if (form.password) payload.password = form.password;
      const updated = await userService.updateProfile(payload);
      setUser(updated);
      setForm((f) => ({ ...f, password: '' }));
      showToast('Profile updated successfully.');
    } catch (err) {
      setProfileError(getApiErrorMessage(err, 'Unable to update your profile.'));
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] bg-offwhite">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="section-heading text-cocoa mb-8">My Account</h1>

        <div className="flex gap-6 border-b border-cocoa/15 mb-8">
          {(['profile', 'orders'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm uppercase tracking-wide transition-colors border-b-2 ${
                tab === t ? 'text-cocoa border-champagne' : 'text-cocoa/40 border-transparent hover:text-cocoa/70'
              }`}
            >
              {t === 'profile' ? 'Profile' : 'Order History'}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <form onSubmit={submitProfile} className="bg-white border border-cocoa/10 rounded-sm p-6 sm:p-8 max-w-xl space-y-4">
            <div>
              <label className="label-field">Full Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input value={user?.email ?? ''} disabled className="input-field opacity-60" />
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="label-field">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="label-field">Postal Code</label>
                <input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="label-field">New Password (optional)</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" placeholder="Leave blank to keep current password" />
            </div>
            {profileError && <p className="text-sm text-rose-champagne">{profileError}</p>}
            <button type="submit" disabled={savingProfile} className="btn-primary">
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}

        {tab === 'orders' && (
          <div className="bg-white border border-cocoa/10 rounded-sm p-6 sm:p-8">
            {ordersLoading ? (
              <LoadingSpinner label="Loading orders" dark />
            ) : ordersError ? (
              <ErrorNotice message={ordersError} onRetry={loadOrders} />
            ) : orders.length === 0 ? (
              <EmptyState title="No orders yet" message="Your placed orders will appear here." actionLabel="Start Shopping" actionTo="/shop" />
            ) : (
              <OrderTable orders={orders} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
