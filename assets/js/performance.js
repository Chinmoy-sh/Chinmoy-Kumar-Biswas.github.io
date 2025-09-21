/*/**

=============================================== * Performance Monitoring and Optimization Utilities

PERFORMANCE OPTIMIZATION * Comprehensive performance tracking and optimization for the portfolio

=============================================== * 

*/ * @version 1.0.0

    * @author Chinmoy Kumar Biswas

// Service Worker Registration */

if ('serviceWorker' in navigator) {

    window.addEventListener('load', function () {
        class PerformanceMonitor {

        navigator.serviceWorker.register('/service-worker.js')    constructor() {

            .then(function (registration) {
            this.metrics = {

                console.log('ServiceWorker registration successful'); navigationTiming: {},

            })            resourceTiming: [],

            .catch(function (err) {
                userTiming: [],

                    console.log('ServiceWorker registration failed'); vitals: { },

            }); customMetrics: { }

            });
};

}

this.observers = [];

// Lazy Loading Images        this.isEnabled = true;

document.addEventListener('DOMContentLoaded', function () {
    this.reportingEndpoint = null;

    initializeLazyLoading();

    initializeResourcePreloading(); this.init();

    initializePerformanceMonitoring();
}

});

    /**

/*     * Initialize performance monitoring

===============================================     */

LAZY LOADING    init() {

===============================================        if (!this.isEnabled) return;

*/

function initializeLazyLoading() {        // Core Web Vitals monitoring

    const images = document.querySelectorAll('img[loading="lazy"]');        this.measureCoreWebVitals();



    if ('IntersectionObserver' in window) {        // Navigation and resource timing

        const imageObserver = new IntersectionObserver((entries, observer) => {        this.measureNavigationTiming();

            entries.forEach(entry => {        this.measureResourceTiming();

                if (entry.isIntersecting) {

                    const img = entry.target;        // Custom performance marks

                    img.src = img.dataset.src || img.src;        this.setupCustomTiming();

                    img.classList.remove('lazy');

                    imageObserver.unobserve(img);        // Long task monitoring

                }        this.monitorLongTasks();

            });

        });        // Memory usage monitoring

                this.monitorMemoryUsage();

        images.forEach(img => imageObserver.observe(img));

    } else {        // FPS monitoring

        // Fallback for browsers without IntersectionObserver        this.monitorFPS();

        images.forEach(img => {

            img.src = img.dataset.src || img.src;        // Report metrics periodically

            img.classList.remove('lazy');        this.setupReporting();

        });    }

    }

}    /**

     * Measure Core Web Vitals (CLS, FID, LCP)

/*     */

===============================================    measureCoreWebVitals() {

RESOURCE PRELOADING        // Largest Contentful Paint (LCP)

===============================================        if ('PerformanceObserver' in window) {

*/            const lcpObserver = new PerformanceObserver((list) => {

function initializeResourcePreloading() {                const entries = list.getEntries();

    // Preload critical fonts                const lastEntry = entries[entries.length - 1];

    const fontPreloads = [                this.metrics.vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;

        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',                this.reportVital('LCP', this.metrics.vitals.lcp);

        'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap'            });

    ];

                try {

    fontPreloads.forEach(url => {                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        const link = document.createElement('link');                this.observers.push(lcpObserver);

        link.rel = 'preload';            } catch (e) {

        link.href = url;                console.warn('LCP observer not supported');

        link.as = 'style';            }

        link.onload = function() { this.rel = 'stylesheet'; };

        document.head.appendChild(link);            // First Input Delay (FID)

    });            const fidObserver = new PerformanceObserver((list) => {

                    const entries = list.getEntries();

    // Preload hero image                entries.forEach((entry) => {

    const heroImage = document.querySelector('.hero-image img');                    this.metrics.vitals.fid = entry.processingStart - entry.startTime;

    if (heroImage && heroImage.src) {                    this.reportVital('FID', this.metrics.vitals.fid);

        const img = new Image();                });

        img.src = heroImage.src;            });

    }

                try {

    // Preload critical resources                fidObserver.observe({ entryTypes: ['first-input'] });

    const criticalResources = [                this.observers.push(fidObserver);

        './assets/data/content.json'            } catch (e) {

    ];                console.warn('FID observer not supported');

                }

    criticalResources.forEach(url => {

        const link = document.createElement('link');            // Cumulative Layout Shift (CLS)

        link.rel = 'prefetch';            let clsValue = 0;

        link.href = url;            let clsEntries = [];

        document.head.appendChild(link);

    });            const clsObserver = new PerformanceObserver((list) => {

}                const entries = list.getEntries();

                entries.forEach((entry) => {

/*                    if (!entry.hadRecentInput) {

===============================================                        clsValue += entry.value;

PERFORMANCE MONITORING                        clsEntries.push(entry);

===============================================                    }

*/                });

function initializePerformanceMonitoring() {

    // Core Web Vitals monitoring                this.metrics.vitals.cls = clsValue;

    if ('PerformanceObserver' in window) {                this.reportVital('CLS', clsValue);

        // Largest Contentful Paint            });

        new PerformanceObserver((entryList) => {

            const entries = entryList.getEntries();            try {

            const lastEntry = entries[entries.length - 1];                clsObserver.observe({ entryTypes: ['layout-shift'] });

            console.log('LCP:', lastEntry.startTime);                this.observers.push(clsObserver);

        }).observe({ entryTypes: ['largest-contentful-paint'] });            } catch (e) {

                        console.warn('CLS observer not supported');

        // First Input Delay            }

        new PerformanceObserver((entryList) => {        }

            const entries = entryList.getEntries();    }

            entries.forEach((entry) => {

                console.log('FID:', entry.processingStart - entry.startTime);    /**

            });     * Measure navigation timing metrics

        }).observe({ entryTypes: ['first-input'] });     */

            measureNavigationTiming() {

        // Cumulative Layout Shift        if ('performance' in window && 'getEntriesByType' in performance) {

        let clsValue = 0;            window.addEventListener('load', () => {

        new PerformanceObserver((entryList) => {                setTimeout(() => {

            for (const entry of entryList.getEntries()) {                    const navTiming = performance.getEntriesByType('navigation')[0];

                if (!entry.hadRecentInput) {                    if (navTiming) {

                    clsValue += entry.value;                        this.metrics.navigationTiming = {

                }                            dns: navTiming.domainLookupEnd - navTiming.domainLookupStart,

            }                            tcp: navTiming.connectEnd - navTiming.connectStart,

            console.log('CLS:', clsValue);                            request: navTiming.responseStart - navTiming.requestStart,

        }).observe({ entryTypes: ['layout-shift'] });                            response: navTiming.responseEnd - navTiming.responseStart,

    }                            processing: navTiming.domComplete - navTiming.domLoading,

                                load: navTiming.loadEventEnd - navTiming.loadEventStart,

    // Page load performance                            total: navTiming.loadEventEnd - navTiming.navigationStart,

    window.addEventListener('load', function() {                            ttfb: navTiming.responseStart - navTiming.navigationStart,

        setTimeout(function() {                            domReady: navTiming.domContentLoadedEventEnd - navTiming.navigationStart

            const perfData = performance.timing;                        };

            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;                        this.reportNavigationMetrics();

                                }

            console.log('Page Load Time:', pageLoadTime + 'ms');                }, 0);

            console.log('DOM Ready Time:', domReadyTime + 'ms');            });

        }, 0);        }

    });    }

}

    /**

/*     * Measure resource timing

===============================================     */

IMAGE OPTIMIZATION    measureResourceTiming() {

===============================================        if ('PerformanceObserver' in window) {

*/            const resourceObserver = new PerformanceObserver((list) => {

function optimizeImages() {                const entries = list.getEntries();

    const images = document.querySelectorAll('img');                entries.forEach((entry) => {

                        const resourceInfo = {

    images.forEach(img => {                        name: entry.name,

        // Add loading attribute if not present                        type: this.getResourceType(entry),

        if (!img.hasAttribute('loading')) {                        size: entry.transferSize || 0,

            img.setAttribute('loading', 'lazy');                        duration: entry.duration,

        }                        startTime: entry.startTime,

                                dns: entry.domainLookupEnd - entry.domainLookupStart,

        // Add proper aspect ratio to prevent CLS                        tcp: entry.connectEnd - entry.connectStart,

        if (!img.style.aspectRatio && img.width && img.height) {                        request: entry.responseStart - entry.requestStart,

            img.style.aspectRatio = `${img.width}/${img.height}`;                        response: entry.responseEnd - entry.responseStart

        }                    };



        // Error handling                    this.metrics.resourceTiming.push(resourceInfo);

        img.addEventListener('error', function() {                });

            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';            });

        });

    });            try {

}                resourceObserver.observe({ entryTypes: ['resource'] });

                this.observers.push(resourceObserver);

/*            } catch (e) {

===============================================                console.warn('Resource timing observer not supported');

CRITICAL CSS INLINING            }

===============================================        }

*/    }

function inlineCriticalCSS() {

    // This would typically be done at build time    /**

    // For now, we ensure critical styles are loaded first     * Setup custom performance timing

    const criticalStyles = `     */

        body { margin: 0; font-family: 'Inter', sans-serif; }    setupCustomTiming() {

        .loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--color-bg-primary); z-index: 9999; }        // Mark critical points

        .hero { min-height: 100vh; display: flex; align-items: center; }        this.mark('app-init-start');

    `;

            // Mark when DOM is ready

    const style = document.createElement('style');        document.addEventListener('DOMContentLoaded', () => {

    style.textContent = criticalStyles;            this.mark('dom-ready');

    document.head.insertBefore(style, document.head.firstChild);        });

}

        // Mark when all resources are loaded

/*        window.addEventListener('load', () => {

===============================================            this.mark('resources-loaded');

BUNDLE OPTIMIZATION            this.measure('dom-to-resources', 'dom-ready', 'resources-loaded');

===============================================        });

*/    }

function optimizeBundles() {

    // Code splitting for non-critical features    /**

    const features = {     * Monitor long tasks that block the main thread

        particles: () => import('./particles.js'),     */

        animations: () => import('./animations.js'),    monitorLongTasks() {

        analytics: () => import('./analytics.js')        if ('PerformanceObserver' in window) {

    };            const longTaskObserver = new PerformanceObserver((list) => {

                    const entries = list.getEntries();

    // Load features on demand                entries.forEach((entry) => {

    Object.entries(features).forEach(([feature, loader]) => {                    console.warn('Long task detected:', {

        const triggerElements = document.querySelectorAll(`[data-feature="${feature}"]`);                        duration: entry.duration,

        if (triggerElements.length > 0) {                        startTime: entry.startTime,

            loader().then(module => {                        attribution: entry.attribution

                module.default?.();                    });

            });                });

        }            });

    });

}            try {

                longTaskObserver.observe({ entryTypes: ['longtask'] });

/*                this.observers.push(longTaskObserver);

===============================================            } catch (e) {

CACHE MANAGEMENT                console.warn('Long task observer not supported');

===============================================            }

*/        }

function initializeCaching() {    }

    // Cache static resources

    if ('caches' in window) {    /**

        const CACHE_NAME = 'portfolio-v1';     * Monitor memory usage

        const urlsToCache = [     */

            '/',    monitorMemoryUsage() {

            '/assets/css/reset.css',        if ('memory' in performance) {

            '/assets/css/variables.css',            const updateMemoryMetrics = () => {

            '/assets/css/base.css',                this.metrics.customMetrics.memory = {

            '/assets/css/components.css',                    used: performance.memory.usedJSHeapSize,

            '/assets/css/layouts.css',                    total: performance.memory.totalJSHeapSize,

            '/assets/css/animations.css',                    limit: performance.memory.jsHeapSizeLimit,

            '/assets/js/main.js',                    timestamp: Date.now()

            '/assets/js/data-loader.js',                };

            '/assets/data/content.json',            };

            '/images/chinmoy.png',

            '/images/pro3.jpg'            updateMemoryMetrics();

        ];            setInterval(updateMemoryMetrics, 30000); // Update every 30 seconds

                }

        caches.open(CACHE_NAME)    }

            .then(cache => {

                return cache.addAll(urlsToCache);    /**

            })     * Monitor FPS (Frames Per Second)

            .catch(error => {     */

                console.log('Cache initialization failed:', error);    monitorFPS() {

            });        let frames = 0;

    }        let lastTime = performance.now();

}        const fpsHistory = [];



/*        const countFrame = () => {

===============================================            frames++;

ACCESSIBILITY PERFORMANCE            const currentTime = performance.now();

===============================================

*/            if (currentTime >= lastTime + 1000) {

function optimizeAccessibility() {                const fps = Math.round((frames * 1000) / (currentTime - lastTime));

    // Preload screen reader announcements                fpsHistory.push(fps);

    const announcements = document.createElement('div');

    announcements.setAttribute('aria-live', 'polite');                // Keep only last 60 measurements (1 minute at 1 fps measurement per second)

    announcements.setAttribute('aria-atomic', 'true');                if (fpsHistory.length > 60) {

    announcements.style.position = 'absolute';                    fpsHistory.shift();

    announcements.style.left = '-10000px';                }

    announcements.style.width = '1px';

    announcements.style.height = '1px';                this.metrics.customMetrics.fps = {

    announcements.style.overflow = 'hidden';                    current: fps,

    document.body.appendChild(announcements);                    average: Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length),

                        min: Math.min(...fpsHistory),

    // Optimize focus management                    max: Math.max(...fpsHistory)

    document.addEventListener('keydown', function(e) {                };

        if (e.key === 'Tab') {

            document.body.classList.add('using-keyboard');                frames = 0;

        }                lastTime = currentTime;

    });            }



    document.addEventListener('mousedown', function() {            requestAnimationFrame(countFrame);

        document.body.classList.remove('using-keyboard');        };

    });

}        requestAnimationFrame(countFrame);

    }

/*

===============================================    /**

MEMORY OPTIMIZATION     * Setup periodic reporting

===============================================     */

*/    setupReporting() {

function optimizeMemory() {        // Report metrics every 30 seconds

    // Clean up event listeners for removed elements        setInterval(() => {

    const observer = new MutationObserver(function(mutations) {            this.reportMetrics();

        mutations.forEach(function(mutation) {        }, 30000);

            mutation.removedNodes.forEach(function(node) {

                if (node.nodeType === 1) { // Element node        // Report on page unload

                    // Clean up any references or listeners        window.addEventListener('beforeunload', () => {

                    if (node.cleanup && typeof node.cleanup === 'function') {            this.reportMetrics(true);

                        node.cleanup();        });

                    }    }

                }

            });    /**

        });     * Create a performance mark

    });     */

        mark(name) {

    observer.observe(document.body, {        if ('performance' in window && 'mark' in performance) {

        childList: true,            try {

        subtree: true                performance.mark(name);

    });                this.metrics.userTiming.push({

                        type: 'mark',

    // Throttle resize events                    name,

    let resizeTimeout;                    timestamp: performance.now()

    window.addEventListener('resize', function() {                });

        clearTimeout(resizeTimeout);            } catch (e) {

        resizeTimeout = setTimeout(function() {                console.warn('Performance mark failed:', name);

            // Handle resize            }

            window.dispatchEvent(new CustomEvent('optimizedResize'));        }

        }, 250);    }

    });

}    /**

     * Create a performance measure

// Initialize performance optimizations     */

initializeCaching();    measure(name, startMark, endMark) {

optimizeImages();        if ('performance' in window && 'measure' in performance) {

optimizeAccessibility();            try {

optimizeMemory();                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name, 'measure')[0];
                if (measure) {
                    this.metrics.userTiming.push({
                        type: 'measure',
                        name,
                        duration: measure.duration,
                        startTime: measure.startTime
                    });
                }
            } catch (e) {
                console.warn('Performance measure failed:', name);
            }
        }
    }

    /**
     * Get resource type from entry
     */
    getResourceType(entry) {
        const initiatorType = entry.initiatorType;
        if (initiatorType) return initiatorType;

        const url = new URL(entry.name);
        const extension = url.pathname.split('.').pop();

        if (['css'].includes(extension)) return 'stylesheet';
        if (['js'].includes(extension)) return 'script';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return 'image';
        if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';

        return 'other';
    }

    /**
     * Report Core Web Vital
     */
    reportVital(name, value) {
        console.log(`${name}:`, value);

        // Send to service worker for analytics
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'PERFORMANCE_LOG',
                data: {
                    type: 'vital',
                    name,
                    value,
                    timestamp: Date.now()
                }
            });
        }
    }

    /**
     * Report navigation metrics
     */
    reportNavigationMetrics() {
        console.log('Navigation Timing:', this.metrics.navigationTiming);

        // Analyze and warn about slow metrics
        if (this.metrics.navigationTiming.ttfb > 600) {
            console.warn('Slow TTFB detected:', this.metrics.navigationTiming.ttfb, 'ms');
        }

        if (this.metrics.navigationTiming.total > 3000) {
            console.warn('Slow page load detected:', this.metrics.navigationTiming.total, 'ms');
        }
    }

    /**
     * Report all collected metrics
     */
    reportMetrics(isUnload = false) {
        const report = {
            timestamp: Date.now(),
            url: location.href,
            userAgent: navigator.userAgent,
            connection: this.getConnectionInfo(),
            metrics: this.metrics,
            isUnload
        };

        console.log('Performance Report:', report);

        // Send to analytics or monitoring service
        if (this.reportingEndpoint) {
            this.sendToEndpoint(report);
        }
    }

    /**
     * Get connection information
     */
    getConnectionInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }

        return null;
    }

    /**
     * Send metrics to reporting endpoint
     */
    async sendToEndpoint(data) {
        try {
            await fetch(this.reportingEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                keepalive: true
            });
        } catch (error) {
            console.warn('Failed to send metrics:', error);
        }
    }

    /**
     * Get current performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = {
            navigationTiming: {},
            resourceTiming: [],
            userTiming: [],
            vitals: {},
            customMetrics: {}
        };
    }

    /**
     * Cleanup observers
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isEnabled = false;
    }
}

// Resource loading optimization utilities
class ResourceOptimizer {
    constructor() {
        this.loadedResources = new Set();
        this.preloadedResources = new Set();
        this.priorityQueue = [];
    }

    /**
     * Preload critical resources
     */
    preloadCritical() {
        const criticalResources = [
            { href: '/assets/css/critical.css', as: 'style' },
            { href: '/assets/js/app.js', as: 'script' },
            { href: '/assets/fonts/primary-font.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
        ];

        criticalResources.forEach(resource => this.preload(resource));
    }

    /**
     * Preload a resource
     */
    preload(resource) {
        if (this.preloadedResources.has(resource.href)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) link.type = resource.type;
        if (resource.crossorigin) link.crossOrigin = resource.crossorigin;

        document.head.appendChild(link);
        this.preloadedResources.add(resource.href);
    }

    /**
     * Lazy load non-critical resources
     */
    lazyLoadNonCritical() {
        const nonCriticalResources = [
            '/assets/js/components/three-scene.js',
            '/assets/js/components/particle-system.js',
            '/assets/css/animations.css'
        ];

        // Load after main thread is free
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                nonCriticalResources.forEach(src => this.loadResource(src));
            });
        } else {
            setTimeout(() => {
                nonCriticalResources.forEach(src => this.loadResource(src));
            }, 100);
        }
    }

    /**
     * Load a resource dynamically
     */
    async loadResource(src) {
        if (this.loadedResources.has(src)) return;

        try {
            if (src.endsWith('.css')) {
                await this.loadStylesheet(src);
            } else if (src.endsWith('.js')) {
                await this.loadScript(src);
            }

            this.loadedResources.add(src);
        } catch (error) {
            console.warn('Failed to load resource:', src, error);
        }
    }

    /**
     * Load stylesheet dynamically
     */
    loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Load script dynamically
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
}

// Image optimization utilities
class ImageOptimizer {
    constructor() {
        this.lazyImages = [];
        this.observer = null;
        this.setupLazyLoading();
    }

    /**
     * Setup intersection observer for lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Find and observe lazy images
            this.findLazyImages();
        }
    }

    /**
     * Find images to lazy load
     */
    findLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.observer.observe(img);
            this.lazyImages.push(img);
        });
    }

    /**
     * Load an image
     */
    loadImage(img) {
        img.src = img.dataset.src;
        img.classList.add('loaded');

        // Add loading animation
        img.style.opacity = '0';
        img.onload = () => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '1';
        };
    }

    /**
     * Optimize image loading with WebP support
     */
    optimizeImageFormat(img) {
        if (this.supportsWebP()) {
            const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');

            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = () => {
                img.src = webpSrc;
            };
            testImg.src = webpSrc;
        }
    }

    /**
     * Check WebP support
     */
    supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('webp') !== -1;
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
const resourceOptimizer = new ResourceOptimizer();
const imageOptimizer = new ImageOptimizer();

// Mark application initialization
performanceMonitor.mark('app-init-end');
performanceMonitor.measure('app-init-duration', 'app-init-start', 'app-init-end');

// Start resource optimization
resourceOptimizer.preloadCritical();
resourceOptimizer.lazyLoadNonCritical();

// Export for global access
window.PerformanceMonitor = PerformanceMonitor;
window.performanceMonitor = performanceMonitor;
window.resourceOptimizer = resourceOptimizer;
window.imageOptimizer = imageOptimizer;