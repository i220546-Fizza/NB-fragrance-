import React from 'react';
import { motion } from 'framer-motion';
import type { SizeOption } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { prettySize } from '../utils/sizes';

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
  compact = false,
  layoutId = 'size-selected-bg',
}: {
  sizes: SizeOption[];
  selected: string | null;
  onSelect: (size: string) => void;
  compact?: boolean;
  layoutId?: string;
}) {
  return (
    <div
      className={`grid gap-2.5 ${compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-5'}`}
      role="group"
      aria-label="Select bottle size"
    >
      {sizes.map((opt) => {
        const isSelected = opt.size === selected;
        return (
          <button
            key={opt.size}
            type="button"
            onClick={() => onSelect(opt.size)}
            aria-pressed={isSelected}
            className={`relative overflow-hidden rounded-sm border text-center transition-colors duration-300 ${
              compact ? 'px-2 py-2' : 'px-3 py-3'
            } ${
              isSelected
                ? 'border-champagne text-cocoa'
                : 'border-cocoa/15 bg-white text-cocoa/70 hover:border-champagne/50 hover:bg-champagne/5'
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 bg-champagne/10"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className={`relative block font-medium tracking-wide ${compact ? 'text-[11px]' : 'text-xs'}`}>
              {prettySize(opt.size)}
            </span>
            <span
              className={`relative block mt-0.5 ${compact ? 'text-[10px]' : 'text-[11px]'} ${
                isSelected ? 'text-champagne' : 'text-cocoa/45'
              }`}
            >
              {formatCurrency(opt.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
