import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { heroSlideService } from '../services/heroSlideService';

const collections = [
  { key: 'eclipse', name: 'Eclipse', bottle: '/images/hero-bottle-eclipse.svg', tag: 'Mystery & Radiance' },
  { key: 'signature', name: 'Signature', bottle: '/images/hero-bottle-signature.svg', tag: 'Timeless Identity' },
  { key: 'midnight', name: 'Midnight', bottle: '/images/hero-bottle-midnight.svg', tag: 'Unforgettable Nights' },
  { key: 'essence', name: 'Essence', bottle: '/images/hero-bottle-essence.svg', tag: 'Pure Discovery' },
];

export default function CollectionGrid() {
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    heroSlideService
      .getAll()
      .then(setOverrides)
      .catch(() => {
        /* keep the bundled defaults if this fails */
      });
  }, []);

  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="eyebrow text-champagne/90">The Collections</span>
          <h2 className="section-heading text-cocoa mt-3">Four Expressions of Presence</h2>
          <div className="gold-divider mx-auto mt-5" />
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {collections.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.08}>
              <Link
                to={`/shop?collection=${encodeURIComponent(c.name)}`}
                className="group relative flex flex-col items-center bg-white border border-cocoa/10 rounded-sm overflow-hidden aspect-[3/4] px-4 pt-8 pb-6 hover:shadow-gold-sm hover:border-champagne/40 transition-all duration-500"
              >
                <img
                  src={overrides[c.key] ?? c.bottle}
                  alt={`${c.name} collection bottle`}
                  className="relative h-3/4 w-auto object-contain transition-transform duration-700 ease-cinematic group-hover:scale-105 group-hover:-translate-y-1"
                  loading="lazy"
                />
                <div className="relative mt-auto text-center">
                  <h3 className="font-display text-lg text-cocoa">{c.name}</h3>
                  <p className="text-[11px] text-champagne/90 tracking-wide mt-1">{c.tag}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
