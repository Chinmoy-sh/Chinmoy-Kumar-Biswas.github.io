/**
 * Performance Monitoring and Optimization Utilities
 * Comprehensive performance tracking and optimization for the portfolio
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigationTiming: {},
            resourceTiming: [],
            userTiming: [],
            vitals: {},
            customMetrics: {}
        };

        this.observers = [];
        this.isEnabled = true;
        this.reportingEndpoint = null;

        this.init();
    }

    /**
     * Initialize performance monitoring
     */
    init() {
        if (!this.isEnabled) return;

        // Core Web Vitals monitoring
        this.measureCoreWebVitals();

        // Navigation and resource timing
        this.measureNavigationTiming();
        this.measureResourceTiming();

        // Custom performance marks
        this.setupCustomTiming();

        // Long task monitoring
        this.monitorLongTasks();

        // Memory usage monitoring
        this.monitorMemoryUsage();

        // FPS monitoring
        this.monitorFPS();

        // Report metrics periodically
        this.setupReporting();
    }

    /**
     * Measure Core Web Vitals (CLS, FID, LCP)
     */
    measureCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.vitals.lcp = lastEntry.renderTime || lastEntry.loadTime;
                this.reportVital('LCP', this.metrics.vitals.lcp);
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.push(lcpObserver);
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // First Input Delay (FID)
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    this.metrics.vitals.fid = entry.processingStart - entry.startTime;
                    this.reportVital('FID', this.metrics.vitals.fid);
                });
            });

            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.push(fidObserver);
            } catch (e) {
                console.warn('FID observer not supported');
            }

            // Cumulative Layout Shift (CLS)
            let clsValue = 0;
            let clsEntries = [];

            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                });

                this.metrics.vitals.cls = clsValue;
                this.reportVital('CLS', clsValue);
            });

            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.push(clsObserver);
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }
    }

    /**
     * Measure navigation timing metrics
     */
    measureNavigationTiming() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const navTiming = performance.getEntriesByType('navigation')[0];
                    if (navTiming) {
                        this.metrics.navigationTiming = {
                            dns: navTiming.domainLookupEnd - navTiming.domainLookupStart,
                            tcp: navTiming.connectEnd - navTiming.connectStart,
                            request: navTiming.responseStart - navTiming.requestStart,
                            response: navTiming.responseEnd - navTiming.responseStart,
                            processing: navTiming.domComplete - navTiming.domLoading,
                            load: navTiming.loadEventEnd - navTiming.loadEventStart,
                            total: navTiming.loadEventEnd - navTiming.navigationStart,
                            ttfb: navTiming.responseStart - navTiming.navigationStart,
                            domReady: navTiming.domContentLoadedEventEnd - navTiming.navigationStart
                        };

                        this.reportNavigationMetrics();
                    }
                }, 0);
            });
        }
    }

    /**
     * Measure resource timing
     */
    measureResourceTiming() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    const resourceInfo = {
                        name: entry.name,
                        type: this.getResourceType(entry),
                        size: entry.transferSize || 0,
                        duration: entry.duration,
                        startTime: entry.startTime,
                        dns: entry.domainLookupEnd - entry.domainLookupStart,
                        tcp: entry.connectEnd - entry.connectStart,
                        request: entry.responseStart - entry.requestStart,
                        response: entry.responseEnd - entry.responseStart
                    };

                    this.metrics.resourceTiming.push(resourceInfo);
                });
            });

            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.push(resourceObserver);
            } catch (e) {
                console.warn('Resource timing observer not supported');
            }
        }
    }

    /**
     * Setup custom performance timing
     */
    setupCustomTiming() {
        // Mark critical points
        this.mark('app-init-start');

        // Mark when DOM is ready
        document.addEventListener('DOMContentLoaded', () => {
            this.mark('dom-ready');
        });

        // Mark when all resources are loaded
        window.addEventListener('load', () => {
            this.mark('resources-loaded');
            this.measure('dom-to-resources', 'dom-ready', 'resources-loaded');
        });
    }

    /**
     * Monitor long tasks that block the main thread
     */
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    console.warn('Long task detected:', {
                        duration: entry.duration,
                        startTime: entry.startTime,
                        attribution: entry.attribution
                    });
                });
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
                this.observers.push(longTaskObserver);
            } catch (e) {
                console.warn('Long task observer not supported');
            }
        }
    }

    /**
     * Monitor memory usage
     */
    monitorMemoryUsage() {
        if ('memory' in performance) {
            const updateMemoryMetrics = () => {
                this.metrics.customMetrics.memory = {
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize,
                    limit: performance.memory.jsHeapSizeLimit,
                    timestamp: Date.now()
                };
            };

            updateMemoryMetrics();
            setInterval(updateMemoryMetrics, 30000); // Update every 30 seconds
        }
    }

    /**
     * Monitor FPS (Frames Per Second)
     */
    monitorFPS() {
        let frames = 0;
        let lastTime = performance.now();
        const fpsHistory = [];

        const countFrame = () => {
            frames++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                fpsHistory.push(fps);

                // Keep only last 60 measurements (1 minute at 1 fps measurement per second)
                if (fpsHistory.length > 60) {
                    fpsHistory.shift();
                }

                this.metrics.customMetrics.fps = {
                    current: fps,
                    average: Math.round(fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length),
                    min: Math.min(...fpsHistory),
                    max: Math.max(...fpsHistory)
                };

                frames = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(countFrame);
        };

        requestAnimationFrame(countFrame);
    }

    /**
     * Setup periodic reporting
     */
    setupReporting() {
        // Report metrics every 30 seconds
        setInterval(() => {
            this.reportMetrics();
        }, 30000);

        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.reportMetrics(true);
        });
    }

    /**
     * Create a performance mark
     */
    mark(name) {
        if ('performance' in window && 'mark' in performance) {
            try {
                performance.mark(name);
                this.metrics.userTiming.push({
                    type: 'mark',
                    name,
                    timestamp: performance.now()
                });
            } catch (e) {
                console.warn('Performance mark failed:', name);
            }
        }
    }

    /**
     * Create a performance measure
     */
    measure(name, startMark, endMark) {
        if ('performance' in window && 'measure' in performance) {
            try {
                performance.measure(name, startMark, endMark);
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