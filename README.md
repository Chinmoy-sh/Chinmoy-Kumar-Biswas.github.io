# Portfolio — CHINMOY KUMAR BISWAS

A modern, responsive portfolio site. Content (“self data”) is preserved; this update focuses on professional UI/UX, performance, and accessibility.

## Highlights

- Refined typography with Inter, improved spacing and micro-interactions
- Light/Dark theme toggle (persisted)
- Smooth scroll, scroll-to-top, and scrollspy
- Project modal, filters, testimonials carousel
- 3D skills showcase (Three.js), lazy-initialized and reduced-motion-aware
- Accessibility: skip link, landmarks, alt text, focus styles
- SEO: meta tags, Open Graph/Twitter, favicon, web manifest, robots.txt

## Structure

- `index.html` — Page markup and sections
- `style.css` — Design system, animations, cards, modals
- `script.js` — Interactions, modals, filters, carousel, 3D scene
- `images/` — Your images (unchanged)
- `favicon.svg`, `manifest.webmanifest`, `robots.txt` — PWA/SEO assets

## Local Preview

Use an HTTP server for correct asset loading.

Windows PowerShell:

```powershell
# From repo root
python -m http.server 5500
# Then open http://localhost:5500
```

Or with Node:

```powershell
npx serve -l 5500 .
```

## Customize

- Replace external article/project images/links with your own.
- Update contact email in `script.js` if needed.
- Add more projects/testimonials by following existing patterns.

## Notes

- LLM project brief uses a local template by default (works offline). Wire a real API if desired.
- Three.js scene is lazy-loaded and disabled when prefers-reduced-motion is set.
