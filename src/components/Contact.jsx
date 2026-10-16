import React from "react";
import { ArrowUpRight } from "lucide-react";
import { WHATSAPP_URL } from "../data/content.js";
import SplitText from "./SplitText.jsx";

export default function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="contact-bg" aria-hidden="true">
        <i className="c-glow c-glow--blue" />
        <i className="c-glow c-glow--pink" />
      </div>
      <div className="wrap contact-inner">
        <p className="eyebrow" data-rv>
          Contact
        </p>
        <h2 id="contact-title" className="display display--xl" data-split>
          <SplitText text={"LET’S BUILD\n~WHAT’S ~NEXT."} />
        </h2>
        <p className="lede lede--lg" data-rv>
          Have an idea, a challenge, or a product to build? Let’s create something meaningful together.
        </p>
        <a className="btn btn--primary btn--lg contact-cta" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-rv>
          <span>Start a conversation</span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
