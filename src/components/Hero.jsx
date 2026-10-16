import React, { useLayoutEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "../data/content.js";
import { gsap, EASE, prefersReducedMotion, onAnchorClick } from "../lib/motion.js";
import SplitText from "./SplitText.jsx";

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(".hero-canvas-wrap", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8, ease: "power2.out" }, 0)
        .fromTo(".hero .eyebrow", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0.2)
        .fromTo(".hero h1 .wi", { yPercent: 115 }, { yPercent: 0, duration: 1.25, stagger: 0.08 }, 0.35)
        .fromTo(".hero-copy", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.95)
        .fromTo(".hero-actions > *", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.15)
        .fromTo(".hero-scroll", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 1.6);

      // Gentle parallax as the hero leaves the screen.
      gsap.to(".hero-canvas-wrap", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" ref={root} aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-canvas-wrap" />
        <div className="hero-bottom-blur" />
      </div>

      <div className="wrap hero-inner">
        <p className="eyebrow">
          AI <i>•</i> Design <i>•</i> Technology
        </p>

        <h1 id="hero-title" className="hero-title">
          <SplitText text={"BUILD SMARTER.\nCREATE ~WHAT'S ~NEXT."} />
        </h1>

        <p className="hero-copy">
          TechMisai transforms ambitious ideas into intelligent digital experiences, innovative products, and
          scalable technology solutions.
        </p>

        <div className="hero-actions">
          <a className="btn btn--primary" href="#services" onClick={onAnchorClick("services")}>
            <span>Explore Services</span>
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <a className="btn btn--ghost" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            <span>Let’s Talk</span>
          </a>
        </div>
      </div>

      <a className="hero-scroll" href="#intro" onClick={onAnchorClick("intro")} aria-label="Scroll down">
        <span>Scroll</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
