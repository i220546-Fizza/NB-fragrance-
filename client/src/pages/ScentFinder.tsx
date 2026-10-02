import React, { useState } from 'react';
import { productService } from '../services/productService';
import { getApiErrorMessage } from '../services/api';
import type { FragranceFamily, Product } from '../types';
import ScentFamilyPicker from '../components/ScentFamilyPicker';
import ProductGrid from '../components/ProductGrid';
import Reveal from '../components/Reveal';
import { usePageMeta } from '../utils/usePageMeta';

type Step = 'intro' | 'quiz' | 'results';

export default function ScentFinder() {
  usePageMeta('Scent Finder', 'Answer a few questions to discover the NB Classic Scents fragrances matched to your taste.');
  const [step, setStep] = useState<Step>('intro');
  const [selected, setSelected] = useState<FragranceFamily[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFamily = (f: FragranceFamily) => {
    setSelected((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  };

  const findMatches = () => {
    setLoading(true);
    setError(null);
    setStep('results');
    productService
      .discovery(selected)
      .then(setResults)
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to find matches right now.')))
      .finally(() => setLoading(false));
  };

  return (
    <div className="pt-16 md:pt-20 min-h-[80vh]">
      <div className="bg-offwhite py-12 md:py-16 border-b border-cocoa/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="eyebrow text-champagne">Scent Finder</span>
          <h1 className="section-heading text-cocoa mt-3">Discover Your Signature</h1>
          <p className="text-cocoa/60 mt-4 max-w-lg mx-auto">
            A few thoughtful questions stand between you and your next favorite fragrance.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {step === 'intro' && (
          <Reveal className="text-center flex flex-col items-center">
            <h2 className="font-display text-2xl text-cocoa mb-4">Ready to find your scent?</h2>
            <p className="text-cocoa/60 max-w-md mb-8">
              Select the fragrance families that speak to you. We'll match you with fragrances
              from across our collections.
            </p>
            <button onClick={() => setStep('quiz')} className="btn-primary">
              Begin
            </button>
          </Reveal>
        )}

        {step === 'quiz' && (
          <Reveal>
            <h2 className="font-display text-2xl text-cocoa mb-2 text-center">Which scent families call to you?</h2>
            <p className="text-cocoa/50 text-center mb-8 text-sm">Select as many as you like.</p>
            <ScentFamilyPicker selected={selected} onToggle={toggleFamily} />
            <div className="flex justify-center mt-10">
              <button onClick={findMatches} disabled={selected.length === 0} className="btn-primary disabled:opacity-40">
                Reveal My Matches ({selected.length})
              </button>
            </div>
          </Reveal>
        )}

        {step === 'results' && (
          <Reveal>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
              <h2 className="font-display text-2xl text-cocoa">Your Matches</h2>
              <button
                onClick={() => {
                  setStep('quiz');
                }}
                className="text-xs uppercase tracking-wide text-champagne hover:text-soft-gold"
              >
                Refine Selection
              </button>
            </div>
            <ProductGrid
              products={results}
              loading={loading}
              error={error}
              onRetry={findMatches}
              emptyTitle="No matches found"
              emptyMessage="Try selecting a different combination of fragrance families."
            />
          </Reveal>
        )}
      </div>
    </div>
  );
}
