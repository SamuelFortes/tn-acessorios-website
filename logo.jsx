// Logo TN Acessórios — SVG recriado a partir do perfil do Instagram.

function LogoMark({ size = 96, bg = 'currentColor', fg = 'var(--accent-fg)', ring = 'rgba(255,255,255,.5)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-label="TN Acessórios">
      <circle cx="100" cy="100" r="98" fill={bg} />
      <circle cx="100" cy="100" r="92" fill="none" stroke={ring} strokeWidth="0.5" />
      <path
        d="M100 36 L103 56 L123 60 L103 64 L100 84 L97 64 L77 60 L97 56 Z"
        fill={fg}
        opacity="0.85"
      />
      <circle cx="138" cy="48" r="2" fill={fg} opacity="0.6" />
      <circle cx="62" cy="48" r="1.5" fill={fg} opacity="0.5" />
      <text
        x="100" y="138"
        textAnchor="middle"
        fontFamily="'Instrument Serif', 'Cormorant Garamond', Georgia, serif"
        fontSize="80"
        fontStyle="italic"
        fill={fg}
        letterSpacing="-2"
      >TN</text>
      <defs>
        <path id="logo-curve" d="M 38 132 A 62 62 0 0 0 162 132" fill="none" />
      </defs>
      <text
        fontFamily="'Manrope', system-ui, sans-serif"
        fontSize="11"
        fontWeight="500"
        letterSpacing="6"
        fill={fg}
        opacity="0.85"
      >
        <textPath href="#logo-curve" startOffset="50%" textAnchor="middle">
          A C E S S Ó R I O S
        </textPath>
      </text>
    </svg>
  );
}

function LogoWordmark({ height = 28, color = 'currentColor' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color }}>
      <svg height={height} viewBox="0 0 60 60" aria-hidden="true">
        <circle cx="30" cy="30" r="29" fill="currentColor" opacity="0.08" />
        <circle cx="30" cy="30" r="29" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <path d="M30 9 L31.4 17.4 L39.8 18.8 L31.4 20.2 L30 28.6 L28.6 20.2 L20.2 18.8 L28.6 17.4 Z" fill="currentColor" opacity="0.85" />
        <text x="30" y="46" textAnchor="middle"
          fontFamily="'Instrument Serif', Georgia, serif" fontSize="26" fontStyle="italic"
          fill="currentColor" letterSpacing="-1">TN</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: height * 0.78,
          fontStyle: 'italic',
          letterSpacing: '-0.02em',
        }}>TN Acessórios</span>
        <span style={{
          fontSize: 9,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          opacity: 0.6,
          marginTop: 4,
          fontFamily: "'Manrope', sans-serif",
        }}>Teresina · desde 2022</span>
      </div>
    </div>
  );
}

Object.assign(window, { LogoMark, LogoWordmark });
