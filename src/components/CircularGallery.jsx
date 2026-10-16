import React, { useEffect, useRef } from "react";
import "./CircularGallery.css";

export default function CircularGallery({
  items = [],
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 14px Figtree",
  fontUrl,
  scrollSpeed = 2,
  scrollEase = 0.02,
  autoPlay = true,
  autoSpeed = 0.0035,
  className = "",
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stateRef = useRef({ current: 0, target: 0, dragging: false, startX: 0, startTarget: 0 });

  useEffect(() => {
    if (!fontUrl) return undefined;
    const existing = document.querySelector(`link[data-circular-gallery-font="${fontUrl}"]`);
    if (existing) return undefined;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    link.dataset.circularGalleryFont = fontUrl;
    document.head.appendChild(link);
    return undefined;
  }, [fontUrl]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || !items.length) return undefined;

    const state = stateRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let itemStep = 0;

    const measure = () => {
      const width = root.clientWidth;
      itemStep =
        width <= 600
          ? Math.max(145, width * 0.27)
          : Math.max(155, Math.min(260, width * 0.27));
    };

    const render = () => {
      const bounds = root.getBoundingClientRect();
      const isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight && !document.hidden;
      if (!isVisible) {
        raf = window.requestAnimationFrame(render);
        return;
      }

      if (autoPlay && !reduceMotion.matches && !state.dragging) state.target += autoSpeed;
      state.current += (state.target - state.current) * Math.max(0.008, Math.min(0.12, scrollEase));

      const total = track.children.length;
      [...track.children].forEach((card, index) => {
        const raw = index - state.current;
        const offset = ((raw + total * 3) % total) - total / 2;
        const normalized = Math.max(-2.2, Math.min(2.2, offset));
        const curve = Math.abs(bend) * normalized * normalized * 9;
        const x = offset * itemStep;
        const y = bend >= 0 ? curve : -curve;
        const scale = Math.max(0.72, 1 - Math.abs(normalized) * 0.11);
        const opacity = Math.max(0.18, 1 - Math.abs(normalized) * 0.28);

        card.style.transform = `translate3d(${x}px, ${y}px, ${-Math.abs(normalized) * 95}px) rotateY(${-normalized * 14}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(100 - Math.round(Math.abs(normalized) * 10));
        card.style.filter = `blur(${Math.max(0, Math.abs(normalized) - 1.2) * 1.1}px)`;
      });

      raf = window.requestAnimationFrame(render);
    };

    const onWheel = (event) => {
      const bounds = root.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      state.target += Math.sign(delta || 1) * scrollSpeed * 0.075;
    };
    const onPointerDown = (event) => {
      state.dragging = true;
      state.startX = event.clientX;
      state.startTarget = state.target;
      root.classList.add("is-dragging");
      root.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      if (state.dragging) state.target = state.startTarget - (event.clientX - state.startX) / itemStep;
    };
    const onPointerUp = () => {
      state.dragging = false;
      root.classList.remove("is-dragging");
    };
    const onKeyDown = (event) => {
      if (event.key === "ArrowRight") state.target += 1;
      if (event.key === "ArrowLeft") state.target -= 1;
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);
    window.addEventListener("wheel", onWheel, { passive: true });
    root.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    root.addEventListener("keydown", onKeyDown);
    render();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [items, bend, scrollEase, scrollSpeed, autoPlay, autoSpeed]);

  const repeated = [...items, ...items, ...items];
  const fontFamily = font.match(/\d+px\s+(.+)$/)?.[1] || "Figtree";
  const fontSize = font.match(/(\d+px)/)?.[1] || "14px";

  return (
    <div
      ref={rootRef}
      className={`circular-gallery ${className}`.trim()}
      tabIndex={0}
      role="region"
      aria-label="Circular client gallery. It moves automatically; use the mouse to drag, the wheel, or arrow keys to navigate."
      style={{
        "--gallery-radius": `${Math.max(0, borderRadius) * 100}%`,
        "--gallery-text": textColor,
        "--gallery-font": `${fontSize} ${fontFamily}`,
      }}
    >
      <div className="circular-gallery-track" ref={trackRef}>
        {repeated.map((item, index) => (
          <article className="circular-gallery-card" key={`${item.text || item.alt || "gallery-item"}-${index}`}>
            <div className="circular-gallery-image-frame">
              <img src={item.image} alt={item.alt || item.text || "Gallery item"} draggable="false" />
            </div>
            {item.text && <div className="circular-gallery-label">{item.text}</div>}
          </article>
        ))}
      </div>
      <div className="circular-gallery-hint" aria-hidden="true">AUTO MOVING · DRAG TO CONTROL</div>
    </div>
  );
}
