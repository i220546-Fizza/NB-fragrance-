import React from 'react';
import type { FragranceFamily } from '../types';

export const FRAGRANCE_FAMILIES: FragranceFamily[] = [
  'Fresh',
  'Floral',
  'Woody',
  'Oud',
  'Musky',
  'Sweet',
  'Citrus',
  'Oriental',
];

const descriptions: Record<FragranceFamily, string> = {
  Fresh: 'Crisp, clean, invigorating',
  Floral: 'Soft petals, romantic',
  Woody: 'Warm, grounded, timeless',
  Oud: 'Rich, resinous, opulent',
  Musky: 'Skin-like, sensual depth',
  Sweet: 'Gourmand, comforting',
  Citrus: 'Bright, zesty, energetic',
  Oriental: 'Spiced, exotic, bold',
};

export default function ScentFamilyPicker({
  selected,
  onToggle,
}: {
  selected: FragranceFamily[];
  onToggle: (family: FragranceFamily) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
      {FRAGRANCE_FAMILIES.map((family) => {
        const active = selected.includes(family);
        return (
          <button
            key={family}
            type="button"
            onClick={() => onToggle(family)}
            aria-pressed={active}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-sm border px-4 py-6 min-h-[104px] transition-all duration-400 ease-cinematic ${
              active
                ? 'bg-midnight-navy border-champagne text-ivory shadow-gold-sm'
                : 'bg-white border-cocoa/15 text-cocoa hover:border-champagne/50'
            }`}
          >
            <span className="font-display text-lg">{family}</span>
            <span className={`text-[11px] ${active ? 'text-champagne/80' : 'text-cocoa/50'}`}>{descriptions[family]}</span>
          </button>
        );
      })}
    </div>
  );
}
