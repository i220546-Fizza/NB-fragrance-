import React from 'react';

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-cocoa/20 rounded-sm">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="w-9 h-10 flex items-center justify-center text-cocoa/70 hover:text-cocoa disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        &minus;
      </button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="w-9 h-10 flex items-center justify-center text-cocoa/70 hover:text-cocoa disabled:opacity-30"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
