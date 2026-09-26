import React from 'react';
import Reveal from './Reveal';

const tiles = [
  { src: '/images/social-1.svg', alt: 'NB Classic Scents Eclipse bottle styled in evening light' },
  { src: '/images/social-2.svg', alt: 'NB Classic Scents Essence bottle with warm blush tones' },
  { src: '/images/social-3.svg', alt: 'NB Classic Scents Midnight bottle with indigo accents' },
  { src: '/images/social-4.svg', alt: 'NB Classic Scents Signature bottle silhouette' },
];

export default function SocialShowcase() {
  return (
    <section className="bg-midnight-navy py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-10">
          <span className="eyebrow text-champagne">@NBClassicScents</span>
          <h2 className="section-heading text-ivory mt-3">Follow the Journey</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {tiles.map((t, i) => (
            <Reveal key={t.src} delay={i * 0.08} className="aspect-square overflow-hidden rounded-sm group">
              <img
                src={t.src}
                alt={t.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
