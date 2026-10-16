import React, { useId, useMemo } from "react";

/* Deterministic pseudo-random so artwork never changes between renders. */
function rng(seed) {
  let a = (seed + 1) * 2654435761;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COLORS = {
  blue: ["#176BFF", "#C000D9"],
  pink: ["#FF4FA3", "#7900F2"],
  mix: ["#176BFF", "#FF4FA3"],
};

/**
 * Abstract "fibre-optic" artwork generated from a seed. Used for solutions,
 * company and work visuals so every image is original, on-palette and tiny
 * (pure SVG, no network, no raster).
 */
export default function FibreArt({ seed = 0, accent = "mix", className = "" }) {
  const uid = useId().replace(/:/g, "");
  const [c1, c2] = COLORS[accent] || COLORS.mix;

  const curves = useMemo(() => {
    const r = rng(seed);
    const out = [];
    const count = 11;
    const base = 150 + r() * 120;
    for (let i = 0; i < count; i++) {
      const k = i - (count - 1) / 2;
      const spread = 7 + r() * 5;
      const y0 = base + k * spread;
      const a1 = 40 + r() * 90;
      const a2 = -60 + r() * 120;
      const y1 = y0 + a1 + k * 9;
      const y2 = y0 + a2 - k * 7;
      const y3 = base + 40 + r() * 170 + k * 22;
      out.push({
        d: `M -20 ${y0.toFixed(1)} C 150 ${y1.toFixed(1)}, 330 ${y2.toFixed(1)}, 620 ${y3.toFixed(1)}`,
        w: 0.7 + r() * 1.6,
        o: 0.35 + r() * 0.55,
        hot: i % 4 === 1,
      });
    }
    const dots = Array.from({ length: 7 }, () => ({
      x: 60 + r() * 480,
      y: 60 + r() * 360,
      r: 1.4 + r() * 2.6,
      hot: r() > 0.55,
    }));
    const orb = { x: 130 + r() * 340, y: 110 + r() * 240, r: 90 + r() * 80 };
    return { out, dots, orb };
  }, [seed]);

  return (
    <svg
      className={`fibre-art ${className}`}
      viewBox="0 0 600 480"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F5F7FF" />
        </linearGradient>
        <linearGradient id={`st${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c1} stopOpacity="0" />
          <stop offset="0.35" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`hot${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF4FA3" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FF4FA3" />
          <stop offset="1" stopColor="#C000D9" />
        </linearGradient>
        <radialGradient id={`orb${uid}`}>
          <stop offset="0" stopColor={c1} stopOpacity="0.55" />
          <stop offset="1" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`orb2${uid}`}>
          <stop offset="0" stopColor={c2} stopOpacity="0.4" />
          <stop offset="1" stopColor={c2} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="480" fill={`url(#bg${uid})`} />
      <circle cx={curves.orb.x} cy={curves.orb.y} r={curves.orb.r * 1.5} fill={`url(#orb${uid})`} />
      <circle cx={600 - curves.orb.x * 0.6} cy={480 - curves.orb.y * 0.7} r={curves.orb.r * 1.3} fill={`url(#orb2${uid})`} />
      <g fill="none" strokeLinecap="round">
        {curves.out.map((c, i) => (
          <React.Fragment key={i}>
            <path d={c.d} stroke={`url(#${c.hot ? "hot" : "st"}${uid})`} strokeWidth={c.w * 5} opacity={0.08} />
            <path d={c.d} stroke={`url(#${c.hot ? "hot" : "st"}${uid})`} strokeWidth={c.w} opacity={c.o} />
          </React.Fragment>
        ))}
      </g>
      {curves.dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.hot ? "#FF4FA3" : "#17132F"} opacity="0.85" />
      ))}
    </svg>
  );
}
