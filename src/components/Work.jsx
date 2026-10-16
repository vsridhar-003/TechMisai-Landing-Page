import React from "react";
import { work } from "../data/content.js";
import FibreArt from "./FibreArt.jsx";
import SplitText from "./SplitText.jsx";

const ACCENTS = ["blue", "pink", "mix"];

/* PLACEHOLDER SHOWCASE — real project data did not exist in the project.
   Edit src/data/content.js. Placeholder tiles are deliberately NOT links,
   so nothing looks clickable that leads nowhere. */
export default function Work() {
  return (
    <section id="work" className="section work" aria-labelledby="work-title">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <p className="eyebrow" data-rv>
              Selected work
            </p>
            <h2 id="work-title" className="display display--md" data-split>
              <SplitText text={"IDEAS WE’VE\nTURNED INTO ~PRODUCTS."} />
            </h2>
          </div>
          <p className="lede" data-rv>
            Selected projects are being prepared. The tiles below are clearly marked placeholders.
          </p>
        </div>

        <div className="work-grid">
          {work.map((w, i) => {
            const Tag = w.href ? "a" : "div";
            const props = w.href ? { href: w.href } : {};
            return (
              <Tag key={i} className={`work-tile work-tile--${i + 1}`} data-rv data-rv-delay={i * 0.08} {...props}>
                <div className="work-media">
                  <div className="fill" data-parallax="7">
                    <FibreArt seed={40 + i * 5} accent={ACCENTS[i]} />
                  </div>
                  {w.placeholder && <span className="badge">Placeholder</span>}
                </div>
                <div className="work-meta">
                  <span className="work-industry">{w.industry}</span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                  <span className="work-soon">{w.href ? "View project" : "Case study coming soon"}</span>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
