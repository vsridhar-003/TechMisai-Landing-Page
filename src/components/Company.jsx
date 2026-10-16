import React from "react";
import { pillars } from "../data/content.js";
import SplitText from "./SplitText.jsx";
import companyVisual from "../assets/company-visual-1.png";

export default function Company() {
  return (
    <section id="company" className="section company" aria-labelledby="company-title">
      <div className="wrap company-grid">
        <div className="company-visual" data-clip>
          <div className="fill" data-clip-inner>
            <div className="fill" data-parallax="6">
              <img className="company-visual-image" src={companyVisual} alt="TechMisai company vision: good ideas deserve great technology" />
            </div>
          </div>
        </div>

        <div className="company-copy">
          <p className="eyebrow" data-rv>
            Our company
          </p>
          <h2 id="company-title" className="display display--md" data-split>
            <SplitText text={"GOOD IDEAS\nDESERVE ~GREAT\n~TECHNOLOGY."} />
          </h2>
          <p className="lede" data-rv>
            We create intelligent digital solutions that help businesses innovate, grow and make a lasting impact.
          </p>

          <ul className="pillars" data-stagger>
            {pillars.map((p) => (
              <li key={p.title} data-stagger-item>
                <strong>{p.title}</strong>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
