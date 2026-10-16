import React, { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "../data/content.js";
import SplitText from "./SplitText.jsx";

const pad = (n) => String(n).padStart(2, "0");

/* Height animates with grid-template-rows (0fr → 1fr): no JS measuring,
   no clipped text, and no layout jump on neighbouring items. */
export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="section faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-head">
          <p className="eyebrow" data-rv>
            FAQ
          </p>
          <h2 id="faq-title" className="display display--md" data-split>
            <SplitText text={"QUESTIONS?\n~WE’VE GOT\n~ANSWERS."} />
          </h2>
          <p className="lede" data-rv>
            Everything you need to know about working with TechMisai and building your next digital product.
          </p>
        </div>

        <div className="faq-list" data-stagger>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq-item${isOpen ? " is-open" : ""}`} key={f.question} data-stagger-item>
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <small>{pad(i + 1)}</small>
                    <span>{f.question}</span>
                    <i className="faq-icon" aria-hidden="true">
                      <Plus size={18} />
                    </i>
                  </button>
                </h3>
                <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div>
                    <p>{f.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
