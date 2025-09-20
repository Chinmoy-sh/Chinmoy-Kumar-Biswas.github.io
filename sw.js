/**
 * Portfolio Service Worker v2.0.0
 * Advanced caching and performance optimization
 */

// Import cache configuration (fallback to inline config if import fails)
let CacheStrategy, CacheManager, CACHE_CONFIG;

try {
    importScripts('assets/js/cache-config.js');
    // Access exported configuration
    if (typeof CACHE_CONFIG !== 'undefined') {
        // Configuration loaded successfully
    }
} catch (error) {
    console.warn('Failed to load cache config, using fallback');
    // Fallback configuration
    CACHE_CONFIG = {
        STATIC_CACHE: 'portfolio-static-v2.0.0',
        DYNAMIC_CACHE: 'portfolio-dynamic-v2.0.0',
        IMAGE_CACHE: 'portfolio-images-v2.0.0',
        CDN_CACHE: 'portfolio-cdn-v2.0.0'
    };
}

const CACHE_NAME = CACHE_CONFIG.STATIC_CACHE || 'portfolio-v2.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/critical.css',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/images/chinmoy.png',
    '/images/pro3.jpg',
    // Modular CSS files
    '/assets/css/main.css',
    '/assets/css/variables.css',
    '/assets/css/base.css',
    '/assets/css/layout.css',
    '/assets/css/components.css',
    '/assets/css/animations.css',
    // JavaScript modules
    '/assets/js/app.js',
    '/config/config.js'
];

const DYNAMIC_ASSETS = [
    // JS components (loaded on demand)
    '/assets/js/components/navigation.js',
    '/assets/js/components/modals.js',
    '/assets/js/components/theme.js',
    '/assets/js/components/carousel.js',
    '/assets/js/components/forms.js',
    '/assets/js/components/threeJS.js',
    // JS utilities
    '/assets/js/utils/utilities.js',
    '/assets/js/utils/serviceWorker.js',
    '/assets/js/utils/security.js',
    // JS animations
    '/assets/js/animations/scrollAnimations.js'
];

const CDN_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            // Cache critical assets first
            caches.open(CACHE_NAME).then((cache) => {
                console.log('Caching critical assets');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Pre-cache dynamic assets for faster loading
            caches.open(CACHE_NAME + '-dynamic').then((cache) => {
                console.log('Pre-caching dynamic assets');
                return cache.addAll(DYNAMIC_ASSETS).catch(err => {
                    console.warn('Some dynamic assets failed to cache:', err);
                });
            })
        ]).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== CACHE_NAME + '-dynamic') {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Advanced fetch strategy with performance optimization
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and non-HTTP(S) requests
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // Use advanced caching strategies if available
    if (typeof CacheStrategy !== 'undefined') {
        event.respondWith(handleAdvancedCaching(request));
    } else {
        // Fallback to basic caching strategy
        event.respondWith(handleBasicCaching(request));
    }
});

// Advanced caching handler
async function handleAdvancedCaching(request) {
    try {
        const config = CacheStrategy.getCacheStrategy(request);

        switch (config.strategy) {
            case 'cacheFirst':
                return await CacheStrategy.cacheFirst(request, config.cacheName, config.ttl);
            case 'networkFirst':
                return await CacheStrategy.networkFirst(request, config.cacheName, config.ttl);
            case 'staleWhileRevalidate':
                return await CacheStrategy.staleWhileRevalidate(request, config.cacheName, config.ttl);
            default:
                return await CacheStrategy.cacheFirst(request, config.cacheName, config.ttl);
        }
    } catch (error) {
        console.warn('Advanced caching failed, using fallback:', error);
        return await handleBasicCaching(request);
    }
}

// Basic caching fallback
async function handleBasicCaching(request) {
    const url = new URL(request.url);

    // Handle different types of requests with optimal strategies
    if (request.destination === 'document') {
        // HTML documents - Network first, cache fallback
        return await networkFirstStrategy(request);
    } else if (request.destination === 'style' || request.destination === 'script') {
        // CSS and JS - Cache first, network fallback
        return await cacheFirstStrategy(request);
    } else if (request.destination === 'image') {
        // Images - Cache first with long-term storage
        return await cacheFirstWithLongTermStorage(request);
    } else if (url.hostname !== location.hostname) {
        // CDN resources - Stale while revalidate
        return await staleWhileRevalidateStrategy(request);
    } else {
        // Default strategy
        return await cacheFirstStrategy(request);
    }
}

// Network first strategy (for HTML)
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || caches.match('/index.html');
    }
}

// Cache first strategy (for CSS/JS)
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('Failed to fetch resource:', request.url);
        throw error;
    }
}

// Cache first with long-term storage (for images)
async function cacheFirstWithLongTermStorage(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME + '-images');
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('Failed to fetch image:', request.url);
        throw error;
    }
}

// Stale while revalidate strategy (for CDN resources)
async function staleWhileRevalidateStrategy(request) {
    const cachedResponse = await caches.match(request);

    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(CACHE_NAME + '-cdn');
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => null);

    return cachedResponse || networkResponsePromise;
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'form-submission') {
        event.waitUntil(
            handleFormSubmissionSync()
        );
    }
});

async function handleFormSubmissionSync() {
    // Handle offline form submissions
    const formData = await getStoredFormData();
    if (formData) {
        try {
            // Attempt to submit stored form data
            await submitFormData(formData);
            await clearStoredFormData();
        } catch (error) {
            console.error('Background sync failed:', error);
        }
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Portfolio updated!',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('Chinmoy Kumar Portfolio', options)
    );
});

// Performance monitoring
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'PERFORMANCE_LOG') {
        console.log('Performance metrics:', event.data.data);
    }
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'contact-form') {
        event.waitUntil(processFormData());
    }
});

async function processFormData() {
    // Process any pending form submissions
    // This would integrate with your contact form handling
    console.log('Processing pending form data');
}

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: '/images/chinmoy.png',
                badge: '/images/chinmoy.png'
            })
        );
    }
});