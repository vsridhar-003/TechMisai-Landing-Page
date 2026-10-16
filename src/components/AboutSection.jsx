import React, { useLayoutEffect, useRef } from "react";
import {
  ArrowRight,
  Code2,
  Cloud,
  GraduationCap,
  Rocket,
  Smartphone,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { gsap, ScrollTrigger, onAnchorClick } from "../lib/motion.js";
import { ABOUT_STATISTICS } from "../data/content.js";
import "./AboutSection.css";

const SKILLS = [
  { label: "UI/UX Design", value: 90, Icon: Sparkles },
  { label: "Web Development", value: 85, Icon: Code2 },
  { label: "Mobile Applications", value: 80, Icon: Smartphone },
  { label: "AI & Automation", value: 75, Icon: Cloud },
];

const STAT_ICONS = [Rocket, UsersRound, GraduationCap, Trophy];

export default function AboutSection({
  animate = false,
  standalone = false,
  scrollOverlay = false,
}) {
  const sectionRef = useRef(null);

  // Existing About section reveal animations
  useLayoutEffect(() => {
    if (!animate) return undefined;

    const matchMedia = gsap.matchMedia();

    matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
      const select = (selector) =>
        gsap.utils.toArray(selector, sectionRef.current);

      const reveal = (elements, scale = 0.96) => {
        elements.forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 22, scale },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none play none",
              },
            }
          );
        });
      };

      reveal(select("[data-about-reveal]"));

      select("[data-about-reveal-group]").forEach((group) => {
        const children = gsap.utils.toArray(":scope > *", group);

        children.forEach((element, index) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 18, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.72,
              delay: index * 0.09,
              ease: "power3.out",
              scrollTrigger: {
                trigger: group,
                start: "top 88%",
                toggleActions: "play none play none",
              },
            }
          );
        });
      });

      select("[data-about-stat]").forEach((card, index) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 18, scale: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            delay: index * 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none play none",
            },
          }
        );
      });

      select("[data-about-image]").forEach((image) => {
        gsap.fromTo(
          image,
          { autoAlpha: 0, scale: 0.88 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: image,
              start: "top 90%",
              toggleActions: "play none play none",
            },
          }
        );
      });

      // Existing desktop scene-panel animation
      matchMedia.add("(min-width: 961px)", () => {
        const panels = select("[data-about-scene-panel]");
        const stickyTop = 96;

        panels.slice(0, -1).forEach((panel, index) => {
          const incoming = panels[index + 1];
          const start =
            index === 0 ? "top top" : `top top+=${stickyTop}`;

          ScrollTrigger.create({
            trigger: panel,
            start,
            endTrigger: incoming,
            end: `top top+=${stickyTop}`,
            pin: panel,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          gsap.fromTo(
            panel,
            { scale: 1, filter: "blur(0px)" },
            {
              scale: 0.94,
              filter: "blur(4px)",
              ease: "none",
              scrollTrigger: {
                trigger: incoming,
                start: `top top+=${panel.offsetHeight + (index === 0 ? 0 : stickyTop)}`,
                endTrigger: incoming,
                end: `top top+=${stickyTop}`,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      const workspace = sectionRef.current.querySelector(
        "[data-about-workspace-zoom]"
      );

      if (workspace) {
        gsap.fromTo(
          workspace,
          { scale: 1.06 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: workspace,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          }
        );
      }

      ScrollTrigger.refresh();
    });

    return () => matchMedia.revert();
  }, [animate]);

  // Homepage-only Hero → About scroll expansion.
  // This animation does not pin or make the About section sticky.
  useLayoutEffect(() => {
    if (!scrollOverlay || standalone) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return undefined;

    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const banner = section.querySelector(".about-banner");

      const contentGroups = section.querySelectorAll(
        ".about-intro-copy, .about-workspace, .about-skills, .about-stat, .about-cta-content"
      );

      if (banner) {
        gsap.fromTo(
          banner,
          {
            scale: 0.88,
            y: 72,
            borderTopLeftRadius: 34,
            borderTopRightRadius: 34,
            clipPath: "inset(0% 5% 0% 5% round 34px)",
          },
          {
            scale: 1,
            y: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top top",
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      contentGroups.forEach((element, index) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 26, scale: 0.985 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: Math.min(index % 3, 2) * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      section
        .querySelectorAll(
          ".about-workspace-frame img, .about-cta > img"
        )
        .forEach((image) => {
          gsap.fromTo(
            image,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: image,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, [scrollOverlay, standalone]);

  const sectionHref = (id) =>
    standalone ? `/#${id}` : `#${id}`;

  const sectionClick = (id) =>
    standalone ? undefined : onAnchorClick(id);

  return (
    <section
      className={`about-section${
        animate ? " about-section--animated" : ""
      }${scrollOverlay ? " about-section--scroll-overlay" : ""}`}
      ref={sectionRef}
      aria-label="About TechMisai"
    >
      <header
        className="about-banner about-scene-panel about-scene-panel--1"
        data-about-scene-panel
      >
        <div
          className="about-banner-art"
          data-about-image
          aria-hidden="true"
        >
          <img src={aboutBannerArtwork} alt="" />
        </div>

        <div className="wrap about-banner-content">
          <h1 data-about-reveal>About Us</h1>

          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <a
              href={sectionHref("home")}
              onClick={sectionClick("home")}
            >
              Home
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About Us</span>
          </nav>
        </div>
      </header>

      <div
        className="about-scene-panel about-scene-panel--2"
        data-about-scene-panel
      >
        <div className="wrap about-content">
          <div className="about-intro">
            <div className="about-workspace">
              <div className="about-workspace-frame">
                <div
                  className="about-workspace-media"
                  data-about-workspace-zoom
                >
                  <img
                    className="about-workspace-image"
                    data-about-image
                    src={aboutIntroArtwork}
                    alt="Laptop displaying a digital product design"
                  />
                </div>
              </div>

              <span
                className="about-workspace-accent"
                aria-hidden="true"
              />
            </div>

            <div
              className="about-intro-copy"
              data-about-reveal-group
            >
              <p className="about-kicker">About TechMisai</p>

              <h2>
                We Build Digital Experiences That Move Businesses{" "}
                <span className="about-gradient-text">Forward</span>
              </h2>

              <p>
                At TechMisai, we combine creativity, technology, and
                innovation to build digital solutions that help
                businesses grow. From modern web applications and
                mobile experiences to AI-powered automation and
                data-driven platforms, we turn ideas into practical
                digital products.
              </p>

              <p>
                Our focus is on creating solutions that are visually
                engaging, user-friendly, scalable, and designed around
                real business needs.
              </p>

              <a
                className="about-button"
                href={sectionHref("services")}
                onClick={sectionClick("services")}
              >
                Our Services
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="about-scene-panel about-scene-panel--3"
        data-about-scene-panel
      >
        <div className="wrap about-content">
          <div className="about-capabilities">
            <div
              className="about-skills"
              data-about-reveal-group
            >
              <p className="about-kicker">Our Skills</p>

              <h2>
                Turning Ideas Into Powerful{" "}
                <span className="about-gradient-text">
                  Solutions
                </span>
              </h2>

              <p className="about-skills-copy">
                We bring together design, development and technology
                to create solutions that deliver real value. Our team
                works with modern tools and best practices to build
                products that are fast, secure and scalable.
              </p>

              <ul
                className="about-skill-list"
                data-about-reveal-group
              >
                {SKILLS.map(({ label, value, Icon }) => (
                  <li className="about-skill" key={label}>
                    <span
                      className="about-skill-icon"
                      aria-hidden="true"
                    >
                      <Icon size={17} />
                    </span>

                    <div className="about-skill-main">
                      <div className="about-skill-heading">
                        <span>{label}</span>
                        <span>{value}%</span>
                      </div>

                      <div
                        className="about-skill-track"
                        role="meter"
                        aria-label={`${label} skill`}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={value}
                      >
                        <span style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="about-stat-grid"
              aria-label="TechMisai statistics"
            >
              {ABOUT_STATISTICS.map((stat, index) => {
                const Icon = STAT_ICONS[index];

                return (
                  <article
                    className={`about-stat about-stat--${index + 1}`}
                    data-about-stat
                    key={stat.label}
                  >
                    <span
                      className="about-stat-icon"
                      aria-hidden="true"
                    >
                      <Icon size={19} />
                    </span>

                    <p className="about-stat-value">
                      {stat.value || "—"}
                    </p>

                    <h3>{stat.label}</h3>

                    <p className="about-stat-description">
                      {stat.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        className="about-scene-panel about-scene-panel--4"
        data-about-scene-panel
      >
        <div className="wrap about-content">
          <aside className="about-cta">
            <img
              src={aboutCtaArtwork}
              alt=""
              aria-hidden="true"
              data-about-image
            />

            <div
              className="about-cta-content"
              data-about-reveal-group
            >
              <p className="about-cta-label">
                Let’s Work Together
              </p>

              <h2>
                Ready to Build
                <br />
                Something{" "}
                <span className="about-gradient-text">
                  Great?
                </span>
              </h2>

              <p>
                Let’s turn your ideas into meaningful digital
                experiences.
              </p>

              <a
                className="about-button"
                href={sectionHref("contact")}
                onClick={sectionClick("contact")}
              >
                Get in Touch
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}