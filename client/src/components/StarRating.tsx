import React from 'react';

export default function StarRating({
  rating,
  size = 14,
  interactive = false,
  onChange,
}: {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-0.5" role={interactive ? 'radiogroup' : undefined} aria-label={`Rating ${rating} of 5`}>
      {stars.map((s) => {
        const filled = s <= Math.round(rating);
        return (
          <button
            type="button"
            key={s}
            disabled={!interactive}
            onClick={() => onChange?.(s)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            aria-label={`${s} star${s > 1 ? 's' : ''}`}
          >
            <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#B89A6A' : 'none'} stroke="#B89A6A" strokeWidth="1.2">
              <path d="M12 2.5l2.9 6.24 6.6.82-4.9 4.62 1.28 6.7L12 17.9l-5.88 3.98 1.28-6.7-4.9-4.62 6.6-.82L12 2.5z" strokeLinejoin="round" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
