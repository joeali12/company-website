# VOLT IQ website

Single-page company website for VOLT IQ — a full-service software company building ERP systems, SaaS products, and websites.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Three.js (decorative Hero horizon scene, lazy-loaded)

## Sections

Home (Hero) · About · Services · Projects (EduCore) · Team · Contact · Footer

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Notes

- Contact form is a prototype until a backend destination is configured.
- Team LinkedIn links live in `src/data/site.ts`.
- Hero WebGL respects `prefers-reduced-motion` and falls back to a static CSS scene.
