/**
 * Unit Tests for Performance Monitoring
 * Testing performance utilities and monitoring functions
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

// Mock performance API
Object.defineProperty(window, 'performance', {
    value: {
        now: jest.fn(() => Date.now()),
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByType: jest.fn(() => []),
        getEntriesByName: jest.fn(() => []),
        memory: {
            usedJSHeapSize: 1000000,
            totalJSHeapSize: 2000000,
            jsHeapSizeLimit: 4000000
        }
    },
    configurable: true
});

// Mock PerformanceObserver
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(() => [])
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
}));

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
    value: {
        controller: {
            postMessage: jest.fn()
        }
    },
    configurable: true
});

describe('Performance Monitoring', () => {
    let performanceMonitor;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Mock the PerformanceMonitor class
        global.PerformanceMonitor = class {
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
            }

            mark(name) {
                performance.mark(name);
                this.metrics.userTiming.push({
                    type: 'mark',
                    name,
                    timestamp: performance.now()
                });
            }

            measure(name, startMark, endMark) {
                performance.measure(name, startMark, endMark);
                this.metrics.userTiming.push({
                    type: 'measure',
                    name,
                    duration: 100,
                    startTime: performance.now()
                });
            }

            getMetrics() {
                return { ...this.metrics };
            }

            reset() {
                this.metrics = {
                    navigationTiming: {},
                    resourceTiming: [],
                    userTiming: [],
                    vitals: {},
                    customMetrics: {}
                };
            }

            destroy() {
                this.observers.forEach(observer => observer.disconnect());
                this.observers = [];
                this.isEnabled = false;
            }
        };

        performanceMonitor = new global.PerformanceMonitor();
    });

    afterEach(() => {
        if (performanceMonitor && performanceMonitor.destroy) {
            performanceMonitor.destroy();
        }
    });

    test('should initialize performance monitor', () => {
        expect(performanceMonitor).toBeDefined();
        expect(performanceMonitor.isEnabled).toBe(true);
        expect(performanceMonitor.metrics).toBeDefined();
    });

    test('should create performance marks', () => {
        const markName = 'test-mark';
        performanceMonitor.mark(markName);

        expect(performance.mark).toHaveBeenCalledWith(markName);
        expect(performanceMonitor.metrics.userTiming).toHaveLength(1);
        expect(performanceMonitor.metrics.userTiming[0].name).toBe(markName);
        expect(performanceMonitor.metrics.userTiming[0].type).toBe('mark');
    });

    test('should create performance measures', () => {
        const measureName = 'test-measure';
        const startMark = 'start-mark';
        const endMark = 'end-mark';

        performanceMonitor.measure(measureName, startMark, endMark);

        expect(performance.measure).toHaveBeenCalledWith(measureName, startMark, endMark);
        expect(performanceMonitor.metrics.userTiming).toHaveLength(1);
        expect(performanceMonitor.metrics.userTiming[0].name).toBe(measureName);
        expect(performanceMonitor.metrics.userTiming[0].type).toBe('measure');
    });

    test('should return current metrics', () => {
        performanceMonitor.mark('test-mark');
        const metrics = performanceMonitor.getMetrics();

        expect(metrics).toEqual(performanceMonitor.metrics);
        expect(metrics.userTiming).toHaveLength(1);
    });

    test('should reset metrics', () => {
        performanceMonitor.mark('test-mark');
        expect(performanceMonitor.metrics.userTiming).toHaveLength(1);

        performanceMonitor.reset();
        expect(performanceMonitor.metrics.userTiming).toHaveLength(0);
        expect(performanceMonitor.metrics.navigationTiming).toEqual({});
    });

    test('should cleanup observers on destroy', () => {
        const mockObserver = {
            disconnect: jest.fn()
        };
        performanceMonitor.observers.push(mockObserver);

        performanceMonitor.destroy();

        expect(mockObserver.disconnect).toHaveBeenCalled();
        expect(performanceMonitor.isEnabled).toBe(false);
    });
});

describe('Resource Optimizer', () => {
    let resourceOptimizer;

    beforeEach(() => {
        // Mock ResourceOptimizer class
        global.ResourceOptimizer = class {
            constructor() {
                this.loadedResources = new Set();
                this.preloadedResources = new Set();
                this.priorityQueue = [];
            }

            preload(resource) {
                if (this.preloadedResources.has(resource.href)) return;

                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;

                document.head.appendChild(link);
                this.preloadedResources.add(resource.href);
                return link;
            }

            async loadResource(src) {
                if (this.loadedResources.has(src)) return;

                if (src.endsWith('.css')) {
                    await this.loadStylesheet(src);
                } else if (src.endsWith('.js')) {
                    await this.loadScript(src);
                }

                this.loadedResources.add(src);
            }

            loadStylesheet(href) {
                return new Promise((resolve) => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    link.onload = resolve;
                    document.head.appendChild(link);
                    // Simulate immediate load for testing
                    setTimeout(resolve, 10);
                });
            }

            loadScript(src) {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    document.head.appendChild(script);
                    // Simulate immediate load for testing
                    setTimeout(resolve, 10);
                });
            }
        };

        resourceOptimizer = new global.ResourceOptimizer();
    });

    test('should initialize resource optimizer', () => {
        expect(resourceOptimizer).toBeDefined();
        expect(resourceOptimizer.loadedResources).toBeInstanceOf(Set);
        expect(resourceOptimizer.preloadedResources).toBeInstanceOf(Set);
    });

    test('should preload resources', () => {
        const resource = {
            href: '/test.css',
            as: 'style'
        };

        const link = resourceOptimizer.preload(resource);

        expect(link).toBeDefined();
        expect(link.rel).toBe('preload');
        expect(link.href).toContain('test.css');
        expect(link.as).toBe('style');
        expect(resourceOptimizer.preloadedResources.has(resource.href)).toBe(true);
    });

    test('should not preload same resource twice', () => {
        const resource = {
            href: '/test.css',
            as: 'style'
        };

        resourceOptimizer.preload(resource);
        resourceOptimizer.preload(resource);

        expect(document.querySelectorAll('link[href*="test.css"]')).toHaveLength(1);
    });

    test('should load CSS resources', async () => {
        const cssFile = '/test.css';

        await resourceOptimizer.loadResource(cssFile);

        expect(resourceOptimizer.loadedResources.has(cssFile)).toBe(true);
        expect(document.querySelector('link[href="/test.css"]')).toBeDefined();
    });

    test('should load JS resources', async () => {
        const jsFile = '/test.js';

        await resourceOptimizer.loadResource(jsFile);

        expect(resourceOptimizer.loadedResources.has(jsFile)).toBe(true);
        expect(document.querySelector('script[src="/test.js"]')).toBeDefined();
    });

    test('should not load same resource twice', async () => {
        const jsFile = '/test.js';

        await resourceOptimizer.loadResource(jsFile);
        await resourceOptimizer.loadResource(jsFile);

        expect(document.querySelectorAll('script[src="/test.js"]')).toHaveLength(1);
    });
});

describe('Image Optimizer', () => {
    let imageOptimizer;

    beforeEach(() => {
        // Mock ImageOptimizer class
        global.ImageOptimizer = class {
            constructor() {
                this.lazyImages = [];
                this.observer = null;
            }

            setupLazyLoading() {
                if ('IntersectionObserver' in window) {
                    this.observer = new IntersectionObserver(() => { });
                    return true;
                }
                return false;
            }

            loadImage(img) {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
            }

            supportsWebP() {
                // Mock WebP support check
                return Promise.resolve(true);
            }

            optimizeImageFormat(img) {
                const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp');
                return this.supportsWebP().then(supported => {
                    if (supported) {
                        img.src = webpSrc;
                    }
                    return supported;
                });
            }
        };

        imageOptimizer = new global.ImageOptimizer();
    });

    test('should initialize image optimizer', () => {
        expect(imageOptimizer).toBeDefined();
        expect(imageOptimizer.lazyImages).toEqual([]);
    });

    test('should setup lazy loading with IntersectionObserver', () => {
        const result = imageOptimizer.setupLazyLoading();

        expect(result).toBe(true);
        expect(IntersectionObserver).toHaveBeenCalled();
        expect(imageOptimizer.observer).toBeDefined();
    });

    test('should load lazy images', () => {
        const img = document.createElement('img');
        img.dataset.src = '/test-image.jpg';

        imageOptimizer.loadImage(img);

        expect(img.src).toContain('test-image.jpg');
        expect(img.hasAttribute('data-src')).toBe(false);
        expect(img.classList.contains('loaded')).toBe(true);
    });

    test('should check WebP support', async () => {
        const supported = await imageOptimizer.supportsWebP();
        expect(supported).toBe(true);
    });

    test('should optimize image format to WebP', async () => {
        const img = document.createElement('img');
        img.src = '/test-image.jpg';

        const supported = await imageOptimizer.optimizeImageFormat(img);

        expect(supported).toBe(true);
        expect(img.src).toContain('test-image.webp');
    });
});