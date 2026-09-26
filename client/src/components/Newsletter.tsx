import React, { useState } from 'react';
import { useToast } from './ToastHost';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Welcome to the house of NB. Check your inbox soon.');
    setEmail('');
  };

  return (
    <section className="bg-deep-navy py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <span className="eyebrow text-champagne">Stay In Scent</span>
        <h2 className="font-display text-2xl md:text-3xl text-ivory mt-3">
          Be first to discover new collections and private previews.
        </h2>
        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full sm:w-80 bg-transparent border border-champagne/30 rounded-sm px-4 py-3 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-champagne"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
