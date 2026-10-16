import React, { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/motion.js";
import SplitText from "./SplitText.jsx";

const AREAS = ["AI", "Digital products", "Web development", "Automation", "Software engineering"];

export default function Intro() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { clipPath: "inset(0% 6% round 36px)" },
        {
          clipPath: "inset(0% 0% round 0px)",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="intro" className="section intro" ref={sectionRef} aria-labelledby="intro-title">
      <div className="wrap intro-grid">
        <div className="intro-main">
          <p className="eyebrow" data-rv>
            Who we are
          </p>
          <h2 id="intro-title" className="intro-statement">
            <SplitText variant="scrub" text={"TECHNOLOGY THAT\nMOVES ~IDEAS ~FORWARD."} />
          </h2>
        </div>

        <div className="intro-side">
          <p className="lede" data-rv>
            TechMisai works across AI, digital products, web development, automation and software engineering —
            turning ambitious ideas into intelligent, scalable digital experiences.
          </p>
          <ul className="chips" data-stagger>
            {AREAS.map((a) => (
              <li key={a} data-stagger-item>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap">
        <div className="intro-visual" data-clip>
          <div className="intro-visual-inner" data-clip-inner>
            <video
              src="/ai.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "20px",
                background: "#0f172a",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
