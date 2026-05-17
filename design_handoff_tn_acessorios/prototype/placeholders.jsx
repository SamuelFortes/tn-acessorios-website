// Elegant SVG placeholders for products.
// Each placeholder is keyed by id (see data.jsx). They take a "tone" prop
// that picks a soft warm background; foreground shapes are subtle line-art.

function Placeholder({ kind, label, full = false, style = {} }) {
  const map = {
    'earrings-pearl': EarringsPearl,
    'earrings-hoop': EarringsHoop,
    'earrings-heart': EarringsHeart,
    'necklace-heart': NecklaceHeart,
    'ring-solitaire': RingSolitaire,
    'bracelet-chain': BraceletChain,
    'perfume-red': (p) => <PerfumeBottle {...p} accent="#7E2A2A" cap="#3A1010" label="EGEO CHOC" />,
    'perfume-white': (p) => <PerfumeBottle {...p} accent="#E8DCC8" cap="#B8915A" label="LILY" />,
    'perfume-amber': (p) => <PerfumeBottle {...p} accent="#8B5A2B" cap="#3F2613" label="COFFEE" />,
    'perfume-rose': (p) => <PerfumeBottle {...p} accent="#D88FA0" cap="#7A4A55" label="FLORATTA" />,
    'bag-red': (p) => <Handbag {...p} body="#9A2A30" handle="#3A1018" buckle="#D4A574" />,
    'bag-tan': (p) => <Handbag {...p} body="#C49870" handle="#5C3D26" buckle="#E2C28C" />,
    'bag-clutch': (p) => <Clutch {...p} />,
    'kit-mae': (p) => <GiftBox {...p} ribbon="#D88FA0" body="#FBF6EC" />,
    'kit-aniver': (p) => <GiftBox {...p} ribbon="#C9876F" body="#F4E9DA" />,
    'kit-especial': (p) => <GiftBox {...p} ribbon="#6B1E2C" body="#E8DCC8" tall />,
  };
  const Comp = map[kind] || Generic;
  return (
    <div className="placeholder" style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, var(--ph-bg-1, #EEE2D0), var(--ph-bg-2, #E2D2B9))',
      overflow: 'hidden',
      ...style,
    }}>
      <Comp full={full} />
      {label && (
        <div style={{
          position: 'absolute', left: 14, bottom: 12,
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(34,21,18,.5)', fontWeight: 500,
        }}>{label}</div>
      )}
    </div>
  );
}

// ── Earrings ─────────────────────────────────────────────────────────────

function EarringsPearl() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F0DDD0', '#E2C5B0']} />
      <g transform="translate(60 70)">
        <PearlCluster />
      </g>
      <g transform="translate(140 110)">
        <PearlCluster />
      </g>
    </svg>
  );
}
function PearlCluster() {
  // 7 pearls arranged in a flower
  const pearls = [
    [0, 0], [14, 0], [-14, 0], [7, -12], [-7, -12], [7, 12], [-7, 12],
  ];
  return (
    <g>
      {pearls.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7"
          fill="#FBF6EC" stroke="#D4B89C" strokeWidth="0.5" />
      ))}
      {pearls.map(([x, y], i) => (
        <circle key={'h'+i} cx={x - 2} cy={y - 2} r="2" fill="#FFFEF9" opacity="0.8" />
      ))}
      <circle cx="0" cy="-20" r="1.5" fill="#B8915A" />
    </g>
  );
}

function EarringsHoop() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#EEDCC4', '#DDC097']} />
      <g transform="translate(70 100)" fill="none" stroke="#B8915A" strokeWidth="3">
        <circle cx="0" cy="0" r="28" />
        <circle cx="0" cy="0" r="28" stroke="#D4B89C" strokeWidth="1" strokeDasharray="2 4" />
      </g>
      <g transform="translate(140 110)" fill="none" stroke="#B8915A" strokeWidth="3">
        <circle cx="0" cy="0" r="22" />
        <circle cx="0" cy="0" r="22" stroke="#D4B89C" strokeWidth="1" strokeDasharray="2 4" />
      </g>
    </svg>
  );
}

function EarringsHeart() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F2D9D4', '#E2B7AE']} />
      {[[70, 90], [140, 110]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 8 C -10 -4 -22 -4 -22 8 C -22 18 0 32 0 32 C 0 32 22 18 22 8 C 22 -4 10 -4 0 8 Z"
            fill="none" stroke="#B8915A" strokeWidth="2.5" />
          <circle cx="0" cy="12" r="4" fill="#FBF6EC" stroke="#D4B89C" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

// ── Necklace ─────────────────────────────────────────────────────────────

function NecklaceHeart() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#EFDFD2', '#DDC2AC']} />
      <path d="M 35 50 Q 100 130 165 50"
        fill="none" stroke="#B8915A" strokeWidth="1.2" strokeDasharray="2 3" />
      <g transform="translate(100 124)">
        <path d="M0 6 C -14 -8 -32 -8 -32 8 C -32 24 0 48 0 48 C 0 48 32 24 32 8 C 32 -8 14 -8 0 6 Z"
          fill="none" stroke="#B8915A" strokeWidth="3" />
        <circle cx="0" cy="-2" r="3" fill="#B8915A" />
      </g>
    </svg>
  );
}

// ── Ring ─────────────────────────────────────────────────────────────

function RingSolitaire() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#EEDCC4', '#DDBE99']} />
      <g transform="translate(100 110)">
        <ellipse cx="0" cy="20" rx="42" ry="48" fill="none" stroke="#B8915A" strokeWidth="4" />
        <ellipse cx="0" cy="20" rx="32" ry="38" fill="none" stroke="#D4B89C" strokeWidth="1" />
        <g transform="translate(0 -22)">
          <path d="M -10 0 L 0 -14 L 10 0 L 0 12 Z" fill="#FBF6EC" stroke="#B8915A" strokeWidth="1.5" />
          <path d="M -10 0 L 0 12 L 10 0" fill="none" stroke="#B8915A" strokeWidth="0.6" />
          <path d="M 0 -14 L 0 12" stroke="#B8915A" strokeWidth="0.4" />
        </g>
      </g>
    </svg>
  );
}

// ── Bracelet ─────────────────────────────────────────────────────────────

function BraceletChain() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F0DCC4', '#DDBE99']} />
      <g transform="translate(100 100)" fill="none" stroke="#B8915A" strokeWidth="2.4">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = Math.cos(a) * 50;
          const y = Math.sin(a) * 50;
          const rot = (a * 180) / Math.PI;
          return (
            <ellipse key={i} cx={x} cy={y} rx="8" ry="5" transform={`rotate(${rot} ${x} ${y})`} />
          );
        })}
      </g>
    </svg>
  );
}

// ── Perfume bottle ───────────────────────────────────────────────────────

function PerfumeBottle({ accent = '#7E2A2A', cap = '#3A1010', label = 'EGEO' }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F4EBD9', '#E2D3B8']} />
      <g transform="translate(100 100)">
        {/* shadow */}
        <ellipse cx="0" cy="68" rx="46" ry="4" fill="rgba(34,21,18,0.12)" />
        {/* cap */}
        <rect x="-16" y="-72" width="32" height="22" rx="3" fill={cap} />
        {/* neck */}
        <rect x="-10" y="-50" width="20" height="10" fill={cap} opacity="0.7" />
        {/* bottle body */}
        <path d="M -40 -40 Q -40 -50 -28 -50 L 28 -50 Q 40 -50 40 -40 L 40 60 Q 40 68 32 68 L -32 68 Q -40 68 -40 60 Z"
          fill={accent} />
        {/* highlight */}
        <path d="M -34 -38 Q -34 -46 -26 -46 L -22 -46 L -22 60 Q -22 64 -28 64 L -32 64 Q -34 60 -34 56 Z"
          fill="rgba(255,255,255,0.18)" />
        {/* label area */}
        <rect x="-26" y="-10" width="52" height="36" fill="rgba(255,255,255,0.85)" rx="1" />
        <text x="0" y="8" textAnchor="middle"
          fontFamily="'Instrument Serif', serif" fontSize="11" fill={accent}
          fontStyle="italic">{label}</text>
        <text x="0" y="20" textAnchor="middle"
          fontFamily="'Manrope', sans-serif" fontSize="5" fill={accent}
          letterSpacing="2">EAU DE PARFUM</text>
      </g>
    </svg>
  );
}

// ── Handbag ──────────────────────────────────────────────────────────────

function Handbag({ body = '#9A2A30', handle = '#3A1018', buckle = '#D4A574' }) {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F0E0CC', '#DEC9AD']} />
      <g transform="translate(100 110)">
        {/* shadow */}
        <ellipse cx="0" cy="58" rx="60" ry="4" fill="rgba(34,21,18,0.12)" />
        {/* strap */}
        <path d="M -50 -10 Q -50 -50 0 -50 Q 50 -50 50 -10"
          fill="none" stroke={handle} strokeWidth="4" />
        {/* body */}
        <rect x="-58" y="-12" width="116" height="68" rx="4" fill={body} />
        {/* flap */}
        <path d="M -58 -12 L 58 -12 L 58 22 Q 0 44 -58 22 Z" fill={body} />
        <path d="M -58 -12 L 58 -12 L 58 22 Q 0 44 -58 22 Z" fill="rgba(0,0,0,0.12)" />
        {/* lock plate */}
        <rect x="-9" y="14" width="18" height="14" rx="1" fill={buckle} />
        <rect x="-4" y="18" width="8" height="2" rx="1" fill="rgba(0,0,0,0.4)" />
        {/* corner accent */}
        <path d="M -58 -12 L -52 -12 L -58 -6 Z" fill="rgba(255,255,255,0.1)" />
      </g>
    </svg>
  );
}

function Clutch() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F0DDD2', '#E2C0B0']} />
      <g transform="translate(100 100)">
        <ellipse cx="0" cy="44" rx="64" ry="4" fill="rgba(34,21,18,0.12)" />
        <path d="M -64 0 L 64 0 L 64 30 L -64 30 Z" fill="#7A4A55" />
        <path d="M -64 0 L 0 -34 L 64 0 L 0 12 Z" fill="#9A6470" />
        <circle cx="0" cy="6" r="3" fill="#D4A574" />
        {/* chain hint */}
        <path d="M -54 0 Q -64 -24 -50 -32" fill="none" stroke="#D4A574" strokeWidth="1.2"
          strokeDasharray="2 2" />
        <path d="M 54 0 Q 64 -24 50 -32" fill="none" stroke="#D4A574" strokeWidth="1.2"
          strokeDasharray="2 2" />
      </g>
    </svg>
  );
}

// ── Gift box ─────────────────────────────────────────────────────────────

function GiftBox({ ribbon = '#D88FA0', body = '#FBF6EC', tall = false }) {
  const h = tall ? 84 : 64;
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#F4EBD9', '#E5D3B5']} />
      <g transform={`translate(100 ${tall ? 108 : 116})`}>
        <ellipse cx="0" cy={h/2 + 4} rx="64" ry="4" fill="rgba(34,21,18,0.12)" />
        {/* box body */}
        <rect x="-58" y={-h/2} width="116" height={h} rx="2" fill={body} stroke="rgba(34,21,18,0.12)" strokeWidth="0.6" />
        {/* lid line */}
        <line x1="-58" y1={-h/2 + 18} x2="58" y2={-h/2 + 18} stroke="rgba(34,21,18,0.18)" strokeWidth="0.6" />
        {/* vertical ribbon */}
        <rect x="-7" y={-h/2 - 22} width="14" height={h + 22} fill={ribbon} />
        {/* bow */}
        <g transform={`translate(0 ${-h/2 - 14})`}>
          <ellipse cx="-14" cy="-2" rx="14" ry="10" fill={ribbon} />
          <ellipse cx="14" cy="-2" rx="14" ry="10" fill={ribbon} />
          <ellipse cx="-14" cy="-2" rx="7" ry="5" fill="rgba(255,255,255,0.25)" />
          <ellipse cx="14" cy="-2" rx="7" ry="5" fill="rgba(255,255,255,0.25)" />
          <rect x="-6" y="-6" width="12" height="12" fill={ribbon} />
          {/* tails */}
          <path d="M -2 4 L -10 22 L -4 18 L -6 28 L 0 18 L 6 28 L 4 18 L 10 22 L 2 4 Z"
            fill={ribbon} />
        </g>
      </g>
    </svg>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────

const svgFull = { position: 'absolute', inset: 0, width: '100%', height: '100%' };

function PHBg({ colors }) {
  return (
    <>
      <rect x="0" y="0" width="200" height="200" fill={colors[0]} />
      <rect x="0" y="0" width="200" height="200" fill={`url(#g-${colors.join('')})`} />
      <defs>
        <linearGradient id={`g-${colors.join('')}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      {/* paper grain */}
      {Array.from({ length: 24 }).map((_, i) => (
        <circle key={i}
          cx={(i * 37) % 200}
          cy={(i * 53) % 200}
          r="0.5"
          fill="rgba(34,21,18,0.08)" />
      ))}
    </>
  );
}

function Generic() {
  return (
    <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" style={svgFull}>
      <PHBg colors={['#EEDCC4', '#DDBE99']} />
      <text x="100" y="108" textAnchor="middle"
        fontFamily="'Instrument Serif', serif" fontSize="48" fontStyle="italic"
        fill="rgba(34,21,18,0.3)">TN</text>
    </svg>
  );
}

Object.assign(window, { Placeholder });
