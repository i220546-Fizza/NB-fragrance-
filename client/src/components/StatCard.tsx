import React from 'react';

export default function StatCard({
  label,
  value,
  accent = false,
  icon,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`rounded-sm border p-5 flex items-center gap-4 ${accent ? 'bg-midnight-navy border-champagne/30' : 'bg-white border-cocoa/10'}`}>
      {icon && (
        <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${accent ? 'bg-champagne/15 text-champagne' : 'bg-warm-cream text-cocoa/70'}`}>
          {icon}
        </div>
      )}
      <div>
        <p className={`text-xs tracking-wide uppercase ${accent ? 'text-ivory/50' : 'text-cocoa/50'}`}>{label}</p>
        <p className={`font-display text-2xl mt-0.5 ${accent ? 'text-ivory' : 'text-cocoa'}`}>{value}</p>
      </div>
    </div>
  );
}
