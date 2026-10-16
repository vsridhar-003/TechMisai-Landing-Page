
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./ClientCarousel.css";

const SPEED = 108; // Autoplay speed in pixels per second

function LogoGroup({ items, duplicate = false, groupRef }) {
  return (
    <div
      ref={groupRef}
      className="client-logo-group"
      aria-hidden={duplicate ? "true" : undefined}
    >
      {items.map((client, index) => (
        <article
          className="client-logo-card"
          key={`${client.title}-${duplicate ? "copy-" : ""}${index}`}
          aria-label={
            duplicate ? undefined : `${client.title} — ${client.type}`
          }
        >
          <div className="client-logo-media">
            <img
              src={client.logo}
              alt={duplicate ? "" : `${client.title} logo`}
              draggable="false"
              loading="lazy"
            />
          </div>

          <h3>{client.title}</h3>
          <p>{client.type}</p>
        </article>
      ))}
    </div>
  );
}

export default function ClientCarousel({ items = [] }) {
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const groupRef = useRef(null);

  const frameRef = useRef(null);
  const previousTimeRef = useRef(0);
  const positionRef = useRef(0);
  const groupWidthRef = useRef(0);

  const draggingRef = useRef(false);
  const pointerStartRef = useRef(0);
  const positionStartRef = useRef(0);
  const activePointerRef = useRef(null);

  const visibleRef = useRef(false);

  const [isDragging, setIsDragging] = useState(false);

  const normalizePosition = useCallback((position) => {
    const width = groupWidthRef.current;

    if (!width) return 0;

    // Keep the track within one seamless repeating group.
    return -((((-position) % width) + width) % width);
  }, []);

  const applyPosition = useCallback((position) => {
    positionRef.current = position;

    if (trackRef.current) {
      trackRef.current.style.transform =
        `translate3d(${position}px, 0, 0)`;
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const group = groupRef.current;

    if (!stage || !track || !group || items.length === 0) return;

    let disposed = false;

    const measure = () => {
      const oldWidth = groupWidthRef.current;
      const newWidth = group.getBoundingClientRect().width;

      if (!newWidth) return;

      groupWidthRef.current = newWidth;

      if (oldWidth && oldWidth !== newWidth) {
        applyPosition(normalizePosition(positionRef.current));
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(group);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });

    visibilityObserver.observe(stage);

    const animate = (time) => {
      if (disposed) return;

      if (!previousTimeRef.current) {
        previousTimeRef.current = time;
      }

      const delta = Math.min((time - previousTimeRef.current) / 1000, 0.05);
      previousTimeRef.current = time;

      const canMove =
        !draggingRef.current &&
        visibleRef.current &&
        groupWidthRef.current > 0;

      if (canMove) {
        const nextPosition = normalizePosition(
          positionRef.current - SPEED * delta
        );

        applyPosition(nextPosition);
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      disposed = true;

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      previousTimeRef.current = 0;
    };
  }, [items.length, applyPosition, normalizePosition]);

  const handlePointerDown = (event) => {
    // Only the primary mouse button; touch and pen are supported too.
    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (event.target.closest("button")) return;

    if (!groupWidthRef.current) return;

    draggingRef.current = true;
    activePointerRef.current = event.pointerId;
    pointerStartRef.current = event.clientX;
    positionStartRef.current = positionRef.current;

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (
      !draggingRef.current ||
      activePointerRef.current !== event.pointerId
    ) {
      return;
    }

    const distance = event.clientX - pointerStartRef.current;

    applyPosition(
      normalizePosition(positionStartRef.current + distance)
    );
  };

  const finishDrag = (event) => {
    if (
      !draggingRef.current ||
      activePointerRef.current !== event.pointerId
    ) {
      return;
    }

    draggingRef.current = false;
    activePointerRef.current = null;

    applyPosition(normalizePosition(positionRef.current));
    setIsDragging(false);

    // Autoplay resumes automatically unless manually paused.
  };

  if (!items.length) return null;

  return (
    <section
      ref={stageRef}
      className={[
        "client-curved-gallery",
        "client-carousel",
        isDragging ? "is-dragging" : "",
      ].filter(Boolean).join(" ")}
      role="region"
      aria-roledescription="carousel"
      aria-label="Our client logos"
    >
      <div
        className="client-logo-window"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
      >
        <div
          ref={trackRef}
          className="client-logo-track"
          aria-label="Client logos"
        >
          <LogoGroup items={items} groupRef={groupRef} />
          <LogoGroup items={items} duplicate />
        </div>

      </div>

      <div className="client-carousel-controls">
        <span className="client-carousel-caption" aria-hidden="true">
          CLIENTS · OUR PARTNERS
        </span>
      </div>
    </section>
  );
}
