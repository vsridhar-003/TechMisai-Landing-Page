# TechMisai — Pink + Blue redesign

React 18 + Vite + plain CSS. Animation: GSAP + ScrollTrigger. No other animation library.

## Run (VS Code terminal, inside this folder)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # serve the production build
```

## Structure

```
src/
  main.jsx                entry (renders <App/>)
  App.jsx                 section order + the shared reveal hook
  styles.css              whole theme, organised by numbered sections
  data/content.js         ALL copy, nav, products, clients, FAQ, placeholders
  lib/motion.js           GSAP/ScrollTrigger registration + scroll helpers
  hooks/useSectionMotion  one reveal system (data-rv, data-split, data-scrub, ...)
  components/
    Navbar  Hero  FiberCanvas  Intro  Solutions  Services
    Products  ProductArt  Clients  ClientCarousel  Work  Faq
    Company  Contact  Footer  SplitText  FibreArt
  assets/techmisai-logo-dark.png   logo recoloured for navy (original kept)
_original/                the pre-redesign main.jsx and styles.css, for reference
```

## Things to replace before launch

* `src/data/content.js` -> `work` : three PLACEHOLDER project tiles (not links).
* `src/data/content.js` -> `CONTACT_EMAIL` : `hello@techmisai.com` was already in the
  original code; it has not been verified.
* `src/data/content.js` -> `SOCIALS` : empty on purpose. Add real URLs and the footer shows them.
* Removed because they were invented: "trusted by" brand names, project/satisfaction
  statistics, the three client reviews, the retail case study and its fake dashboard.

## Lenis (optional, not installed)

Smooth scrolling was not added because the dependency could not be installed while this
was built. To try it later: `npm i lenis`, then in `lib/motion.js` create a Lenis instance,
call `lenis.on("scroll", ScrollTrigger.update)` and drive `lenis.raf` from `gsap.ticker`.
Remove `scroll-behavior: smooth` from `html` in `styles.css` when you do.

## Known leftovers

`src/components/SplashCursor.jsx`, `DepthCarousel.jsx/.css`, `ogl` in package.json and
`assets/bg-tc.png` / `techmisai-background.png` are no longer used. They are untouched so
nothing is lost; delete them when you are happy with the new design.
"# TechMisai-Landing-Page" 
"# tech" 
"# tech-0" 
