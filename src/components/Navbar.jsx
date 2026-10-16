import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import logo from "../assets/techmisai-logo.png";
import { navItems, WHATSAPP_URL } from "../data/content.js";
import { goTo, onAnchorClick } from "../lib/motion.js";

const DESKTOP = "(min-width: 961px)";

/* ---------- Desktop dropdown ----------
   - opens on hover (mouse only), click/tap, or ArrowDown
   - 160ms close delay + an invisible bridge so moving the pointer from the
     trigger into the panel never closes it
   - Escape closes and returns focus; focus leaving the group closes it */
function DesktopDropdown({ item, open, setOpen }) {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const timer = useRef(0);
  const lastPointer = useRef("");
  const menuId = `dd-${item.target}`;

  const cancel = () => window.clearTimeout(timer.current);
  const openNow = () => {
    cancel();
    setOpen(item.label);
  };
  const closeSoon = () => {
    cancel();
    timer.current = window.setTimeout(() => setOpen(null), 160);
  };

  useEffect(() => cancel, []);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(null);
      btnRef.current?.focus();
    }
    if (event.key === "ArrowDown" && event.target === btnRef.current) {
      event.preventDefault();
      setOpen(item.label);
      window.requestAnimationFrame(() =>
        wrapRef.current?.querySelector(".dd-item")?.focus()
      );
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`dd${open ? " is-open" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(null);
      }}
      onKeyDown={onKeyDown}
    >
      <button
        ref={btnRef}
        type="button"
        className="nav-link dd-trigger"
        aria-expanded={open}
        aria-controls={menuId}
        onPointerDown={(e) => {
          lastPointer.current = e.pointerType;
        }}
        onClick={() => {
          // A mouse click on a hover-opened menu keeps it open;
          // keyboard and touch toggle it.
          if (open && lastPointer.current === "mouse") {
            lastPointer.current = "";
            return;
          }
          setOpen(open ? null : item.label);
        }}
      >
        <span>{item.label}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </button>

      <div className="dd-menu" id={menuId}>
        <div className="dd-panel">
          <a
            className="dd-all"
            href={`#${item.target}`}
            onClick={onAnchorClick(item.target, () => setOpen(null))}
          >
            View all {item.label.toLowerCase()} <ArrowRight size={14} aria-hidden="true" />
          </a>
          {item.items.map((entry) => (
            <a
              key={entry.title}
              className="dd-item"
              href={`#${item.target}`}
              onClick={onAnchorClick(item.target, () => setOpen(null))}
            >
              <strong>{entry.title}</strong>
              <span>{entry.label || entry.text}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dd, setDd] = useState(null); // desktop dropdown
  const [acc, setAcc] = useState(null); // mobile accordion

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setAcc(null);
  }, []);

  /* Header background after scrolling (state only changes when it flips). */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Leaving mobile layout closes the panel. */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = (e) => {
      if (e.matches) closeMenu();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [closeMenu]);

  /* Escape and outside interaction close the compact mobile menu. */
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && closeMenu();
    const onPointerDown = (event) => {
      if (navRef.current?.contains(event.target) || mobilePanelRef.current?.contains(event.target)) return;
      closeMenu();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen, closeMenu]);

  const logoClick = (event) => {
    event.preventDefault();
    closeMenu();
    goTo("home");
  };

  return (
    <>
      <header ref={navRef} className={`nav${scrolled ? " nav--solid" : ""}${menuOpen ? " nav--open" : ""}`}>
        <div className="nav-inner">
          <a className="nav-brand" href="#home" onClick={logoClick} aria-label="TechMisai — home">
            <img src={logo} alt="TechMisai" width="738" height="246" />
          </a>

          <nav className="nav-desktop" aria-label="Main navigation">
            {navItems.map((item) =>
              item.items ? (
                <DesktopDropdown
                  key={item.label}
                  item={item}
                  open={dd === item.label}
                  setOpen={setDd}
                />
              ) : (
                <a
                  key={item.label}
                  className="nav-link"
                  href={`#${item.target}`}
                  onClick={onAnchorClick(item.target)}
                >
                  <span>{item.label}</span>
                </a>
              )
            )}
          </nav>

          <div className="nav-actions">
            <a
              className="btn btn--primary btn--sm"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              <span>Let’s Talk</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="nav-burger"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile panel lives OUTSIDE the header on purpose: a backdrop-filter on
          the header would otherwise become the containing block of this
          fixed panel and clip it. */}
      <div
        ref={mobilePanelRef}
        id="mobile-navigation"
        className={`mpanel${menuOpen ? " is-open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className="mpanel-inner" aria-label="Mobile navigation">
          {navItems.map((item) => {
            if (!item.items) {
              return (
                <a
                  key={item.label}
                  className="mlink"
                  href={`#${item.target}`}
                  onClick={onAnchorClick(item.target, closeMenu)}
                >
                  {item.label}
                </a>
              );
            }
            const isOpen = acc === item.label;
            const id = `m-${item.target}`;
            return (
              <div key={item.label} className={`macc${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="mlink macc-trigger"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setAcc(isOpen ? null : item.label)}
                >
                  <span>{item.label}</span>
                  <ChevronDown size={20} aria-hidden="true" />
                </button>
                <div className="macc-body" id={id}>
                  <div>
                    {item.items.map((entry) => (
                      <a
                        key={entry.title}
                        className="msub"
                        href={`#${item.target}`}
                        onClick={onAnchorClick(item.target, closeMenu)}
                      >
                        {entry.title}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          <a
            className="btn btn--primary mpanel-cta"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            <span>Let’s Talk</span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </>
  );
}
