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
        this.navLinks = document.querySelectorAll('nav a[href^="#"]');
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
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
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