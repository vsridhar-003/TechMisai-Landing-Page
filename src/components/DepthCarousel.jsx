import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import "./DepthCarousel.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function DepthCarousel({
  items = [],
  cardWidth = 270,
  cardHeight = 190,
  radius = 20,
  tint = "#FFFCF5",
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  duration = 650,
  autoplay = false,
  autoplayDelay = 3200,
  scrollDriven = false,
  loop = true,
  showControls = true,
  showIndicators = true,
  className = "",
}) {
  const data = useMemo(() => (Array.isArray(items) ? items : []).map((item) => typeof item === "string" ? { image: item, alt: "" } : item), [items]);
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const tweenRef = useRef(null);
  const dragRef = useRef(null);
  const positionRef = useRef(0);
  const activeRef = useRef(0);
  const scaleRef = useRef(1);
  const [active, setActive] = useState(0);

  const layout = useCallback((position, animate = false) => {
    const root = rootRef.current;
    if (!root || !data.length) return;
    const width = root.clientWidth || 600;
    const scale = clamp(width / (cardWidth + Math.abs(spread) * 2 + 120), 0.42, 1);
    scaleRef.current = scale;
    const direction = tiltDirection === "left" ? -1 : 1;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let distance = index - position;
      if (loop && data.length > 1) {
        distance = ((distance % data.length) + data.length) % data.length;
        if (distance > data.length / 2) distance -= data.length;
      }
      const back = Math.max(0, distance);
      const absDistance = Math.abs(distance);
      const shown = absDistance <= visibleCards + 0.5;
      const transform = `translate(-50%, -50%) scale(${scale}) translateX(${(direction * spread * distance).toFixed(2)}px) translateZ(${(-depth * distance).toFixed(2)}px) rotateY(${(direction * tilt * clamp(distance, 0, 1)).toFixed(2)}deg)`;
      const opacity = shown ? (distance < 0 ? Math.max(0, 1 + distance) : 1) : 0;
      const filter = `brightness(${Math.max(0.15, 1 - back * falloff).toFixed(2)}) blur(${(blur > 0 ? Math.min(blur, (back / Math.max(1, visibleCards)) * blur) : 0).toFixed(2)}px)`;
      const vars = { x: 0, opacity, filter, zIndex: Math.round(2000 - distance * 20), pointerEvents: shown && opacity > 0.05 ? "auto" : "none" };
      if (animate) {
        gsap.to(card, { duration: duration / 1000, ease: "power3.out", transform, ...vars, overwrite: true });
      } else {
        gsap.set(card, { transform, ...vars });
      }
    });
  }, [data.length, cardWidth, spread, tiltDirection, loop, visibleCards, depth, tilt, falloff, blur, duration]);

  const goTo = useCallback((rawIndex, animate = true) => {
    if (!data.length) return;
    const index = loop ? ((rawIndex % data.length) + data.length) % data.length : clamp(rawIndex, 0, data.length - 1);
    positionRef.current = index;
    activeRef.current = index;
    setActive(index);
    layout(index, animate);
  }, [data.length, loop, layout]);

  const move = useCallback((step) => goTo(activeRef.current + step, true), [goTo]);

  useEffect(() => {
    layout(positionRef.current, false);
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => layout(positionRef.current, false));
    observer.observe(root);
    return () => observer.disconnect();
  }, [layout]);

  // When enabled, the carousel advances as the user scrolls through its parent section.
  // The section is pinned with CSS so each transition has time to be seen.
  useEffect(() => {
    if (!scrollDriven || data.length < 2) return undefined;
    const section = rootRef.current?.closest("#clients");
    if (!section) return undefined;

    let frame = 0;
    const updateFromScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const scrollableDistance = Math.max(1, section.offsetHeight - window.innerHeight);
        const progress = clamp(-rect.top / scrollableDistance, 0, 1);
        const nextIndex = Math.round(progress * (data.length - 1));
        if (nextIndex !== activeRef.current) {
          positionRef.current = nextIndex;
          activeRef.current = nextIndex;
          setActive(nextIndex);
          layout(nextIndex, true);
        }
      });
    };

    updateFromScroll();
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", updateFromScroll);
    return () => {
      window.removeEventListener("scroll", updateFromScroll);
      window.removeEventListener("resize", updateFromScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollDriven, data.length, layout]);

  useEffect(() => {
    if (!autoplay || scrollDriven || data.length < 2) return undefined;
    const root = rootRef.current;
    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    root?.addEventListener("mouseenter", pause);
    root?.addEventListener("mouseleave", resume);
    root?.addEventListener("focusin", pause);
    root?.addEventListener("focusout", resume);
    const timer = window.setInterval(() => { if (!paused) move(1); }, Math.max(autoplayDelay, 800));
    return () => {
      window.clearInterval(timer);
      root?.removeEventListener("mouseenter", pause);
      root?.removeEventListener("mouseleave", resume);
      root?.removeEventListener("focusin", pause);
      root?.removeEventListener("focusout", resume);
    };
  }, [autoplay, scrollDriven, autoplayDelay, data.length, move]);

  useEffect(() => () => { tweenRef.current?.kill(); gsap.killTweensOf(cardRefs.current); }, []);

  const onPointerDown = (event) => {
    if (data.length < 2) return;
    dragRef.current = { x: event.clientX, lastX: event.clientX, moved: false, start: positionRef.current, id: event.pointerId };
    tweenRef.current?.kill();
  };
  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    const delta = event.clientX - drag.x;
    if (Math.abs(delta) > 5) drag.moved = true;
    if (!drag.moved) return;
    const stepSize = Math.max(cardWidth * 0.55 * scaleRef.current, 45);
    const raw = drag.start - delta / stepSize;
    positionRef.current = raw;
    layout(raw, false);
    drag.lastX = event.clientX;
  };
  const onPointerUp = () => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (drag.moved) goTo(Math.round(positionRef.current), true);
  };
  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
  };

  return (
    <div
      ref={rootRef}
      className={`depth-carousel ${className}`.trim()}
      style={{ "--dc-perspective": `${perspective}px`, "--dc-tint": tint }}
      role="group"
      aria-roledescription="carousel"
      aria-label="Client logos carousel"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="depth-carousel__stage">
        {data.map((item, index) => (
          <button
            key={`${item.alt || "client"}-${index}`}
            type="button"
            className="depth-carousel__card"
            ref={(element) => { cardRefs.current[index] = element; }}
            style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
            aria-label={`Show ${item.alt || `client ${index + 1}`}`}
            aria-pressed={active === index}
            onClick={() => goTo(index, true)}
          >
            <img className="depth-carousel__img" src={item.image} alt={item.alt || "Client logo"} draggable="false" />
            <span className="depth-carousel__tint" aria-hidden="true" />
          </button>
        ))}
      </div>
      {showControls && data.length > 1 && <>
        <button type="button" className="depth-carousel__arrow depth-carousel__arrow--prev" aria-label="Previous client" onClick={() => move(-1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" className="depth-carousel__arrow depth-carousel__arrow--next" aria-label="Next client" onClick={() => move(1)}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </>}
      {showIndicators && data.length > 1 && <div className="depth-carousel__dots" role="group" aria-label="Choose client">
        {data.map((item, index) => <button key={`${item.alt || "dot"}-${index}`} type="button" className={`depth-carousel__dot${active === index ? " is-active" : ""}`} aria-label={`Go to ${item.alt || `client ${index + 1}`}`} aria-pressed={active === index} onClick={() => goTo(index, true)} />)}
      </div>}
    </div>
  );
}
