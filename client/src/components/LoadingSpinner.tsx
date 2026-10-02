import React from 'react';

export default function LoadingSpinner({
  label = 'Loading',
  size = 'md',
  dark = false,
}: {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
}) {
  const dims = size === 'sm' ? 'h-5 w-5' : size === 'lg' ? 'h-12 w-12' : 'h-8 w-8';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" role="status">
      <div
        className={`${dims} rounded-full border-2 border-champagne/25 border-t-champagne animate-spin`}
        style={{ borderTopColor: dark ? '#3F332A' : undefined }}
      />
      <span className={`text-xs tracking-[0.2em] uppercase ${dark ? 'text-cocoa/60' : 'text-ivory/60'}`}>{label}</span>
    </div>
  );
}
