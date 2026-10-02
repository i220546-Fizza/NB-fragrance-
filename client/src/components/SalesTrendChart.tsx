import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';

interface Point {
  date: string;
  total: number;
}

const LINE_COLOR = '#B89A6A'; // champagne-family hue, darkened for AA contrast on white
const AREA_TOP = 'rgba(184,154,106,0.28)';
const AREA_BOTTOM = 'rgba(184,154,106,0)';

export default function SalesTrendChart({ data }: { data: Point[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const width = 640;
  const height = 220;
  const padding = { top: 16, right: 16, bottom: 28, left: 8 };

  const { points, maxVal } = useMemo(() => {
    if (data.length === 0) return { points: [] as { x: number; y: number; d: Point }[], maxVal: 0 };
    const max = Math.max(...data.map((d) => d.total), 1);
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const step = data.length > 1 ? innerW / (data.length - 1) : 0;
    const pts = data.map((d, i) => ({
      x: padding.left + i * step,
      y: padding.top + innerH - (d.total / max) * innerH,
      d,
    }));
    return { points: pts, maxVal: max };
  }, [data]);

  if (data.length === 0) {
    return <p className="text-sm text-cocoa/50 py-10 text-center">No sales data available yet.</p>;
  }

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs tracking-[0.15em] uppercase text-cocoa/50">Sales Trend</h4>
        <button onClick={() => setShowTable((s) => !s)} className="text-[11px] text-champagne hover:text-soft-gold uppercase tracking-wide">
          {showTable ? 'View Chart' : 'View Table'}
        </button>
      </div>

      {showTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-cocoa/50 text-xs uppercase tracking-wide">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2">Sales</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.date} className="border-t border-cocoa/10">
                  <td className="py-2 pr-4 text-cocoa/70">{d.date}</td>
                  <td className="py-2 text-cocoa font-medium">{formatCurrency(d.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56" preserveAspectRatio="none" role="img" aria-label="Sales trend over time">
            <defs>
              <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AREA_TOP} />
                <stop offset="100%" stopColor={AREA_BOTTOM} />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={padding.left}
                x2={width - padding.right}
                y1={padding.top + (height - padding.top - padding.bottom) * f}
                y2={padding.top + (height - padding.top - padding.bottom) * f}
                stroke="#3F332A"
                strokeOpacity="0.06"
              />
            ))}
            <path d={areaPath} fill="url(#salesArea)" />
            <path d={linePath} fill="none" stroke={LINE_COLOR} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {points.map((p, i) => (
              <g key={p.d.date}>
                <rect
                  x={p.x - (width / points.length) / 2}
                  y={0}
                  width={width / points.length}
                  height={height}
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoverIdx === i ? 5 : 3}
                  fill="#fff"
                  stroke={LINE_COLOR}
                  strokeWidth="2"
                  className="transition-all"
                />
              </g>
            ))}
          </svg>
          {hoverIdx !== null && points[hoverIdx] && (
            <div
              className="absolute bg-midnight-navy text-ivory text-xs rounded-sm px-3 py-2 pointer-events-none shadow-lg"
              style={{
                left: `${(points[hoverIdx].x / width) * 100}%`,
                top: `${(points[hoverIdx].y / height) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}
            >
              <div className="text-champagne/80">{points[hoverIdx].d.date}</div>
              <div className="font-medium">{formatCurrency(points[hoverIdx].d.total)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
