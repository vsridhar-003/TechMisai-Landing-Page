import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from "../lib/motion.js";

/**
 * One coordinated reveal system for the whole page.
 *
 * Markup hooks (all optional, all play ONCE — nothing replays on re-entry):
 *   data-rv                fade + rise
 *   data-rv-delay="0.2"    optional delay for data-rv
 *   data-stagger           group; children with data-stagger-item stagger in
 *   data-split             word-mask heading (children built by <SplitText/>)
 *   data-scrub             words fade up as you scroll (scrubbed)
 *   data-clip              image clip-path reveal (+ inner [data-clip-inner] settle)
 *   data-parallax="10"     subtle vertical parallax (percent, scrubbed)
 *
 * Content stays visible if JS/GSAP fails because nothing is hidden in CSS;
 * start states are applied by GSAP itself (before first paint).
 */
export default function useSectionMotion(scopeRef) {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-rv]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: EASE,
            delay: parseFloat(el.dataset.rvDelay || "0"),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
      });

      gsap.utils.toArray("[data-stagger]").forEach((group) => {
        const items = group.querySelectorAll("[data-stagger-item]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.09,
            ease: EASE,
            scrollTrigger: { trigger: group, start: "top 86%", once: true },
          }
        );
      });

      gsap.utils.toArray("[data-split]").forEach((el) => {
        const words = el.querySelectorAll(".wi");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.05,
            ease: EASE,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });

      gsap.utils.toArray("[data-scrub]").forEach((el) => {
        const words = el.querySelectorAll(".sw");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              end: "bottom 48%",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-clip]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power4.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
        const inner = el.querySelector("[data-clip-inner]");
        if (inner) {
          gsap.fromTo(
            inner,
            { scale: 1.18 },
            {
              scale: 1,
              duration: 1.6,
              ease: EASE,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            }
          );
        }
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "8");
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, scopeRef);

    // Late layout changes (fonts, images) shift trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, [scopeRef]);
}
