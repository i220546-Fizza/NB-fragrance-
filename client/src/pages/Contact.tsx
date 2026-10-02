import React, { useState } from 'react';
import { useToast } from '../components/ToastHost';
import { usePageMeta } from '../utils/usePageMeta';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../utils/social';

export default function Contact() {
  usePageMeta('Contact Us', 'Get in touch with the NB Classic Scents team.');
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.message.trim()) errs.message = 'Please enter a message.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSent(true);
    showToast('Your message has been sent. We will be in touch soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh] bg-offwhite">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="eyebrow text-champagne/90">Get In Touch</span>
          <h1 className="section-heading text-cocoa mt-3">Contact Us</h1>
          <p className="text-cocoa/60 mt-3 max-w-md mx-auto">
            Questions about an order, a fragrance, or a partnership? We&rsquo;d love to hear from you.
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-cocoa/10 rounded-sm p-7 space-y-4">
          <div>
            <label className="label-field">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            {errors.name && <p className="text-xs text-rose-champagne mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="label-field">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
            {errors.email && <p className="text-xs text-rose-champagne mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="label-field">Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="input-field resize-none" />
            {errors.message && <p className="text-xs text-rose-champagne mt-1">{errors.message}</p>}
          </div>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Send Message
          </button>
          {sent && <p className="text-sm text-cocoa/60">Thank you — we typically respond within one business day.</p>}
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 text-center">
          <div>
            <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Email</p>
            <p className="text-sm text-cocoa">hello@nbclassicscents.com</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Phone</p>
            <p className="text-sm text-cocoa">+92 300 0000000</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-1">Studio</p>
            <p className="text-sm text-cocoa">Lahore, Pakistan</p>
          </div>
        </div>

        <div className="text-center mt-12 pt-10 border-t border-cocoa/10">
          <p className="text-xs uppercase tracking-wide text-cocoa/50 mb-2">Follow NB Classic Scents</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cocoa hover:text-champagne transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram: {INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
    </div>
  );
}
