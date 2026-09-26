import React from 'react';
import Reveal from './Reveal';

const points = [
  {
    title: 'Rare Ingredients',
    desc: 'Sourced oud, sandalwood, and florals selected for depth and longevity.',
    icon: (
      <path d="M12 3l2.6 6.2L21 12l-6.4 2.8L12 21l-2.6-6.2L3 12l6.4-2.8L12 3z" />
    ),
  },
  {
    title: 'Small-Batch Crafted',
    desc: 'Each bottle is composed in limited runs to preserve its character.',
    icon: <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" />,
  },
  {
    title: 'Lasting Sillage',
    desc: 'Formulated for a signature trail that lingers through the day.',
    icon: <path d="M4 12c2-4 5-6 8-6s6 2 8 6c-2 4-5 6-8 6s-6-2-8-6z" />,
  },
  {
    title: 'Considered Design',
    desc: 'Vessels shaped as objects worth keeping, long after empty.',
    icon: <path d="M9 3h6l1 4h-8l1-4zM8 7h8l2 14H6L8 7z" />,
  },
];

export default function WhyNBSection() {
  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-14">
          <span className="eyebrow text-champagne/90">The NB Difference</span>
          <h2 className="section-heading text-cocoa mt-3">Why NB Classic Scents</h2>
          <div className="gold-divider mx-auto mt-5" />
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border border-champagne/40 flex items-center justify-center mb-5 text-champagne">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
                  {p.icon}
                </svg>
              </div>
              <h3 className="font-display text-lg text-cocoa mb-2">{p.title}</h3>
              <p className="text-sm text-cocoa/60 max-w-xs leading-relaxed">{p.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
