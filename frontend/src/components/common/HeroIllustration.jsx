/**
 * Original artwork (not a stock photo) used as the hero background.
 * Depicts two ideas central to ELMKUSOMA's mission:
 *   1. A mesh network of connected nodes — every region, one platform.
 *   2. An open notebook (daftari) line-art motif — the brand's signature.
 * Rendered at low opacity on the dark "ink" hero so headline text stays
 * fully readable on top of it.
 */
export default function HeroIllustration({ className = '' }) {
  const nodes = [
    [90, 120], [220, 60], [340, 160], [180, 220], [420, 90],
    [500, 210], [300, 280], [80, 260], [460, 320], [560, 130],
    [620, 260], [380, 40], [140, 340], [260, 380], [540, 380],
  ];

  const edges = [
    [0, 1], [1, 2], [2, 4], [1, 3], [3, 6], [2, 5], [4, 9], [5, 8],
    [6, 7], [6, 13], [8, 10], [9, 10], [5, 9], [11, 4], [0, 7],
    [3, 12], [12, 13], [13, 14], [8, 14],
  ];

  return (
    <svg
      viewBox="0 0 900 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Mesh network — "every region, connected" */}
      <g stroke="#2F6B4F" strokeWidth="1" opacity="0.55">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
      </g>
      <g fill="#E8A33D">
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 4 === 0 ? 4.5 : 3}
            opacity={i % 4 === 0 ? 0.9 : 0.5}
            className={i % 4 === 0 ? 'animate-pulse' : ''}
          />
        ))}
      </g>

      {/* Open notebook (daftari) line art, lower-right */}
      <g transform="translate(430,320)" opacity="0.35" stroke="#FAF9F4" strokeWidth="1.5" fill="none">
        <path d="M0,0 L200,-16 L200,200 L0,220 Z" />
        <path d="M200,-16 L400,0 L400,220 L200,200 Z" />
        {/* ruled lines, left page */}
        {[24, 48, 72, 96, 120, 144, 168].map((y) => (
          <line key={`l-${y}`} x1={16} y1={y - 4} x2={184} y2={y - 12} strokeWidth="0.75" opacity="0.6" />
        ))}
        {/* ruled lines, right page */}
        {[24, 48, 72, 96, 120, 144, 168].map((y) => (
          <line key={`r-${y}`} x1={216} y1={y - 12} x2={384} y2={y - 4} strokeWidth="0.75" opacity="0.6" />
        ))}
        {/* red margin rules, matching the site's signature motif */}
        <line x1={38} y1={-10} x2={30} y2={214} stroke="#C1443D" strokeWidth="1.5" opacity="0.8" />
        <line x1={362} y1={-10} x2={370} y2={214} stroke="#C1443D" strokeWidth="1.5" opacity="0.8" />
      </g>
    </svg>
  );
}
