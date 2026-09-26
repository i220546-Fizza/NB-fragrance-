import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
  icon,
}: {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="mb-4 text-champagne">
        {icon ?? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
            <path d="M13 24c2-4 5-6 7-6s5 2 7 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="15.5" cy="16.5" r="1.4" fill="currentColor" />
            <circle cx="24.5" cy="16.5" r="1.4" fill="currentColor" />
          </svg>
        )}
      </div>
      <h3 className="font-display text-xl text-cocoa mb-2">{title}</h3>
      {message && <p className="text-sm text-cocoa/60 max-w-sm mb-6">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-outline-dark">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
