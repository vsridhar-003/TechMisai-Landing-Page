import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registering is idempotent, so importing this file anywhere is safe.
gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const EASE = "power4.out";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Smooth-scroll to a section id (used by every in-page link). */
export function goTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
}

export function onAnchorClick(id, after) {
  return (event) => {
    event.preventDefault();
    if (after) after();
    // Small delay lets the mobile menu release its scroll lock first.
    window.setTimeout(() => goTo(id), 60);
  };
}
