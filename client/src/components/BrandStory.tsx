import React from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function BrandStory() {
  return (
    <section className="relative bg-offwhite overflow-hidden border-t border-cocoa/5">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <img
            src="/images/brand-story.svg"
            alt="Abstract illustration representing the NB Classic Scents brand story, gold rings and warm light"
            className="w-full rounded-sm"
            loading="lazy"
          />
        </Reveal>
        <Reveal delay={0.15}>
          <span className="eyebrow text-champagne">Our Story</span>
          <h2 className="font-display text-3xl md:text-4xl text-cocoa mt-4 leading-tight">
            Born from a devotion to <span className="font-script italic text-champagne">craft</span>.
          </h2>
          <p className="text-cocoa/65 mt-6 leading-relaxed max-w-lg">
            NB Classic Scents began with a simple belief: that a fragrance should be worn like a
            signature — unmistakably yours. Every formula is composed in small batches, balancing
            rare top notes with grounded, lasting bases so the story unfolds differently on every
            skin it touches.
          </p>
          <p className="text-cocoa/65 mt-4 leading-relaxed max-w-lg">
            From the first sketch of a bottle to the final drop of oud, we obsess over details most
            never notice — so you always do.
          </p>
          <Link to="/about" className="btn-outline-dark mt-8 inline-flex">
            Discover Our Story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
