import React, { useEffect, useRef } from "react";

/* Seeded random → the bundle looks the same on every load. */
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function makeSprite(color) {
  const s = document.createElement("canvas");
  s.width = s.height = 64;
  const c = s.getContext("2d");
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.18, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

/**
 * Flowing blue fibre-optic trails with pink accents and travelling light
 * pulses. Canvas 2D, DPR-capped, paused when off-screen or tab hidden,
 * single static frame under prefers-reduced-motion.
 */
export default function FiberCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blueSprite = makeSprite("rgba(23,107,255,0.55)");
    const pinkSprite = makeSprite("rgba(255,79,163,0.6)");

    let w = 0;
    let h = 0;
    let raf = 0;
    let onScreen = true;
    let lines = [];
    let gradBlue;
    let gradPink;
    const start = performance.now();

    const build = () => {
      const small = w < 700;
      const n = small ? 15 : 28;
      const rand = mulberry32(7);
      lines = Array.from({ length: n }, (_, i) => ({
        k: (i - (n - 1) / 2) / ((n - 1) / 2),
        ph: rand() * 6.283,
        sp: 0.14 + rand() * 0.2,
        amp: 0.006 + rand() * 0.014,
        width: 0.6 + rand() * 1.5,
        alpha: 0.45 + rand() * 0.5,
        pink: i % 6 === 2 || i % 11 === 7,
        pulse: i % 3 === 0,
        pOff: rand(),
        pSp: 0.035 + rand() * 0.05,
      }));
      gradBlue = ctx.createLinearGradient(0, 0, w, 0);
      gradBlue.addColorStop(0, "rgba(23,107,255,0)");
      gradBlue.addColorStop(0.3, "rgba(23,107,255,0.95)");
      gradBlue.addColorStop(0.75, "rgba(192,0,217,0.85)");
      gradBlue.addColorStop(1, "rgba(192,0,217,0.2)");
      gradPink = ctx.createLinearGradient(0, 0, w, 0);
      gradPink.addColorStop(0, "rgba(192,0,217,0)");
      gradPink.addColorStop(0.45, "rgba(192,0,217,0.9)");
      gradPink.addColorStop(0.85, "rgba(255,79,163,1)");
      gradPink.addColorStop(1, "rgba(255,79,163,0.4)");
    };

    const yAt = (line, x, t) => {
      const cy =
        h * (0.66 + 0.085 * Math.sin(x * 3.1 + t * 0.22) + 0.035 * Math.sin(x * 7.3 - t * 0.35));
      const spread = h * (0.012 + 0.15 * smooth(0.05, 1, x));
      return (
        cy +
        line.k * spread * (0.8 + 0.25 * Math.sin(x * 5 + line.ph + t * line.sp)) +
        line.amp * h * Math.sin(x * 9 + t * line.sp * 2 + line.ph)
      );
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const steps = w < 700 ? 44 : 72;

      for (const line of lines) {
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const x = -0.05 + (s / steps) * 1.1;
          const px = x * w;
          const py = yAt(line, x, t);
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = line.pink ? gradPink : gradBlue;
        ctx.globalAlpha = 0.07 * line.alpha;
        ctx.lineWidth = line.width * 6;
        ctx.stroke();
        ctx.globalAlpha = line.alpha;
        ctx.lineWidth = line.width;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      for (const line of lines) {
        if (!line.pulse) continue;
        const u = (t * line.pSp + line.pOff) % 1;
        const x = -0.05 + u * 1.1;
        const px = x * w;
        const py = yAt(line, x, t);
        const size = line.pink ? 34 : 26;
        const fade = Math.sin(u * Math.PI);
        ctx.globalAlpha = fade;
        ctx.drawImage(line.pink ? pinkSprite : blueSprite, px - size / 2, py - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = (now) => {
      raf = 0;
      if (!onScreen || document.hidden) return;
      draw((now - start) / 1000);
      raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (reduce || raf || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, w < 700 ? 1.5 : 1.75);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduce) draw(4.2);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);
    resize();

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) run();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (!document.hidden) run();
    };
    document.addEventListener("visibilitychange", onVisibility);
    run();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
