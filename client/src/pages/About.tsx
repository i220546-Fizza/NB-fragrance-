import React from 'react';
import Reveal from '../components/Reveal';
import WhyNBSection from '../components/WhyNBSection';
import { usePageMeta } from '../utils/usePageMeta';

export default function About() {
  usePageMeta('About Us', 'The story behind NB Classic Scents — small-batch fragrances crafted to define presence.');
  return (
    <div className="pt-16 md:pt-20">
      <section className="relative bg-midnight-navy overflow-hidden">
        <img
          src="/images/about-campaign.svg"
          alt="Abstract campaign artwork featuring an NB Classic Scents bottle silhouette on deep navy"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="relative max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <span className="eyebrow text-champagne">Our Story</span>
          <h1 className="font-display text-4xl md:text-5xl text-ivory mt-4">
            Crafted for those who leave a <span className="font-script italic text-champagne">lasting impression</span>.
          </h1>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-6 text-cocoa/75 leading-relaxed">
          <Reveal>
            <p>
              NB Classic Scents was founded on a simple conviction: fragrance is identity, not
              decoration. We compose every bottle in small batches, pairing rare raw materials
              with disciplined restraint — nothing added that doesn&rsquo;t serve the story of the
              scent.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Our four collections — Eclipse, Signature, Midnight, and Essence — each explore a
              different emotional register, from mysterious and radiant to warm and unforgettable.
              What unites them is a commitment to longevity, sillage, and craftsmanship that holds
              up to scrutiny.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              Today, NB Classic Scents is worn by people who understand that a signature scent is
              never loud — it is simply unmistakable.
            </p>
          </Reveal>
        </div>
      </section>

      <WhyNBSection />
    </div>
  );
}
