
import React from "react";
import logo from "../assets/techmisai-logo.png";
import {
  CONTACT_EMAIL,
  SOCIALS,
  navItems,
  products,
  services,
} from "../data/content.js";
import { goTo, onAnchorClick } from "../lib/motion.js";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <a
            href="#home"
            aria-label="TechMisai — back to top"
            onClick={(e) => {
              e.preventDefault();
              goTo("home");
            }}
          >
            <img
              src={logo}
              alt="TechMisai"
              width="738"
              height="246"
              loading="lazy"
            />
          </a>

          <p>
            We create intelligent digital solutions that help businesses
            innovate, grow and make a lasting impact.
          </p>

          {SOCIALS.filter((s) => s.href).length > 0 && (
            <ul className="socials">
              {SOCIALS.filter((s) => s.href).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Explore */}
        <nav className="footer-col" aria-label="Footer navigation">
          <h4>Explore</h4>

          {navItems.map((n) => (
            <a
              key={n.label}
              href={`#${n.target}`}
              onClick={onAnchorClick(n.target)}
            >
              {n.label}
            </a>
          ))}
        </nav>

        {/* Services */}
        <div className="footer-col">
          <h4>Services</h4>

          {services.map((s) => (
            <a
              key={s.title}
              href="#services"
              onClick={onAnchorClick("services")}
            >
              {s.title}
            </a>
          ))}
        </div>

        {/* Products and Contact */}
        <div className="footer-col">
          <h4>Products</h4>

          {products.map((p) => (
            <a
              key={p.id}
              href="#products"
              onClick={onAnchorClick("products")}
            >
              {p.title}
            </a>
          ))}

          <h4 className="footer-h-gap">Contact</h4>

          {/* Email */}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>

          {/* Phone number */}
          <a
            href="tel:+919952141055"
            aria-label="Call TechMisai"
          >
            +91 99521 41055
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="wrap footer-bottom">
        <span>
          © {year} TechMisai. All rights reserved.
        </span>

        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goTo("home");
          }}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
