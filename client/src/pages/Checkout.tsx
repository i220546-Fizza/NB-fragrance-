import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { getApiErrorMessage } from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { usePageMeta } from '../utils/usePageMeta';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const emptyForm: FormState = { fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', notes: '' };

function validate(form: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.phone.trim()) errors.phone = 'Phone number is required.';
  else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number.';
  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.postalCode.trim()) errors.postalCode = 'Postal code is required.';
  return errors;
}

export default function Checkout() {
  usePageMeta('Checkout', 'Complete your NB Classic Scents order with Cash on Delivery.');
  const { items, subtotal, deliveryCharge, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    address: user?.address?.address ?? '',
    city: user?.address?.city ?? '',
    postalCode: user?.address?.postalCode ?? '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const setField = (field: keyof FormState, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const order = await orderService.create({
        orderItems: items.map((i) => ({
          product: i.product,
          name: i.name,
          image: i.image,
          price: i.price,
          qty: i.qty,
          size: i.size,
        })),
        customerInfo: { fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() },
        shippingAddress: { address: form.address.trim(), city: form.city.trim(), postalCode: form.postalCode.trim() },
        notes: form.notes.trim() || undefined,
        paymentMethod: 'Cash on Delivery',
      });
      clearCart();
      navigate(`/order-confirmation/${order._id}`);
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, 'Unable to place your order right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="section-heading text-cocoa mb-10">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={submit} className="lg:col-span-2 space-y-6" noValidate>
            <div className="bg-white border border-cocoa/10 rounded-sm p-6">
              <h2 className="font-display text-lg text-cocoa mb-5">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-field">Full Name</label>
                  <input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} className="input-field" />
                  {errors.fullName && <p className="text-xs text-rose-champagne mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="label-field">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} className="input-field" />
                  {errors.email && <p className="text-xs text-rose-champagne mt-1">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label-field">Phone</label>
                  <input value={form.phone} onChange={(e) => setField('phone', e.target.value)} className="input-field" placeholder="+92 300 1234567" />
                  {errors.phone && <p className="text-xs text-rose-champagne mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white border border-cocoa/10 rounded-sm p-6">
              <h2 className="font-display text-lg text-cocoa mb-5">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label-field">Address</label>
                  <input value={form.address} onChange={(e) => setField('address', e.target.value)} className="input-field" />
                  {errors.address && <p className="text-xs text-rose-champagne mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-field">City</label>
                    <input value={form.city} onChange={(e) => setField('city', e.target.value)} className="input-field" />
                    {errors.city && <p className="text-xs text-rose-champagne mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="label-field">Postal Code</label>
                    <input value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value)} className="input-field" />
                    {errors.postalCode && <p className="text-xs text-rose-champagne mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <label className="label-field">Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} className="input-field resize-none" placeholder="Delivery instructions, gift notes, etc." />
                </div>
              </div>
            </div>

            <div className="bg-white border border-cocoa/10 rounded-sm p-6">
              <h2 className="font-display text-lg text-cocoa mb-4">Payment Method</h2>
              <label className="flex items-center gap-3 border border-champagne rounded-sm p-4 bg-champagne/5 cursor-pointer">
                <input type="radio" checked readOnly className="accent-champagne h-4 w-4" />
                <span className="text-sm text-cocoa">Cash on Delivery</span>
              </label>
            </div>

            {submitError && <p className="text-sm text-rose-champagne">{submitError}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="bg-white border border-cocoa/10 rounded-sm p-6 h-fit sticky top-24">
            <h2 className="font-display text-lg text-cocoa mb-5">Order Summary</h2>
            <ul className="divide-y divide-cocoa/10 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <li key={`${item.product}-${item.size}`} className="flex gap-3 py-3">
                  <img src={item.image || '/images/product-placeholder.svg'} alt={item.name} className="h-14 w-12 object-cover rounded-sm bg-warm-cream" />
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
            <div className="space-y-2 text-sm border-t border-cocoa/10 pt-4">
              <div className="flex justify-between text-cocoa/70">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-cocoa/70">
                <span>Delivery Charges</span>
                <span>{formatCurrency(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between font-medium text-cocoa text-base pt-2 border-t border-cocoa/10">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
