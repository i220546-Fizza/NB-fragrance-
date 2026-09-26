import React from 'react';

export default function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="mb-3 text-rose-champagne">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle cx="17" cy="17" r="15" stroke="currentColor" strokeWidth="1.4" />
          <path d="M17 10v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="17" cy="23" r="1.3" fill="currentColor" />
        </svg>
      </div>
      <p className="text-sm text-cocoa/70 max-w-sm mb-5">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline-dark">
          Try Again
        </button>
      )}
    </div>
  );
}
