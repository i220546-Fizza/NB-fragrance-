import React from 'react';
import type { FragranceFamily, Gender } from '../types';
import { FRAGRANCE_FAMILIES } from './ScentFamilyPicker';

export interface ShopFilters {
  gender: Gender[];
  fragranceFamily: FragranceFamily[];
  minPrice: string;
  maxPrice: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
}

export const emptyFilters: ShopFilters = {
  gender: [],
  fragranceFamily: [],
  minPrice: '',
  maxPrice: '',
  featured: false,
  bestseller: false,
  newArrival: false,
};

const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-5 border-b border-cocoa/10">
      <h4 className="text-xs tracking-[0.18em] uppercase text-cocoa/60 mb-3">{title}</h4>
      {children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onChange,
  onClear,
}: {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
  onClear: () => void;
}) {
  const toggleGender = (g: Gender) => {
    const next = filters.gender.includes(g) ? filters.gender.filter((x) => x !== g) : [...filters.gender, g];
    onChange({ ...filters, gender: next });
  };
  const toggleFamily = (f: FragranceFamily) => {
    const next = filters.fragranceFamily.includes(f)
      ? filters.fragranceFamily.filter((x) => x !== f)
      : [...filters.fragranceFamily, f];
    onChange({ ...filters, fragranceFamily: next });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-lg text-cocoa">Filters</h3>
        <button onClick={onClear} className="text-[11px] uppercase tracking-wide text-champagne hover:text-soft-gold">
          Clear All
        </button>
      </div>

      <Section title="Gender">
        <div className="flex flex-col gap-2.5">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2.5 text-sm text-cocoa/80 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.gender.includes(g)}
                onChange={() => toggleGender(g)}
                className="accent-champagne h-4 w-4"
              />
              {g}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Fragrance Family">
        <div className="flex flex-wrap gap-2">
          {FRAGRANCE_FAMILIES.map((f) => {
            const active = filters.fragranceFamily.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => toggleFamily(f)}
                aria-pressed={active}
                className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${
                  active ? 'bg-midnight-navy text-champagne border-midnight-navy' : 'border-cocoa/20 text-cocoa/70 hover:border-champagne'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Price Range (Rs.)">
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="input-field !py-2 text-xs"
          />
          <span className="text-cocoa/40">-</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="input-field !py-2 text-xs"
          />
        </div>
      </Section>

      <Section title="Highlights">
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-sm text-cocoa/80 cursor-pointer">
            <input type="checkbox" checked={filters.featured} onChange={(e) => onChange({ ...filters, featured: e.target.checked })} className="accent-champagne h-4 w-4" />
            Featured
          </label>
          <label className="flex items-center gap-2.5 text-sm text-cocoa/80 cursor-pointer">
            <input type="checkbox" checked={filters.bestseller} onChange={(e) => onChange({ ...filters, bestseller: e.target.checked })} className="accent-champagne h-4 w-4" />
            Bestseller
          </label>
          <label className="flex items-center gap-2.5 text-sm text-cocoa/80 cursor-pointer">
            <input type="checkbox" checked={filters.newArrival} onChange={(e) => onChange({ ...filters, newArrival: e.target.checked })} className="accent-champagne h-4 w-4" />
            New Arrivals
          </label>
        </div>
      </Section>
    </div>
  );
}
