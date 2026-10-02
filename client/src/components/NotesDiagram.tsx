import React from 'react';

function NoteCard({
  label,
  notes,
  radius,
  accent,
}: {
  label: string;
  notes: string[];
  radius: number;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center text-center flex-1">
      <div
        className="relative flex items-center justify-center rounded-full border mb-4"
        style={{ width: radius, height: radius, borderColor: accent }}
      >
        <div
          className="absolute inset-2 rounded-full border border-dashed opacity-40"
          style={{ borderColor: accent }}
        />
        <span className="font-display text-sm" style={{ color: accent }}>
          {label}
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[220px]">
        {notes.length === 0 && <span className="text-xs text-cocoa/40">Not specified</span>}
        {notes.map((n) => (
          <span
            key={n}
            className="text-[11px] px-2.5 py-1 rounded-full border text-cocoa/70"
            style={{ borderColor: `${accent}55` }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function NotesDiagram({
  topNotes,
  heartNotes,
  baseNotes,
}: {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 py-4">
      <NoteCard label="Top" notes={topNotes} radius={88} accent="#B89A6A" />
      <NoteCard label="Heart" notes={heartNotes} radius={104} accent="#B89A6A" />
      <NoteCard label="Base" notes={baseNotes} radius={120} accent="#3F332A" />
    </div>
  );
}
