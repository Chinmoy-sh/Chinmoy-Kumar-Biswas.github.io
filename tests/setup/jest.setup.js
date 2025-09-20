/**
 * Test Setup and Utilities
 * Jest setup file with global configurations and mocks
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback, options) {
        this.callback = callback;
        this.options = options;
    }

    observe() {
        return null;
    }

    disconnect() {
        return null;
    }

    unobserve() {
        return null;
    }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }

    observe() {
        return null;
    }

    disconnect() {
        return null;
    }

    unobserve() {
        return null;
    }
};

// Mock PerformanceObserver
global.PerformanceObserver = class PerformanceObserver {
    constructor(callback) {
        this.callback = callback;
    }

    observe() {
        return null;
    }

    disconnect() {
        return null;
    }

    takeRecords() {
        return [];
    }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => {
    return setTimeout(callback, 16);
};

global.cancelAnimationFrame = id => {
    clearTimeout(id);
};

// Mock requestIdleCallback
global.requestIdleCallback = callback => {
    return setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 1);
};

global.cancelIdleCallback = id => {
    clearTimeout(id);
};

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
        text: () => Promise.resolve(''),
        blob: () => Promise.resolve(new Blob()),
        headers: new Headers(),
        status: 200,
        statusText: 'OK',
    })
);

// Mock console methods for cleaner test output
const originalError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };
});

afterAll(() => {
    console.error = originalError;
});

// Global test utilities
global.testUtils = {
    // Wait for async operations
    waitFor: (callback, timeout = 1000) => {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                try {
                    const result = callback();
                    if (result) {
                        clearInterval(interval);
                        resolve(result);
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject(error);
                }
            }, 10);

            setTimeout(() => {
                clearInterval(interval);
                reject(new Error('Timeout'));
            }, timeout);
        });
    },

    // Create mock element
    createElement: (tagName, attributes = {}) => {
        const element = document.createElement(tagName);
        Object.assign(element, attributes);
        return element;
    },

    // Simulate events
    fireEvent: (element, eventType, options = {}) => {
        const event = new Event(eventType, { bubbles: true, cancelable: true, ...options });
        element.dispatchEvent(event);
        return event;
    }
};

// Setup DOM environment
beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Reset all mocks
    jest.clearAllMocks();

    // Reset localStorage and sessionStorage
    localStorageMock.clear();
    sessionStorageMock.clear();
});

// Cleanup after each test
afterEach(() => {
    // Clean up any timers
    jest.clearAllTimers();

    // Clean up DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
});