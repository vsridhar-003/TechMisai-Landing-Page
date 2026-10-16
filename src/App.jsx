import React, { useRef } from "react";
import useSectionMotion from "./hooks/useSectionMotion.js";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AboutSection from "./components/AboutSection.jsx";
import Intro from "./components/Intro.jsx";
import Services from "./components/Services.jsx";
import Products from "./components/Products.jsx";
import Clients from "./components/Clients.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Faq from "./components/Faq.jsx";
import Company from "./components/Company.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";


function HomePage() {
  const siteRef = useRef(null);
  useSectionMotion(siteRef);

  return (
    <div className="site" ref={siteRef}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        
        <Intro />
        <AboutSection scrollOverlay />
        <Services />
        <Products />
        <Clients />
        <Testimonials />
        <Faq />
        <Company />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function AboutPage() {
  return (
    <div className="site about-page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <AboutSection animate standalone />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  return path === "/about" ? <AboutPage /> : <HomePage />;
}
