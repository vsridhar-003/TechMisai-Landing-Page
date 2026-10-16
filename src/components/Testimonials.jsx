import React from "react";
import { Quote } from "lucide-react";
import { testimonials } from "../data/testimonials.js";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <section className="tm-testimonials" aria-labelledby="tm-testimonials-title">
      <div className="wrap">
        <div className="tm-testimonials-heading">
          <p className="tm-testimonials-eyebrow" data-rv>
            Client testimonials
          </p>
          <h2 id="tm-testimonials-title" className="tm-testimonials-title" data-rv>
            Built on trust. <span>Backed by experience.</span>
          </h2>
          <p className="tm-testimonials-intro" data-rv>
            The people behind our partnerships matter. Discover what our clients have to say about working with
            TechMisai.
          </p>
        </div>

        <div className="tm-testimonials-grid" data-stagger>
          {testimonials.map((testimonial) => (
            <article
              className={`tm-testimonial-card tm-testimonial-card--${testimonial.accent}`}
              key={testimonial.id}
              data-stagger-item
            >
              <div className="tm-testimonial-quote-icon" aria-hidden="true">
                <Quote size={22} strokeWidth={2} />
              </div>
              <p className="tm-testimonial-quote">“{testimonial.quote}”</p>
              <div className="tm-testimonial-author">
                <div className="tm-testimonial-author-copy">
                  <strong className="tm-testimonial-company">{testimonial.company}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
