import React from "react";
import ClientCarousel from "./ClientCarousel.jsx";
import SplitText from "./SplitText.jsx";
import { clients } from "../data/content.js";

export default function Clients() {
  return (
    <section id="clients" className="section clients" aria-labelledby="clients-title">
      <div className="wrap">
        <div className="sec-head sec-head--split">
          <div>
            <p className="eyebrow" data-rv>
              Our clients
            </p>
            <h2 id="clients-title" className="display display--md" data-split>
              <SplitText text={"PARTNERSHIPS BUILT\nFOR ~LONG-TERM ~IMPACT."} />
            </h2>
          </div>
          <p className="lede" data-rv>
            We work closely with businesses to turn ideas, challenges and opportunities into meaningful digital
            products.
          </p>
        </div>
      </div>

      <ClientCarousel items={clients} />
    </section>
  );
}
