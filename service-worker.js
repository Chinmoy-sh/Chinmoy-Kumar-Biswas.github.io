/**
 * ===============================================
 * SERVICE WORKER - PWA FEATURES
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

const CACHE_NAME = 'chinmoy-portfolio-v2.0.0';
const STATIC_CACHE = 'static-v2.0.0';
const DYNAMIC_CACHE = 'dynamic-v2.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/variables.css',
    '/assets/css/base.css',
    '/assets/css/components.css',
    '/assets/css/animations.css',
    '/assets/css/layout.css',
    '/assets/js/main.js',
    '/assets/js/particles.js',
    '/assets/js/scroll-system.js',
    '/assets/js/theme-system.js',
    '/assets/js/mobile-navigation.js',
    '/assets/js/form-validation.js',
    '/assets/js/content-manager.js',
    '/data/portfolio-data.json',
    '/assets/images/chinmoy.png',
    '/manifest.json'
];

// External resources to cache dynamically
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('🔧 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Failed to cache static assets', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: Activating...');

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached content with network fallback
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other protocols
    if (!request.url.startsWith('http')) {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(request.url)) {
        event.respondWith(cacheFirst(request));
    } else if (isExternalResource(request.url)) {
        event.respondWith(staleWhileRevalidate(request));
    } else if (isAPIRequest(request.url)) {
        event.respondWith(networkFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

// Cache strategies
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);

        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return await caches.match('/offline.html') || new Response('Offline');
    }
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline fallback for navigation requests
        if (request.mode === 'navigate') {
            return await caches.match('/') || new Response('Offline');
        }

        return new Response('Offline', { status: 503 });
    }
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, return cached version
        return cachedResponse;
    });

    return cachedResponse || fetchPromise;
}

// Helper functions
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.endsWith(asset)) ||
        url.includes('/assets/') ||
        url.endsWith('.css') ||
        url.endsWith('.js') ||
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.jpeg') ||
        url.endsWith('.svg') ||
        url.endsWith('.ico');
}

function isExternalResource(url) {
    return EXTERNAL_RESOURCES.some(domain => url.includes(domain));
}

function isAPIRequest(url) {
    return url.includes('/api/') ||
        url.includes('/data/') ||
        url.endsWith('.json');
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync triggered');

    if (event.tag === 'contact-form-sync') {
        event.waitUntil(syncContactForm());
    }
});

async function syncContactForm() {
    try {
        const cache = await caches.open('form-submissions');
        const requests = await cache.keys();

        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                    console.log('✅ Form submission synced successfully');

                    // Notify all clients of successful sync
                    const clients = await self.clients.matchAll();
                    clients.forEach(client => {
                        client.postMessage({
                            type: 'FORM_SYNC_SUCCESS',
                            message: 'Your message was sent successfully!'
                        });
                    });
                }
            } catch (error) {
                console.error('❌ Failed to sync form submission:', error);
            }
        }
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    console.log('💬 Service Worker received message:', event.data);

    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
            case 'GET_VERSION':
                event.ports[0].postMessage({ version: CACHE_NAME });
                break;
            case 'CLEAR_CACHE':
                clearAllCaches().then(() => {
                    event.ports[0].postMessage({ success: true });
                });
                break;
        }
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

console.log('🔧 Service Worker loaded successfully');