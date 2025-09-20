# CHINMOY KUMAR BISWAS — Portfolio

Production-ready modular portfolio showcasing modern web development practices with
enterprise-level architecture, accessibility, and performance optimization.

🔗 **Live Demo**: [chinmoy-sh.github.io/Chinmoy-Kumar-Biswas.github.io](https://chinmoy-sh.github.io/Chinmoy-Kumar-Biswas.github.io/)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=333)
![ES6 Modules](https://img.shields.io/badge/ES6_Modules-4FC08D?logo=javascript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?logo=pwa&logoColor=white)
![Accessibility](https://img.shields.io/badge/A11y-WCAG_2.1-34D399?logo=accessibility&logoColor=white)
![Performance](https://img.shields.io/badge/Performance-95+-00C853?logo=lighthouse&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-22c55e?logo=github-actions&logoColor=white)

![Portfolio Preview](images/chinmoy.png)

[🚀 Quick Start](#quick-start) · [🏗️ Architecture](#architecture) · [✨ Features](#features) ·  
[🎛️ Configuration](#configuration) · [🛠️ Development](#development)

---

## Overview

This portfolio represents a **complete architectural transformation** from monolithic to modular
design, implementing enterprise-grade patterns and modern web standards. Built with performance,
maintainability, and accessibility as core principles.

### Key Highlights

- 🏗️ **Modular Architecture**: ES6 modules with clear separation of concerns
- ⚡ **Performance Optimized**: Lazy loading, code splitting, and optimized assets
- ♿ **Accessibility First**: WCAG 2.1 AA compliance with comprehensive ARIA support
- 🎨 **Design System**: Consistent theming with CSS custom properties
- 📱 **Progressive Web App**: Service worker, offline support, and app-like experience
- 🔒 **Production Ready**: Error handling, monitoring, and comprehensive configuration

---

## Features

### Core Functionality

- 🎨 **Advanced Design System**: Modular CSS architecture with design tokens and utility classes
- 🌓 **Dynamic Theming**: Light/dark mode with system preference detection and persistence
- 🧭 **Smart Navigation**: Smooth scroll, scroll-spy, mobile-responsive menu with animations
- 🧩 **Project Showcase**: Filterable portfolio with detailed modals and rich media support
- 💬 **Interactive Testimonials**: Auto-playing carousel with touch/swipe support
- 📝 **Content Management**: Blog and notes sections with markdown-like formatting

### Advanced Features

- 📊 **3D Skills Visualization**: Three.js powered interactive skills showcase with WebGL fallback
- 🎪 **Animation System**: Intersection Observer based scroll animations with reduced motion support
- 📱 **PWA Capabilities**: Install prompts, offline functionality, and native app experience
- 🔍 **SEO Optimized**: Rich metadata, Open Graph, Twitter Cards, and structured data
- 📧 **Smart Forms**: Real-time validation, sanitization, and accessibility features

### Developer Experience

- 🛠️ **Modular Components**: Self-contained, reusable modules with clear APIs
- ⚙️ **Centralized Configuration**: Single source of truth for all application settings
- 🐛 **Debug Tools**: Comprehensive error handling and development utilities
- 📊 **Performance Monitoring**: Built-in analytics and performance tracking
- 🧪 **Testing Ready**: Structured for unit and integration testing

---

## Quick Start

### Prerequisites

- Modern web browser with ES6 module support
- Local development server (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/Chinmoy-sh/Chinmoy-Kumar-Biswas.github.io.git
cd Chinmoy-Kumar-Biswas.github.io
```

### Development Server

Use a local HTTP server for correct ES6 module loading.

#### Option 1: Python (recommended)

```powershell
# Windows PowerShell
python -m http.server 5500
# Open http://localhost:5500
```

#### Option 2: Node.js

```powershell
# Install and run with npx
npx serve -l 5500 .
# Open http://localhost:5500
```

#### Option 3: VS Code Live Server

1. Install Live Server extension
2. Right-click `index.html` → "Open with Live Server"

### Quick Customization

1. **Update Profile**: Edit personal information in `config/config.js`
2. **Replace Images**: Update `images/` folder with your photos
3. **Modify Content**: Edit sections in `index.html`
4. **Configure Features**: Adjust settings in `config/config.js`

---

## Architecture

### Modular Design Philosophy

This portfolio implements a **component-based architecture** inspired by modern frameworks, providing:

- **Separation of Concerns**: Each module handles a specific functionality
- **Maintainability**: Easy to update, debug, and extend individual features
- **Scalability**: Add new components without affecting existing code
- **Testability**: Isolated modules are easier to test and validate
- **Performance**: Tree-shaking and code splitting capabilities

### Module Structure

```text
assets/
├── css/                     # Modular CSS Architecture
│   ├── main.css            # Entry point & utility classes
│   ├── variables.css       # Design tokens & custom properties
│   ├── base.css           # Reset, typography, global styles
│   ├── layout.css         # Grid, flexbox, responsive layouts
│   ├── components.css     # UI components & interactive elements
│   └── animations.css     # Keyframes, transitions, effects
│
├── js/                     # JavaScript ES6 Modules
│   ├── app.js             # Main application controller
│   ├── performance.js     # Performance monitoring & optimization
│   ├── asset-optimizer.js # Asset compression & optimization
│   ├── cache-config.js    # Advanced caching strategies
│   │
│   ├── utils/             # Utility Functions
│   │   ├── utilities.js   # Core helpers, debounce, validation
│   │   ├── serviceWorker.js # PWA functionality
│   │   └── security.js    # Input sanitization & security
│   │
│   ├── components/        # Feature Components
│   │   ├── navigation.js  # Menu, scroll-spy, smooth scroll
│   │   ├── modals.js      # Project details, LLM features
│   │   ├── theme.js       # Light/dark mode management
│   │   ├── carousel.js    # Testimonials, image galleries
│   │   ├── forms.js       # Contact forms, validation
│   │   └── threeJS.js     # 3D visualization system
│   │
│   └── animations/        # Animation Controllers
│       └── scrollAnimations.js # Intersection observers, effects
│
config/
└── config.js              # Centralized configuration

tests/                      # Comprehensive Testing Framework
├── package.json           # Testing dependencies & scripts
├── test-runner.js         # Master test orchestrator
├── setup-framework.js     # Framework initialization
├── README.md              # Testing documentation
├── config/                # Test configurations
│   ├── jest.config.js     # Unit testing config
│   ├── playwright.config.js # E2E testing config
│   ├── pa11y.json        # Accessibility testing
│   └── lighthouse.json   # Performance testing
├── unit/                  # Unit tests
├── e2e/                   # End-to-end tests
├── cross-browser/         # Cross-browser compatibility
├── security/              # Security audit scripts
├── setup/                 # Test setup utilities
└── reports/               # Generated test reports
```

---

## Configuration

### Centralized Configuration System

All application settings are managed through `config/config.js`, providing a single source of truth for:

#### Application Metadata

```javascript
app: {
    name: 'Chinmoy Kumar Biswas Portfolio',
    version: '2.0.0',
    author: 'Chinmoy Kumar Biswas',
    email: 'bangladeshchinmoy@gmail.com'
}
```

#### Performance Settings

```javascript
performance: {
    animations: {
        enabled: true,
        respectReducedMotion: true,
        intersectionThreshold: 0.1
    },
    particles: {
        maxParticles: { mobile: 12, desktop: 22 },
        colors: ['rgba(99, 102, 241,', 'rgba(251, 191, 36,']
    }
}
```

#### Theme Configuration

```javascript
theme: {
    default: 'system',
    persistence: true,
    transitions: { duration: '0.3s', easing: 'ease-in-out' }
}
```

#### Feature Flags

```javascript
features: {
    enableThreeJS: true,
    enableParticles: true,
    enableServiceWorker: true,
    enableAnalytics: false,
    debugMode: false
}
```

---

## Security & Performance

### 🔐 Security Features

- **Content Security Policy**: Comprehensive CSP headers protection
- **Input Sanitization**: XSS prevention and data validation
- **Rate Limiting**: Protection against abuse and spam
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **HTTPS Ready**: SSL/TLS encryption support
- **Security Monitoring**: Real-time threat detection

### 🚀 Performance Optimizations

- **Critical CSS Extraction**: Above-the-fold content prioritization
- **Service Worker v2.0.0**: Advanced asset caching strategies
- **Asset Optimization**: WebP format support, lazy loading
- **Core Web Vitals**: Comprehensive performance monitoring
- **CDN Ready**: Optimized for content delivery networks
- **Progressive Loading**: Modular JavaScript architecture

### 🧪 Testing Framework

Comprehensive testing infrastructure for production quality assurance:

#### Available Test Suites

```powershell
# Navigate to tests directory
cd tests

# Install testing dependencies
npm install

# Run all tests
npm run test:all

# Individual test suites
npm run test:unit        # Jest unit tests
npm run test:e2e         # Playwright E2E tests
npm run test:a11y        # Accessibility compliance
npm run test:perf        # Performance benchmarks
npm run test:security    # Security audit
npm run test:cross       # Cross-browser compatibility
```

#### Test Coverage

- **Unit Tests**: Component logic, utilities, configurations
- **E2E Tests**: User workflows, form submissions, navigation
- **Accessibility**: WCAG compliance, screen reader compatibility
- **Performance**: Core Web Vitals, loading times, optimization
- **Security**: XSS protection, input validation, CSP compliance
- **Cross-Browser**: Chrome, Firefox, Safari, Edge compatibility

---

## Development

### Development Workflow

#### Environment Setup

```powershell
# Clone and setup
git clone https://github.com/Chinmoy-sh/Chinmoy-Kumar-Biswas.github.io.git
cd Chinmoy-Kumar-Biswas.github.io

# Start development server
python -m http.server 5500
```

#### Making Changes

**CSS Modifications:**

- Edit modular CSS files in `assets/css/`
- Changes automatically reflect via `main.css` imports
- Use CSS custom properties for consistent theming

**JavaScript Features:**

- Create new components in `assets/js/components/`
- Add utilities to `assets/js/utils/`
- Import and initialize in `assets/js/app.js`

**Configuration Updates:**

- Modify settings in `config/config.js`
- Changes automatically apply to all modules

#### Adding New Components

##### Step 1: Create Module

```javascript
// assets/js/components/newFeature.js
export function initializeNewFeature(config) {
    // Component logic
    return {
        init: () => { /* initialization */ },
        destroy: () => { /* cleanup */ }
    };
}
```

##### Step 2: Import in App

```javascript
// assets/js/app.js
import { initializeNewFeature } from './components/newFeature.js';

// Add to component initialization
await initializeNewFeature(this.config);
```

##### Step 3: Add Configuration

```javascript
// config/config.js
export const CONFIG = {
    // Add feature settings
    newFeature: {
        enabled: true,
        options: { /* feature options */ }
    }
};
```

### Code Standards

#### JavaScript

- Use ES6+ features and modules
- Follow JSDoc documentation standards
- Implement error handling and fallbacks
- Use async/await for asynchronous operations

#### CSS

- Follow BEM naming methodology
- Use CSS custom properties for theming
- Implement mobile-first responsive design
- Optimize for performance and accessibility

#### HTML

- Semantic markup with proper ARIA labels
- Progressive enhancement principles
- Optimized meta tags and structured data

---

## Project Structure

```text
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
```

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

## Troubleshooting

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
