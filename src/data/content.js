/* =========================================================
   TECHMISAI — SITE CONTENT
   Everything the sections render lives here so copy can be
   edited without touching components.

   Items marked PLACEHOLDER are NOT real content. Replace them
   before launch.
========================================================= */

import rmAuditsLogo from "../assets/clients/rm-audits.png";
import daasyeLogo from "../assets/clients/daasye.png";
import superStarExportsLogo from "../assets/clients/super-star-exports.png";
import saravanasHotelLogo from "../assets/clients/saravanas-hotel.png";
import sriSvCateringLogo from "../assets/clients/sri-sv-catering.png";
import kaniMinesLogo from "../assets/clients/kani-mines.png";
import elevenHolidaysLogo from "../assets/clients/eleven-holidays.png.jpeg";
import guruConstructionsLogo from "../assets/clients/guru-constructions.jpeg";

/* ---------- Contact ----------
   hello@techmisai.com was already hard-coded in the original
   project. It has NOT been verified — confirm it is correct.
   Add real social URLs below; the footer only renders entries
   that have an href. */
export const CONTACT_EMAIL = "info@techmisai.com";
export const WHATSAPP_URL =
  "https://api.whatsapp.com/send/?phone=919952141055&text=Hi+TechMisai%2C+I%27d+like+to+discuss+a+project.&type=phone_number&app_absent=0";
export const SOCIALS = [
  // { label: "LinkedIn", href: "https://..." },
];

/* ---------- Services ---------- */
export const services = [
  {
    title: "AI & Intelligent Automation",
    text: "Intelligent AI systems and automated workflows that streamline operations and address real business needs.",
  },
  {
    title: "Digital Product Engineering",
    text: "Scalable digital products built with modern technology.",
  },
  {
    title: "Web Design & Development",
    text: "Modern, responsive websites and high-performance web apps designed to perform.",
  },
  {
    title: "Mobile Application Development",
    text: "Native and cross-platform mobile experiences.",
  },
  {
    title: "Cloud Solutions",
    text: "Secure, scalable and flexible cloud infrastructure.",
  },
  {
    title: "Data & Analytics",
    text: "Turn business data into clear, actionable insights.",
  },
  {
    title: "UI/UX Design",
    text: "User-centered designs that inspire and engage.",
  },
];

export const ABOUT_STATISTICS = [
  {
    value: "",
    label: "Projects Delivered",
    description: "Add a verified project total before publishing.",
  },
  {
    value: "",
    label: "Happy Clients",
    description: "Add an approved client count before publishing.",
  },
  {
    value: "",
    label: "Internships Completed",
    description: "Add a verified internship total before publishing.",
  },
  {
    value: "",
    label: "State Level Achievement",
    description: "Add a verified award or achievement before publishing.",
  },
];

export const products = [
  {
    id: "ai",
    title: "Annamithra",
    label: "Food & Restaurant Management",
    text: "A smart food and restaurant management platform designed to streamline daily operations, manage orders, coordinate workflows, and improve overall restaurant efficiency.",
  },
  {
    id: "platform",
    title: "Temi",
    label: "Logistics Management System",
    text: "Manage Logistics operations efficiently with shipment tracking, delivery assignments, warehouse management, and real-time delivery status updates in one centralized platform.",
  },
  {
    id: "analytics",
    title: "Kirana",
    label: "Retail management system",
    text: "A smart retail management platform designed to transform complex business data into clear insights, manage inventory, track daily sales, and improve overall shop efficiency through intelligent dashboards and real-time analytics.",
  },
  {
    id: "studio",
    title: "Misai Studio",
    label: "Automation",
    text: "Build, connect and automate digital workflows from one flexible and scalable workspace.",
  },
];

/* Each nav entry: label + section id (+ dropdown items). */
export const navItems = [
  { label: "Home", target: "home" },
  { label: "Services", target: "services", items: services },
  { label: "Products", target: "products", items: products },
  { label: "Clients", target: "clients" },
  { label: "FAQ", target: "faq" },
  { label: "Company", target: "company" },
  { label: "Contact Us", target: "contact" },
];

/* ---------- Clients (existing data and logos, unchanged) ---------- */
export const clients = [
  {
    title: "RMV Audits",
    type: "Audit • Compliance • Advisory",
    logo: rmAuditsLogo,
  },
  { title: "Super Star Exports", type: "Global Trade • Exports", logo: superStarExportsLogo },
  { title: "Saravanas Hotel", type: "Restaurant", logo: saravanasHotelLogo },
  { title: "Sri SV Catering", type: "Catering", logo: sriSvCateringLogo },
  { title: "Kani Mines", type: "Mining", logo: kaniMinesLogo },
  { title: "Ghuru Constructions", type: "Construction", logo: guruConstructionsLogo },
  { title: "Eleven Holidays", type: "Travel • Holidays", logo: elevenHolidaysLogo },
  { title: "DaaSye", type: "FMCG • Distribution", logo: daasyeLogo },
];

/* ---------- Selected work — PLACEHOLDERS ----------
   No real project data existed in the project. Replace these
   three entries with real projects (set placeholder: false and
   add an href) when ready. */
export const work = [
  {
    placeholder: true,
    title: "Project title",
    industry: "Industry",
    text: "Placeholder — add a short, factual description of a real TechMisai project here.",
  },
  {
    placeholder: true,
    title: "Project title",
    industry: "Industry",
    text: "Placeholder — add a short, factual description of a real TechMisai project here.",
  },
  {
    placeholder: true,
    title: "Project title",
    industry: "Industry",
    text: "Placeholder — add a short, factual description of a real TechMisai project here.",
  },
];

/* ---------- Company ---------- */
export const pillars = [
  { title: "Strategy", text: "We start with your business, your users and your goals." },
  { title: "Technology", text: "Modern engineering that stays scalable as you grow." },
  { title: "Creativity", text: "Intuitive, beautiful experiences designed for modern users." },
];

/* ---------- FAQ (existing content, unchanged) ---------- */
export const faqs = [
  {
    question: "What does TechMisai help businesses with?",
    answer:
      "TechMisai helps businesses build modern digital products, websites, software platforms, AI-powered solutions, and scalable technology experiences.",
  },
  {
    question: "Can TechMisai build a custom software solution?",
    answer:
      "Yes. We create custom digital solutions based on your business requirements, workflows, users, and long-term goals.",
  },
  {
    question: "Do you provide UI/UX design services?",
    answer:
      "Yes. We design clean, intuitive, and responsive user experiences with a strong focus on usability, visual consistency, and business goals.",
  },
  {
    question: "Can you improve an existing website or product?",
    answer:
      "Absolutely. We can redesign, optimize, modernize, and improve existing websites and digital products to make them faster, cleaner, more responsive, and easier to use.",
  },
  {
    question: "Do you work with startups and growing businesses?",
    answer:
      "Yes. Our solutions can be adapted for startups, growing businesses, and established organizations depending on their technology and product needs.",
  },
  {
    question: "How can I get started with TechMisai?",
    answer:
      "Simply get in touch with our team and share your idea, requirement, or business challenge. We can then discuss the right solution for your project.",
  },
];
