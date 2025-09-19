# 💼✨ CHINMOY KUMAR BISWAS — Portfolio

Beautiful, fast, and accessible personal website showcasing projects, experience, and skills — with light/dark theming and a 3D skills showcase.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=333)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![A11y](https://img.shields.io/badge/Accessible-AAA-34D399)
![Status](https://img.shields.io/badge/Status-Active-22c55e)

<!-- markdownlint-disable-next-line MD033 -->
<img src="images/chinmoy.png" alt="Chinmoy portrait" width="120" style="border-radius:50%" />

[Live Demo](#live-demo) · [Features](#features) · [Quick Start](#quick-start) · [Customize](#customize) · [Sections](#sections)

---

## Features

- 🎨 Polished design system with Inter font, spacing, gradients, and micro‑interactions
- 🌓 Light/Dark theme toggle with persistence and theme‑color sync for browsers
- 🧭 Smooth scroll, scroll‑to‑top, scrollspy highlights, and skip‑to‑content link
- 🧩 Projects: filter by tech + modal with rich details and skeleton loaders
- 💬 Testimonials carousel with autoplay and dots navigation
- 🧠 Notes & Blog templates for quick content additions
- 📊 3D Skills Showcase (Three.js), lazy‑initialized and reduced‑motion aware with graceful fallback
- ♿ Accessibility: landmarks, ARIA‑friendly patterns, visible focus, alt text
- 🔍 SEO: rich meta, Open Graph/Twitter cards, favicon set, web manifest, robots.txt

---

## Table of Contents

1. [Live Demo](#live-demo)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Customize](#customize)
5. [Sections](#sections)
6. [Theming](#theming)
7. [3D Showcase](#3d-showcase)
8. [SEO & PWA](#seo--pwa)
9. [Troubleshooting](#troubleshooting)
10. [Credits](#credits)

---

## Live Demo

If published with GitHub Pages, enable in `Settings → Pages` for the `main` branch (root). Your site will be available at your Pages URL. Alternatively preview locally as below.

---

## Quick Start

Use a local HTTP server for correct asset loading.

Windows PowerShell:

```powershell
# From the repository root
python -m http.server 5500
# Then open http://localhost:5500
```

Or with Node:

```powershell
npx serve -l 5500 .
```

---

## Project Structure

```text
.
├─ index.html        # Markup and sections
├─ style.css         # Design system, animations, components
├─ script.js         # Interactions, modals, filters, carousel, 3D scene
├─ images/
│  ├─ chinmoy.png
│  └─ pro3.jpg
├─ favicon.svg       # Favicon
├─ manifest.webmanifest
├─ robots.txt
└─ README.md
```

---

## Customize

- 👤 Profile & Socials: update names/links in `index.html` (navbar, footer, contact).
- ✉️ Contact: change the email used by the form in `script.js` (`mailto:` link).
- 🖼️ Images: replace external placeholders with your own assets; keep alt text meaningful.
- 🧪 Testimonials: add/edit cards in the Testimonials section.
- 🧩 Projects: duplicate a card in `index.html` and add an entry in `projectsData` within `script.js`.
- 📝 Blog & Notes: swap sample content with your articles/snippets.
- 🧭 Navigation: adjust anchors in the navbar to match your sections.

Pro tip: keep filenames and paths consistent; use optimized images (WebP/PNG) for speed.

---

## Sections

- Hero • About • Services • Skills • Experience • Education • Certifications
- Blog • Notes • Projects • 3D Skills Showcase • Appearance (Theme) • Testimonials • Contact • Footer

Each section has semantic structure and animation hooks (`.animate-on-scroll`).

---

## Theming

- Theme state persists via `localStorage` and updates a `meta[name="theme-color"]` fallback for better browser UI coloring.
- Light/Dark can be toggled from the header, mobile menu, and Appearance section.
- Colors and tokens live in `style.css` as CSS variables (`--bg-primary`, `--text-primary`, etc.).

---

## 3D Showcase

- Built with Three.js and lazy‑initialized when the canvas enters the viewport.
- Honors `prefers-reduced-motion` and shows a graceful fallback if WebGL/Three.js is unavailable.
- Drag to rotate the skills group; subtle auto‑rotation when idle.

Troubleshooting: see [Troubleshooting](#troubleshooting).

---

## SEO & PWA

- Rich meta: description, Open Graph, Twitter Card
- Multiple theme‑color strategies for cross‑browser consistency (incl. Windows tiles)
- Favicon, Apple touch icon, `manifest.webmanifest`, `robots.txt`

Update the `og:url` and social image if deploying under a custom domain.

---

## Troubleshooting

- 🌓 Theme doesn’t change: hard refresh and clear `localStorage` for key `theme`.
- 🧩 Cards don’t appear: check that JavaScript is enabled; our no‑JS fallback reveals content, but animations need JS.
- 🖥️ 3D is black or missing: ensure WebGL is enabled; if Three.js fails to load, a helpful fallback overlay is displayed and other features continue to work.
- 🧭 Scroll animations not triggering: some browsers block intersection observers behind privacy settings; content is force‑revealed shortly after load as a safety.
- 📨 Email client didn’t open: some environments block `mailto:`. Copy the text and email manually.

---

## Credits

- Design system: custom CSS + Tailwind utility classes
- Icons: Font Awesome
- 3D: Three.js
- Fonts: Google Fonts — Inter, Poppins

Made with ❤️ to highlight real skills and projects.
