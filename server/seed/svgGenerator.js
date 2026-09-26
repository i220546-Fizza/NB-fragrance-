// Programmatic SVG perfume-bottle illustration generator.
// Produces a cohesive luxury look across a varied catalog by parameterizing
// bottle silhouette + liquid/accent colors, rather than hand-drawing files.

const SILHOUETTES = {
  'tall-rectangular': {
    body: 'M156,195 L244,195 Q260,195 260,211 L260,444 Q260,460 244,460 L156,460 Q140,460 140,444 L140,211 Q140,195 156,195 Z',
    neck: { x: 180, y: 150, width: 40, height: 45 },
    cap: { type: 'rect', x: 163, y: 95, width: 74, height: 55, rx: 12 },
  },
  'rounded-flacon': {
    body: 'M155,195 Q125,195 125,240 L125,415 Q125,460 175,460 L225,460 Q275,460 275,415 L275,240 Q275,195 245,195 Z',
    neck: { x: 182, y: 150, width: 36, height: 45 },
    cap: { type: 'dome', x: 165, y: 150, rx: 35, ry: 60, topY: 90 },
  },
  faceted: {
    body: 'M165,195 L235,195 L260,220 L260,435 L235,460 L165,460 L140,435 L140,220 Z',
    neck: { x: 180, y: 150, width: 40, height: 45 },
    cap: { type: 'hex', points: '170,150 230,150 245,120 215,95 185,95 155,120' },
  },
  tapered: {
    body: 'M180,195 L220,195 L255,455 Q257,460 250,460 L150,460 Q143,460 145,455 Z',
    neck: { x: 185, y: 150, width: 30, height: 45 },
    cap: { type: 'rect', x: 170, y: 78, width: 60, height: 72, rx: 8 },
  },
};

function buildBottleSVG({
  silhouette = 'tall-rectangular',
  liquidColor,
  liquidColor2,
  accentColor,
  accentColor2,
  labelText = 'NB',
  subLabel = 'PARFUM',
  fillTopY = 270,
  highlightShift = 0,
  uid = 'a',
}) {
  const shape = SILHOUETTES[silhouette] || SILHOUETTES['tall-rectangular'];

  let capMarkup = '';
  if (shape.cap.type === 'rect') {
    const { x, y, width, height, rx } = shape.cap;
    capMarkup = `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="url(#cap-${uid})" stroke="#2a1f14" stroke-width="1" stroke-opacity="0.25"/>`;
  } else if (shape.cap.type === 'dome') {
    const { x, rx, ry, topY } = shape.cap;
    capMarkup = `<path d="M${x},150 A${rx},${ry} 0 0 1 ${x + rx * 2},150 Z" fill="url(#cap-${uid})" stroke="#2a1f14" stroke-width="1" stroke-opacity="0.25" transform="translate(0,${topY - 90})"/>`;
  } else if (shape.cap.type === 'hex') {
    capMarkup = `<polygon points="${shape.cap.points}" fill="url(#cap-${uid})" stroke="#2a1f14" stroke-width="1" stroke-opacity="0.25"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
  <defs>
    <radialGradient id="glow-${uid}" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="liquid-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${liquidColor}"/>
      <stop offset="100%" stop-color="${liquidColor2}"/>
    </linearGradient>
    <linearGradient id="cap-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${accentColor2}"/>
    </linearGradient>
    <linearGradient id="glass-${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8F4EC" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#F8F4EC" stop-opacity="0.06"/>
    </linearGradient>
    <clipPath id="clip-${uid}">
      <path d="${shape.body}"/>
    </clipPath>
  </defs>

  <ellipse cx="200" cy="475" rx="120" ry="18" fill="#07111F" opacity="0.35"/>
  <ellipse cx="200" cy="300" rx="180" ry="220" fill="url(#glow-${uid})"/>

  <rect x="${shape.neck.x}" y="${shape.neck.y}" width="${shape.neck.width}" height="${shape.neck.height}" fill="#0D1B2E" opacity="0.85"/>
  ${capMarkup}

  <path d="${shape.body}" fill="#0D1B2E" fill-opacity="0.18" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.55"/>

  <g clip-path="url(#clip-${uid})">
    <rect x="120" y="${fillTopY}" width="180" height="${470 - fillTopY}" fill="url(#liquid-${uid})"/>
    <rect x="120" y="195" width="180" height="290" fill="url(#glass-${uid})"/>
    <rect x="${150 + highlightShift}" y="210" width="14" height="230" fill="#FFFFFF" opacity="0.20"/>
    <rect x="${168 + highlightShift}" y="210" width="5" height="230" fill="#FFFFFF" opacity="0.12"/>
  </g>

  <rect x="163" y="325" width="74" height="46" rx="4" fill="#F8F4EC" fill-opacity="0.88" stroke="${accentColor}" stroke-width="1"/>
  <text x="200" y="349" font-family="Georgia, 'Times New Roman', serif" font-size="15" letter-spacing="2" text-anchor="middle" fill="${accentColor2}">${labelText}</text>
  <text x="200" y="362" font-family="Georgia, 'Times New Roman', serif" font-size="7" letter-spacing="1.5" text-anchor="middle" fill="${accentColor2}" opacity="0.85">${subLabel}</text>
</svg>`;

  return svg;
}

module.exports = { buildBottleSVG, SILHOUETTES };
