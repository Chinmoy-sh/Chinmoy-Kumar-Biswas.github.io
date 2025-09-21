(function () {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('theme');
    const theme = saved || (prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme', theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', current);
            localStorage.setItem('theme', current);
        });
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Active nav link on scroll
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const links = Array.from(document.querySelectorAll('.site-nav .nav-link'));
    const linkMap = new Map(links.map(l => [l.getAttribute('href')?.slice(1), l]));

    const activate = (id) => {
        links.forEach(l => l.classList.remove('is-active'));
        const link = linkMap.get(id);
        if (link) link.classList.add('is-active');
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) activate(entry.target.id);
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });
    sections.forEach(s => observer.observe(s));

    // Reveal animations
    const revealables = document.querySelectorAll('.reveal-up, .reveal-fade, .scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                e.target.classList.add('revealed');
                obs.unobserve(e.target);
            }
        })
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealables.forEach(el => revealObs.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('.site-nav a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (!id) return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', id);
            }
        });
    });

    // Basic form handler (no backend)
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const values = Object.fromEntries(data.entries());
            if (!values.name || !values.email || !values.message) {
                alert('Please fill out all fields.');
                return;
            }
            alert('Thanks! Your message has been captured locally.');
            form.reset();
        });
    }
})();

// Lightweight feature modules used by App
window.themeManager = {
    cycleTheme() {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', current);
        localStorage.setItem('theme', current);
    }
};

window.mobileNav = (function () {
    let open = false;
    const nav = document.querySelector('.site-nav');
    return {
        isMenuOpen: () => open,
        openMenu: () => { open = true; nav?.classList.add('open'); },
        closeMenu: () => { open = false; nav?.classList.remove('open'); }
    };
})();

window.smoothScrollManager = {
    scrollTo(hash) {
        const target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.formValidator = {
    validate(form) {
        return form.checkValidity();
    }
};

// Simple particles on hero background
window.particleSystem = (function () {
    let rafId = null;
    let running = false;
    const container = document.querySelector('.hero-background');
    const particles = [];
    function createParticle() {
        const el = document.createElement('span');
        el.className = 'particle';
        const size = Math.random() * 4 + 2;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${100 + Math.random() * 20}%`;
        el.style.opacity = '0.6';
        container?.appendChild(el);
        const speed = Math.random() * 0.5 + 0.2;
        return { el, y: parseFloat(el.style.top), speed };
    }
    function step() {
        particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < -5) p.y = 105;
            p.el.style.top = `${p.y}%`;
        });
        if (running) rafId = requestAnimationFrame(step);
    }
    function init() {
        if (!container) return;
        for (let i = 0; i < 24; i++) particles.push(createParticle());
        running = true; step();
    }
    function pause() { running = false; if (rafId) cancelAnimationFrame(rafId); }
    function resume() { if (!running) { running = true; step(); } }
    init();
    return { pause, resume };
})();
// Data-driven rendering
async function loadPortfolioData() {
    try {
        const res = await fetch('./assets/data/portfolio.json', { cache: 'no-cache' });
        if (!res.ok) throw new Error('Failed to load data');
        const data = await res.json();
        renderHero(data.hero);
        renderAbout(data.about);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderExperience(data.experience);
        renderReferences(data.references);
        renderCommunity(data.community);
        renderResources(data.resources);
        if (typeof window.refreshReveals === 'function') {
            window.refreshReveals();
        }
    } catch (e) {
        console.warn('Data load skipped:', e.message);
    }
}

function renderHero(hero) {
    if (!hero) return;
    const h1 = document.querySelector('#home .headline');
    const subtitle = document.querySelector('#home .subhead');
    if (h1) h1.textContent = hero.name || h1.textContent;
    if (subtitle) subtitle.textContent = hero.tagline || subtitle.textContent;
}

function renderAbout(about) {
    if (!about) return;
    const intro = document.querySelector('#about .card p');
    const highlights = document.querySelector('#about .card + .card .list');
    if (intro) intro.textContent = about.intro;
    if (highlights && Array.isArray(about.highlights)) {
        highlights.innerHTML = about.highlights.map(h => `<li>${h}</li>`).join('');
    }
}

function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid || !Array.isArray(skills)) return;
    grid.innerHTML = skills.map((s, idx) => `
        <article class="card skill-card reveal-up delay-${(idx % 3) + 1}">
            <h3>${s.category}</h3>
            <p>${(s.items || []).join(', ')}</p>
        </article>
    `).join('');
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid || !Array.isArray(projects)) return;
    const fallbackImg = './images/pro3.jpg';
    grid.innerHTML = projects.map((p, idx) => {
        const img = p.image && p.image.length > 0 ? p.image : fallbackImg;
        const tags = Array.isArray(p.tags) ? `<p class="badge">${p.tags.join(' · ')}</p>` : '';
        const links = p.links ? `<div class="actions"><a class="btn btn-sm btn-primary" href="${p.links.demo || '#'}" target="_blank" rel="noopener">Demo</a><a class="btn btn-sm btn-outline" href="${p.links.code || '#'}" target="_blank" rel="noopener">Code</a></div>` : '';
        return `
                <article class="card project-card reveal-fade delay-${(idx % 3) + 1}">
            <div class="media">
              <img src="${img}" alt="${p.title}" loading="lazy" width="640" height="400" decoding="async" />
            </div>
            <div class="card-body">
              <h3>${p.title}</h3>
              <p>${p.description || ''}</p>
              ${tags}
              ${links}
            </div>
        </article>`;
    }).join('');
}

function renderExperience(experience) {
    const wrap = document.getElementById('experience-timeline');
    if (!wrap || !Array.isArray(experience)) return;
    wrap.innerHTML = experience.map((e, idx) => `
        <div class="card scroll-reveal ${idx % 2 ? 'scroll-reveal-left' : 'scroll-reveal-right'}">
          <strong>${e.role}</strong> — ${e.company} <span class="badge">${e.period}</span>
          <p>${e.summary || ''}</p>
        </div>
    `).join('');
}

function renderReferences(refs) {
    const grid = document.getElementById('references-grid');
    if (!grid || !Array.isArray(refs)) return;
    grid.innerHTML = refs.map((r, idx) => `
        <article class="card reveal-up delay-${(idx % 3) + 1}">
            <p>“${r.quote}”</p>
            <p class="badge">${r.name} — ${r.role}</p>
        </article>
    `).join('');
}

function renderCommunity(items) {
    const grid = document.getElementById('community-grid');
    if (!grid || !Array.isArray(items)) return;
    grid.innerHTML = items.map((i, idx) => `
        <article class="card hover-lift reveal-up delay-${(idx % 3) + 1}">
            <h3>${i.platform}</h3>
            <a href="${i.url}" target="_blank" rel="noopener">${i.handle}</a>
        </article>
    `).join('');
}

function renderResources(items) {
    const grid = document.getElementById('resources-grid');
    if (!grid || !Array.isArray(items)) return;
    grid.innerHTML = items.map((i, idx) => `
        <article class="card reveal-fade delay-${(idx % 3) + 1}">
            <span class="badge">${i.type}</span>
            <a href="${i.url}" target="_blank" rel="noopener">${i.title}</a>
        </article>
    `).join('');
}

// Kick off data rendering after DOM ready baseline
if (document.readyState !== 'loading') {
    loadPortfolioData();
} else {
    document.addEventListener('DOMContentLoaded', loadPortfolioData);
}
/**
 * ===============================================
 * MAIN APPLICATION SCRIPT
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

// Performance monitoring
const performanceStart = performance.now();

// Global app configuration
const APP_CONFIG = {
    version: '2.0.0',
    author: 'Chinmoy Kumar Biswas',
    environment: 'production',
    debug: false,
    features: {
        particles: true,
        smoothScroll: true,
        themeSwitch: true,
        mobileNav: true,
        formValidation: true,
        lazyLoading: true,
        animations: true
    }
};

// Global state management
const AppState = {
    isLoaded: false,
    isMobile: false,
    theme: 'dark',
    activeSection: 'home',
    scrollPosition: 0,

    // State getters and setters
    set(key, value) {
        this[key] = value;
        this.notifyObservers(key, value);
    },

    observers: [],

    subscribe(callback) {
        this.observers.push(callback);
    },

    notifyObservers(key, value) {
        this.observers.forEach(callback => {
            try {
                callback(key, value);
            } catch (error) {
                console.error('State observer error:', error);
            }
        });
    }
};

// Utility functions
const Utils = {
    // Debounce function
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 - threshold &&
            rect.left >= 0 - threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
        );
    },

    // Smooth scroll to element
    scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },

    // Device detection
    detectDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        const isTouch = 'ontouchstart' in window;

        return { isMobile, isTablet, isTouch };
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Animate number counting
    animateNumber(element, start, end, duration = 1000) {
        const startTime = performance.now();
        const range = end - start;

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (range * easeOut));

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }

        requestAnimationFrame(updateNumber);
    }
};

// Loading screen management
class LoadingManager {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.progressBar = document.querySelector('.loading-progress');
        this.loadingText = document.querySelector('.loading-text');
        this.progress = 0;

        this.init();
    }

    init() {
        if (!this.loadingScreen) {
            this.createLoadingScreen();
        }

        this.updateProgress(0);
    }

    createLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-container">
                <div class="loading-logo">
                    <h1>CKB</h1>
                </div>
                <div class="loading-progress-container">
                    <div class="loading-progress"></div>
                </div>
                <div class="loading-text">Loading...</div>
            </div>
        `;

        document.body.insertBefore(this.loadingScreen, document.body.firstChild);

        this.progressBar = this.loadingScreen.querySelector('.loading-progress');
        this.loadingText = this.loadingScreen.querySelector('.loading-text');
    }

    updateProgress(percent, text) {
        this.progress = Math.min(100, Math.max(0, percent));

        if (this.progressBar) {
            this.progressBar.style.width = `${this.progress}%`;
        }

        if (text && this.loadingText) {
            this.loadingText.textContent = text;
        }
    }

    finish() {
        this.updateProgress(100, 'Ready!');

        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('loaded');

                setTimeout(() => {
                    this.loadingScreen.remove();
                    AppState.set('isLoaded', true);
                    document.body.classList.add('loaded');
                    const spinner = document.getElementById('loading-spinner');
                    if (spinner) {
                        spinner.style.opacity = '0';
                        spinner.style.pointerEvents = 'none';
                        setTimeout(() => spinner.remove(), 300);
                    }
                }, 500);
            }
        }, 200);
    }
}

// Section observer for navigation highlighting
class SectionObserver {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
        this.currentSection = null;

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback for older browsers
            this.setupScrollListener();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setActiveSection(entry.target.id);
                }
            });
        }, options);

        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    setupScrollListener() {
        const throttledHandler = Utils.throttle(() => {
            let activeSection = null;
            const scrollPos = window.pageYOffset + window.innerHeight / 2;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    activeSection = section.id;
                }
            });

            if (activeSection && activeSection !== this.currentSection) {
                this.setActiveSection(activeSection);
            }
        }, 100);

        window.addEventListener('scroll', throttledHandler);
    }

    setActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;

        this.currentSection = sectionId;
        AppState.set('activeSection', sectionId);

        // Update navigation
        this.navLinks.forEach(link => {
            link.classList.remove('is-active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('is-active');
            }
        });

        // Update page title
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTitle = section.dataset.title || section.querySelector('h2, h1')?.textContent;
            if (sectionTitle) {
                document.title = `${sectionTitle} - Chinmoy Kumar Biswas`;
            }
        }
    }
}

// Lazy loading for images and iframes
class LazyLoader {
    constructor() {
        this.elements = document.querySelectorAll('[data-lazy]');
        this.imageObserver = null;

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        } else {
            // Fallback: load all images immediately
            this.loadAllImages();
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0
        };

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
                }
            });
        }, options);

        this.elements.forEach(el => {
            this.imageObserver.observe(el);
        });
    }

    loadImage(element) {
        const src = element.dataset.lazy;

        if (element.tagName === 'IMG') {
            element.src = src;
            element.onload = () => {
                element.classList.add('loaded');
                element.removeAttribute('data-lazy');
            };
        } else if (element.tagName === 'DIV' || element.tagName === 'SECTION') {
            element.style.backgroundImage = `url(${src})`;
            element.classList.add('loaded');
            element.removeAttribute('data-lazy');
        }
    }

    loadAllImages() {
        this.elements.forEach(el => this.loadImage(el));
    }
}

// Application initialization
class App {
    constructor() {
        this.loadingManager = new LoadingManager();
        this.initializationSteps = [
            { name: 'DOM Ready', progress: 10 },
            { name: 'Loading CSS', progress: 20 },
            { name: 'Initializing Theme', progress: 30 },
            { name: 'Setting up Navigation', progress: 40 },
            { name: 'Loading Particles', progress: 50 },
            { name: 'Setting up Scroll Effects', progress: 60 },
            { name: 'Initializing Forms', progress: 70 },
            { name: 'Loading Components', progress: 80 },
            { name: 'Final Setup', progress: 90 },
            { name: 'Ready', progress: 100 }
        ];

        this.currentStep = 0;

        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Professional Portfolio...');

            // Wait for DOM to be ready
            if (document.readyState !== 'loading') {
                this.onDOMReady();
            } else {
                document.addEventListener('DOMContentLoaded', this.onDOMReady.bind(this));
            }

        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.loadingManager.updateProgress(100, 'Error loading application');
        }
    }

    async onDOMReady() {
        this.nextStep('DOM Ready');

        // Detect device type
        const device = Utils.detectDevice();
        AppState.set('isMobile', device.isMobile);
        document.body.classList.toggle('mobile', device.isMobile);
        document.body.classList.toggle('tablet', device.isTablet);
        document.body.classList.toggle('touch', device.isTouch);

        // Initialize core systems
        await this.initializeCoreSystems();

        // Initialize optional features
        await this.initializeOptionalFeatures();

        // Finalize setup
        this.finalizeSetup();

        // Complete loading
        this.loadingManager.finish();

        console.log(`✅ Portfolio loaded in ${(performance.now() - performanceStart).toFixed(2)}ms`);
    }

    async initializeCoreSystems() {
        this.nextStep('Loading CSS');

        // Ensure all CSS is loaded
        await this.waitForStylesheets();

        this.nextStep('Initializing Theme');

        // Wait for theme system
        await this.waitForModule('themeManager');

        this.nextStep('Setting up Navigation');

        // Initialize section observer
        this.sectionObserver = new SectionObserver();

        // Wait for mobile navigation
        await this.waitForModule('mobileNav');
    }

    async initializeOptionalFeatures() {
        if (APP_CONFIG.features.particles) {
            this.nextStep('Loading Particles');
            await this.waitForModule('particleSystem');
        }

        if (APP_CONFIG.features.smoothScroll) {
            this.nextStep('Setting up Scroll Effects');
            await this.waitForModule('smoothScrollManager');
        }

        if (APP_CONFIG.features.formValidation) {
            this.nextStep('Initializing Forms');
            await this.waitForModule('formValidator');
        }

        if (APP_CONFIG.features.lazyLoading) {
            this.nextStep('Loading Components');
            this.lazyLoader = new LazyLoader();
        }
    }

    finalizeSetup() {
        this.nextStep('Final Setup');

        // Setup global event listeners
        this.setupGlobalEventListeners();

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Setup analytics (if configured)
        this.setupAnalytics();

        // Register service worker (if supported)
        this.registerServiceWorker();

        this.nextStep('Ready');
    }

    setupGlobalEventListeners() {
        // Scroll position tracking
        const scrollHandler = Utils.throttle(() => {
            AppState.set('scrollPosition', window.pageYOffset);
        }, 16);

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Resize handling
        const resizeHandler = Utils.debounce(() => {
            const device = Utils.detectDevice();
            AppState.set('isMobile', device.isMobile);
            document.body.classList.toggle('mobile', device.isMobile);
            document.body.classList.toggle('tablet', device.isTablet);
        }, 250);

        window.addEventListener('resize', resizeHandler);

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(resizeHandler, 100);
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                // Resume any paused animations or processes
                if (window.particleSystem) {
                    window.particleSystem.resume();
                }
            } else {
                // Pause resource-intensive operations
                if (window.particleSystem) {
                    window.particleSystem.pause();
                }
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Theme toggle: Ctrl/Cmd + Shift + T
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                if (window.themeManager) {
                    window.themeManager.cycleTheme();
                }
            }

            // Mobile menu toggle: Escape
            if (e.key === 'Escape' && window.mobileNav?.isMenuOpen()) {
                window.mobileNav.closeMenu();
            }
        });
    }

    setupAnalytics() {
        // Setup Google Analytics, GTM, or other analytics
        // This is a placeholder for analytics integration

        if (APP_CONFIG.debug) {
            console.log('📊 Analytics setup (disabled in debug mode)');
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator && APP_CONFIG.environment === 'production') {
            navigator.serviceWorker.register('./service-worker.js').then(registration => {
                console.log('🔧 Service worker registered:', registration);
            }).catch(error => {
                console.log('❌ Service worker registration failed:', error);
            });
        }
    }

    async waitForStylesheets() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const promises = Array.from(stylesheets).map(link => {
            return new Promise((resolve) => {
                if (link.sheet) {
                    resolve();
                } else {
                    link.addEventListener('load', resolve);
                    link.addEventListener('error', resolve);
                }
            });
        });

        await Promise.all(promises);
    }

    async waitForModule(moduleName, timeout = 5000) {
        return new Promise((resolve) => {
            const startTime = Date.now();

            const checkModule = () => {
                if (window[moduleName]) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    console.warn(`⚠️ Module ${moduleName} not loaded within timeout`);
                    resolve();
                } else {
                    setTimeout(checkModule, 50);
                }
            };

            checkModule();
        });
    }

    nextStep(stepName) {
        const step = this.initializationSteps[this.currentStep];
        if (step) {
            this.loadingManager.updateProgress(step.progress, stepName || step.name);
            this.currentStep++;
        }
    }
}

// Global error handling
window.addEventListener('error', (event) => {
    console.error('❌ Global error:', event.error);

    // In production, you might want to send this to an error tracking service
    if (APP_CONFIG.environment === 'production') {
        // Example: Sentry.captureException(event.error);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);

    // Prevent the default browser behavior
    event.preventDefault();
});

// Expose utilities globally
window.APP_CONFIG = APP_CONFIG;
window.AppState = AppState;
window.Utils = Utils;

// Initialize application
const app = new App();

// Performance logging
window.addEventListener('load', () => {
    const loadTime = performance.now() - performanceStart;
    console.log(`⚡ Total load time: ${loadTime.toFixed(2)}ms`);

    // Log performance metrics
    if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            console.log('📊 Performance Metrics:', {
                'DNS Lookup': `${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`,
                'TCP Connection': `${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`,
                'Server Response': `${(navigation.responseEnd - navigation.requestStart).toFixed(2)}ms`,
                'DOM Processing': `${(navigation.domComplete - navigation.domLoading).toFixed(2)}ms`,
                'Total Load': `${loadTime.toFixed(2)}ms`
            });
        }
    }
});

// exports removed for non-module usage