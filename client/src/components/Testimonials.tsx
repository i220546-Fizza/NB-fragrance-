import React from 'react';
import Reveal from './Reveal';
import StarRating from './StarRating';

const testimonials = [
  {
    name: 'Ayesha K.',
    quote: 'The Midnight bottle lasted the entire evening and I received compliments all night. Worth every rupee.',
  },
  {
    name: 'Hamza R.',
    quote: 'Signature is now my everyday scent — elegant without being overpowering. The packaging alone feels premium.',
  },
  {
    name: 'Zara M.',
    quote: 'Eclipse is unlike anything else on the market here. Deep, warm, and it truly lingers on fabric.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-offwhite py-16 md:py-24 border-t border-cocoa/5">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-12">
          <span className="eyebrow text-champagne/90">Voices of NB</span>
          <h2 className="section-heading text-cocoa mt-3">What Our Clients Say</h2>
          <div className="gold-divider mx-auto mt-5" />
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="bg-white p-7 rounded-sm border border-cocoa/10">
              <StarRating rating={5} size={13} />
              <p className="text-sm text-cocoa/70 leading-relaxed mt-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs tracking-wide uppercase text-cocoa/50 mt-5">{t.name}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
