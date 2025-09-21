# CHINMOY KUMAR BISWAS — Portfolio

Professional, data-driven portfolio with a modular CSS/JS architecture, advanced animations, and
PWA support. Optimized for GitHub Pages and local development.

🔗 Live Demo: https://chinmoy-sh.github.io/Chinmoy-Kumar-Biswas.github.io/

Badges: HTML5 · CSS3 · JavaScript · PWA · A11y · Performance

—

## Overview

This repository hosts the production build of my portfolio. The site is structured around a single
`index.html` with modular styles (`assets/css`) and feature-focused scripts (`assets/js`). Content
is sourced from `data/portfolio-data.json` and rendered dynamically by `assets/js/content-manager.js`.

Highlights

- Modular CSS with design tokens, components, layout, and animations
- Data-driven content (JSON) for easy updates without editing HTML
- Smooth scrolling, section reveal animations, and particle background
- Light/dark theme with system detection and persistence
- PWA-ready with manifest and service worker

—

## Quick Start

Prerequisites

- Any modern browser
- Local HTTP server (JSON must be fetched over HTTP, not file://)

Setup

```powershell
# Clone
git clone https://github.com/Chinmoy-sh/Chinmoy-Kumar-Biswas.github.io.git
cd Chinmoy-Kumar-Biswas.github.io

# Serve (choose one)
python -m http.server 5500
# or
npx serve -l 5500 .
```

Open http://localhost:5500 and hard-refresh (Ctrl+F5) if you change scripts.

—

## Project Structure

```text
index.html
manifest.json
assets/
  css/
    variables.css
    base.css
    components.css
    animations.css
    layout.css
  js/
    main.js
    content-manager.js
    scroll-system.js
    particles.js
    theme-system.js
    mobile-navigation.js
    form-validation.js
    performance-seo.js
    accessibility.js
data/
  portfolio-data.json
assets/images/
  chinmoy.png
  pro3.jpg
```

—

## Features

- Theming: `assets/js/theme-system.js` manages light/dark with smooth transitions
- Smooth scroll + effects: `assets/js/scroll-system.js` (exposed as `window.smoothScrollManager`)
- Content management: `assets/js/content-manager.js` renders JSON into sections
- Animations: utilities and keyframes in `assets/css/animations.css`
- Particles: canvas background via `assets/js/particles.js`
- Forms: client-side validation in `assets/js/form-validation.js`
- Performance/SEO: metrics and meta updates in `assets/js/performance-seo.js`

—

## Data-Driven Content

All editable content lives in `data/portfolio-data.json`.

Key sections

- `personal`: name, title, description, social links
- `about`: intro and highlights
- `skills`: technical categories and soft skills
- `projects`: cards with thumbnails, tech, status, and links
- `experience`, `services`, `testimonials`, `contact`

Images and documents

- Use relative paths like `./assets/images/...`.
- This ensures local dev and GitHub Pages both work.

—

## Cards & Components

Skills

- Rendered as `.skill-card` with `.skill-progress` and `.skill-progress-bar`.
- Progress bars animate from 0 to the level when revealed.

Projects

- Rendered as `.project-card` with image, overlay actions, content, tags.
- Category filters use `.projects-filters` with `.filter-btn`.

Customizing

- Update data in `portfolio-data.json`; classes and layout are handled for you.
- Styles live in `assets/css/components.css` and `assets/css/layout.css`.

—

## Local Smoke Test

1. Start a server (PowerShell)

```powershell
python -m http.server 5500
# or
npx serve -l 5500 .
```

 Visit http://localhost:5500

- Check hero loads, particles animate, and theme toggle works
- Verify skills/projects populate and filters toggle visibility
- Confirm scroll reveals trigger and “Back to top” appears after scrolling

Note: Service worker registration runs only when `APP_CONFIG.environment === 'production'`.
For local tests, SW may be inactive, which is expected.

—

## Deployment (GitHub Pages)

- Ensure all asset paths in HTML/CSS/JS/JSON are relative (e.g., `./assets/...`).
- Push to `main`; Pages serves from the repository.
- If you use a project subpath, relative paths keep fetch and images working.

—

## Troubleshooting

- Blank content / console error about JSON: run via HTTP server (not `file://`).
- Assets 404 on GitHub Pages: ensure paths are `./assets/...` not `/assets/...`.
- Filters not working: verify project `category` values and classes align.
- Stale UI after edits: hard refresh (Ctrl+F5). If using a SW, clear site data.

—

## License & Credits

- Open source under MIT (if LICENSE present).
- Icons: Font Awesome. Fonts: Google Fonts. Images: project assets.

Contact: bangladeshchinmoy@gmail.com
Chinmoy-Kumar-Biswas.github.io/
│
├── 📄 index.html                    # Main HTML document
├── 📄 manifest.webmanifest          # PWA manifest
├── 📄 robots.txt                    # SEO crawler instructions
├── 📄 sitemap.xml                   # Site structure for SEO
├── 📄 sw.js                         # Service Worker
├── 📄 favicon.svg                   # Scalable favicon
├── 📄 critical.css                  # Above-the-fold styles
└── 📄 PERFORMANCE_REPORT.md         # Performance metrics
│
├── 🖼️ images/                        # Media assets
│   ├── chinmoy.png                  # Profile photo
│   └── pro3.jpg                     # Project images
│
├── 🎨 assets/                        # Organized assets
│   ├── css/                         # Modular stylesheets
│   │   ├── main.css                 # Entry point + utilities
│   │   ├── variables.css            # Design tokens
│   │   ├── base.css                 # Global styles
│   │   ├── layout.css               # Responsive layouts
│   │   ├── components.css           # UI components
│   │   └── animations.css           # Animation definitions
│   │
│   └── js/                          # JavaScript modules
│       ├── app.js                   # Application controller
│       │
│       ├── utils/                   # Utility functions
│       │   ├── utilities.js         # Core helpers
│       │   └── serviceWorker.js     # PWA management
│       │
│       ├── components/              # Feature modules
│       │   ├── navigation.js        # Navigation system
│       │   ├── modals.js           # Modal dialogs
│       │   ├── theme.js            # Theme management
│       │   ├── carousel.js         # Carousel widgets
│       │   ├── forms.js            # Form handling
│       │   └── threeJS.js          # 3D visualization
│       │
│       └── animations/              # Animation controllers
│           └── scrollAnimations.js   # Scroll-based effects
│
├── ⚙️ config/                        # Configuration
│   └── config.js                    # Centralized settings
│
└── 🗑️ Legacy Files (for reference)
    ├── style.css                    # Original monolithic CSS
    └── script.js                    # Original monolithic JS

```text

---

## Theming System

### Advanced Theme Management

The portfolio features a sophisticated theming system with:

- **System Integration**: Automatically detects user's OS preference
- **Persistence**: Remembers user choice across sessions
- **Smooth Transitions**: Animated theme switching
- **Browser Integration**: Updates browser UI theme color

### Theme Structure

```css
/* Light Theme */
:root {
    --bg-primary: #ffffff;
    --text-primary: #1f2937;
    --accent-primary: #3b82f6;
}

/* Dark Theme */
[data-theme='dark'] {
    --bg-primary: #0f172a;
    --text-primary: #f8fafc;
    --accent-primary: #60a5fa;
}
```

---

## 3D Showcase

### Three.js Integration

Advanced 3D skills visualization featuring:

- **Interactive Skills Sphere**: Drag to rotate, explore technologies
- **WebGL Detection**: Automatic fallback for unsupported devices
- **Performance Optimized**: Lazy loading and efficient rendering
- **Accessibility Aware**: Respects reduced motion preferences

### Skills Configuration

Edit skills in `config/config.js`:

```javascript
skills: {
    frontend: ['React', 'Vue.js', 'Angular'],
    backend: ['Node.js', 'Python', 'PHP'],
    database: ['MongoDB', 'PostgreSQL', 'Redis']
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

Comprehensive accessibility features include:

- **Semantic HTML**: Proper heading hierarchy and landmark regions
- **ARIA Support**: Screen reader optimized with descriptive labels
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: Meets or exceeds WCAG contrast requirements
- **Motion Preferences**: Respects `prefers-reduced-motion` setting

---

## Performance

### Optimization Techniques

- **Code Splitting**: Modular architecture enables tree-shaking
- **Lazy Loading**: Components initialize when needed
- **Image Optimization**: WebP format with fallbacks
- **Critical CSS**: Above-the-fold styling prioritized
- **Service Worker**: Offline caching and background sync

### Performance Metrics

Target performance scores:

- **Lighthouse Performance**: 95+
- **Accessibility Score**: 100
- **Best Practices**: 95+
- **SEO Score**: 100

---

## SEO & PWA

### Search Engine Optimization

Comprehensive SEO implementation:

- **Rich Metadata**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD schema for better search understanding
- **Sitemap**: XML sitemap for search engine crawling
- **Robots.txt**: Proper crawler instructions
- **Performance**: Fast loading times improve search rankings

### Progressive Web App Features

- **Web Manifest**: Installable app experience
- **Service Worker**: Offline functionality and caching
- **App Icons**: Multiple icon sizes for different devices
- **Splash Screens**: Custom loading screens
- **Background Sync**: Updates when connection restored

---

## Testing

### Testing Strategy

- **Manual Testing**: Cross-browser compatibility verification
- **Accessibility Testing**: WAVE and axe-core validation
- **Performance Testing**: Lighthouse audits and Core Web Vitals
- **Responsive Testing**: Multiple device and screen size validation

### Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile Browsers**: iOS Safari 13+, Chrome Mobile 80+
- **Graceful Degradation**: Progressive enhancement for older browsers

---

## Production Deployment

### Essential Files

The project includes all necessary production files for professional deployment:

- **LICENSE**: MIT License for open-source compliance
- **CHANGELOG.md**: Version history and feature documentation
- **SECURITY.md**: Security policy and vulnerability reporting
- **CONTRIBUTING.md**: Guidelines for contributors
- **.gitignore**: Comprehensive file exclusion rules
- **package.json**: Dependencies and build scripts

### Configuration Files

Professional development environment with industry-standard tools:

- **eslint.config.js**: ES2024 code quality standards
- **.prettierrc**: Code formatting configuration
- **.stylelintrc**: CSS linting rules
- **.htmlhintrc**: HTML validation settings
- **.markdownlint.json**: Documentation formatting

### Deployment Options

#### GitHub Pages (Recommended)

```powershell
# Push to main branch
git add .
git commit -m "Deploy portfolio"
git push origin main
```

#### Static Hosting

Upload the entire directory to any static hosting service:

- Netlify
- Vercel
- CloudFlare Pages
- AWS S3

#### Custom Domain Setup

1. Add CNAME file with your domain
2. Configure DNS records
3. Enable HTTPS in hosting settings

---

### Common Issues

#### Theme Not Switching

```javascript
// Clear theme storage and reload
localStorage.removeItem('theme');
location.reload();
```

#### 3D Visualization Not Loading

- Check WebGL support: `about:gpu` in Chrome
- Ensure Three.js CDN is accessible
- Verify no console errors blocking execution

#### Module Loading Errors

- Serve from HTTP server (not file://)
- Check browser supports ES6 modules
- Verify all import paths are correct

---

## Contributing

### Contributing Guidelines

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Follow Code Standards**: ESLint and Prettier configuration
4. **Test Changes**: Verify functionality across browsers
5. **Update Documentation**: Include relevant README updates
6. **Submit Pull Request**: Describe changes and testing performed

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Credits & Acknowledgments

- **Design System**: Custom CSS architecture with modern best practices
- **Icons**: Font Awesome and custom SVG icons
- **3D Graphics**: Three.js for WebGL rendering
- **Fonts**: Google Fonts (Inter, Poppins)
- **Images**: Optimized with modern formats and responsive loading
- **Performance**: Lighthouse and Core Web Vitals optimization

**Special Thanks**: To the open-source community for the tools and libraries that make projects  
like this possible.

---

## Contact & Support

- **Email**: [bangladeshchinmoy@gmail.com](mailto:bangladeshchinmoy@gmail.com)
- **Portfolio**: [Live Demo](https://chinmoy-sh.github.io/Chinmoy-Kumar-Biswas.github.io/)
- **Issues**: [GitHub Issues](https://github.com/Chinmoy-sh/Chinmoy-Kumar-Biswas.github.io/issues)

Built with ❤️ by **Chinmoy Kumar Biswas**
