import React, { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "../lib/motion.js";
import { services, WHATSAPP_URL } from "../data/content.js";
import SplitText from "./SplitText.jsx";

const pad = (n) => String(n).padStart(2, "0");

export default function Services() {
  const root = useRef(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 961px)", () => {
      const rows = gsap.utils.toArray(".sol-row", root.current);
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="services" className="section sol" ref={root} aria-labelledby="services-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow" data-rv>
            Our services
          </p>
          <h2 id="services-title" className="display" data-split>
            <SplitText text={"END-TO-END\n~TECHNOLOGY ~SERVICES."} />
          </h2>
        </div>

        <div className="sol-layout">
          <div className="sol-stage" aria-hidden="true">
            <div className="sol-stage-frame">
              {services.map((service, i) => (
                <div key={service.title} className={`sol-stage-art${i === active ? " is-on" : ""}`}>
                  {i <= 6 ? (
                    <video
                      src={
                        i === 0
                          ? "/ai-2.mp4"
                          : i === 1
                            ? "/digital-product-engineering.mp4"
                            : i === 2
                              ? "/web-design-development.mp4"
                              : i === 3
                                ? "/mobile-application-development.mp4"
                                : i === 4
                                  ? "/cloud-solutions.mp4"
                                  : i === 5
                                    ? "/ai-7.mp4"
                                    : "/ai-8.mp4"
                      }
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        background: "#0b1120",
                      }}
                    />
                  ) : (
                    <div className="sol-stage-fallback" />
                  )}
                </div>
              ))}
              <span className="sol-stage-num">{pad(active + 1)}</span>
            </div>
          </div>

          <ol className="sol-list">
            {services.map((service, i) => (
              <li
                key={service.title}
                className={`sol-row${i === active ? " is-active" : ""}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onFocus={() => setActive(i)}
              >
                <div className="sol-inline" aria-hidden="true">
                  {i <= 6 ? (
                    <video
                      src={
                        i === 0
                          ? "/ai-2.mp4"
                          : i === 1
                            ? "/digital-product-engineering.mp4"
                            : i === 2
                              ? "/web-design-development.mp4"
                              : i === 3
                                ? "/mobile-application-development.mp4"
                                : i === 4
                                  ? "/cloud-solutions.mp4"
                                  : i === 5
                                    ? "/ai-7.mp4"
                                    : "/ai-8.mp4"
                      }
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        borderRadius: "18px",
                        background: "#0b1120",
                      }}
                    />
                  ) : (
                    <div className="sol-inline-fallback" />
                  )}
                </div>
                <div className="sol-row-main" data-rv>
                  <span className="sol-num">{pad(i + 1)}</span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </div>
                  <a
                    className="arrow-btn"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Talk to us about ${service.title}`}
                  >
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
