import React from 'react';
import Reveal from './Reveal';
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../utils/social';

const tiles = [
  { src: '/images/social-1.svg', alt: 'NB Classic Scents Eclipse bottle styled in evening light' },
  { src: '/images/social-2.svg', alt: 'NB Classic Scents Essence bottle with warm blush tones' },
  { src: '/images/social-3.svg', alt: 'NB Classic Scents Midnight bottle with indigo accents' },
  { src: '/images/social-4.svg', alt: 'NB Classic Scents Signature bottle silhouette' },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function SocialShowcase() {
  return (
    <section className="bg-midnight-navy py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-10">
          <span className="eyebrow text-champagne">{INSTAGRAM_HANDLE}</span>
          <h2 className="section-heading text-ivory mt-3">Follow the Journey</h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {tiles.map((t, i) => (
            <Reveal key={t.src} delay={i * 0.08} className="aspect-square overflow-hidden rounded-sm group">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View NB Classic Scents on Instagram, ${INSTAGRAM_HANDLE}`}
                className="block h-full w-full"
              >
                <img
                  src={t.src}
                  alt={t.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-cinematic group-hover:scale-110"
                />
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="text-center mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-champagne/40 text-champagne px-7 py-3 text-xs tracking-[0.2em] uppercase hover:bg-champagne hover:text-midnight-navy transition-colors"
          >
            <InstagramIcon className="h-4 w-4" />
            Follow Us on Instagram
          </a>
        </Reveal>
      </div>
    </section>
  );
}
