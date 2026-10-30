
import React, { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger, EASE } from "../lib/motion.js";
import {
  products,
  WHATSAPP_URL,
} from "../data/content.js";
import SplitText from "./SplitText.jsx";

import misaiAiVideo from "../assets/misai-ai-video.mp4";
import misaiPlatformVideo from "../assets/misai-platform-video.mp4";
import misaiAnalyticsVideo from "../assets/misai-analytics-video.mp4";
import misaiProVideo from "../assets/misai-pro-video.mp4";
import misaiStudioVideo from "../assets/misai-studio-video.mp4";

const pad = (n) => String(n).padStart(2, "0");

/* Product video imports */
const PRODUCT_VIDEOS = {
  ai: misaiAiVideo,
  platform: misaiPlatformVideo,
  analytics: misaiAnalyticsVideo,
  misai: misaiProVideo,
  studio: misaiStudioVideo,
};

/* Product Explore links */
const PRODUCT_LINKS = {
  ai: "https://frontend-alpha-inky-16.vercel.app/",
  platform: "https://swiftroute-courier-backend.onrender.com/",
};

function onMove(event) {
  if (event.pointerType !== "mouse") return;

  const el = event.currentTarget;
  const r = el.getBoundingClientRect();

  if (!r.width || !r.height) return;

  el.style.setProperty(
    "--mx",
    ((event.clientX - r.left) / r.width - 0.5).toFixed(3)
  );

  el.style.setProperty(
    "--my",
    ((event.clientY - r.top) / r.height - 0.5).toFixed(3)
  );

  el.style.setProperty(
    "--px",
    `${((event.clientX - r.left) / r.width) * 100}%`
  );

  el.style.setProperty(
    "--py",
    `${((event.clientY - r.top) / r.height) * 100}%`
  );
}

function onLeave(event) {
  const el = event.currentTarget;

  el.style.setProperty("--mx", 0);
  el.style.setProperty("--my", 0);
}

export default function Products() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;

    if (!section || !stage || !track) return undefined;

    const mm = gsap.matchMedia();

    /* Desktop: pinned horizontal product cards */
    mm.add(
      "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = gsap.utils.toArray(".pcard", track);

        section.classList.add("has-pin");

        const distance = () =>
          Math.max(0, track.scrollWidth - stage.clientWidth);

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.max(distance(), 1)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            onUpdate: (self) => {
              if (barRef.current) {
                barRef.current.style.transform =
                  `scaleX(${self.progress})`;
              }

              if (countRef.current) {
                const index = Math.round(
                  self.progress * (cards.length - 1)
                );

                countRef.current.textContent = pad(index + 1);
              }
            },
          },
        });

        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: slide,
            start: "center 64%",
            end: "center 36%",
            toggleClass: {
              targets: card,
              className: "is-active",
            },
          });

          const video = card.querySelector(".product-video");

          if (video) {
            gsap.fromTo(
              video,
              { scale: 1.08 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: slide,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }
        });

        const media = cards.map((card) =>
          card.querySelector(".pcard-media")
        );

        const body = cards.map((card) =>
          card.querySelector(".pcard-reveal")
        );

        gsap.fromTo(
          media,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power4.inOut",
            stagger: 0.14,
            scrollTrigger: {
              trigger: stage,
              start: "top 78%",
              once: true,
            },
          }
        );

        gsap.fromTo(
          body,
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: EASE,
            stagger: 0.14,
            scrollTrigger: {
              trigger: stage,
              start: "top 78%",
              once: true,
            },
          }
        );

        return () => {
          section.classList.remove("has-pin");

          cards.forEach((card) =>
            card.classList.remove("is-active")
          );
        };
      }
    );

    /* Mobile and tablet: vertically stacked product cards */
    mm.add(
      "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.utils.toArray(".pcard", track).forEach((card) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 48 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: EASE,
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true,
              },
            }
          );
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="products"
      className="products"
      ref={sectionRef}
      aria-labelledby="products-title"
    >
      <div className="wrap products-head">
        <p className="eyebrow" data-rv>
          Our products
        </p>

        <h2
          id="products-title"
          className="display"
          data-split
        >
          <SplitText text={"PRODUCTS BUILT\nFOR ~WHAT'S ~NEXT."} />
        </h2>

        <p className="lede" data-rv data-rv-delay="0.1">
          Powerful products designed to help teams automate,
          understand and grow their businesses faster.
        </p>
      </div>

      <div className="pstage" ref={stageRef}>
        <div className="pstage-hud" aria-hidden="true">
          <span className="pstage-count">
            <b ref={countRef}>01</b> / {pad(products.length)}
          </span>

          <span className="pstage-bar">
            <i ref={barRef} />
          </span>
        </div>

        <div className="ptrack" ref={trackRef}>
          {products.map((p, i) => (
            <article
              className={`pcard pcard--${p.id}${
                i === 0 ? " is-active" : ""
              }`}
              key={p.id}
            >
              <div className="pcard-reveal">
                <div
                  className="pcard-tilt"
                  onPointerMove={onMove}
                  onPointerLeave={onLeave}
                >
                  <div className="pcard-media">
                    {PRODUCT_VIDEOS[p.id] ? (
                      <video
                        className="product-video"
                        src={PRODUCT_VIDEOS[p.id]}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        aria-hidden="true"
                      />
                    ) : (
                      <div className="product-video-fallback" />
                    )}

                    <div
                      className="pcard-spot"
                      aria-hidden="true"
                    />

                    <div
                      className="pcard-shade"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="pcard-top">
                    <span className="pcard-num">
                      {pad(i + 1)}
                    </span>

                    <span className="pcard-label">
                      {p.label}
                    </span>
                  </div>

                  <div className="pcard-body">
                    <h3 className="pcard-title">{p.title}</h3>

                    <p className="pcard-text">{p.text}</p>

                    <a
                      className="pcard-cta"
                      href={PRODUCT_LINKS[p.id] || WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Explore ${p.title}`}
                    >
                      <span>Explore product</span>

                      <span className="pcard-arrow">
                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                        />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
