/**
 * Playwright Configuration for E2E and Integration Testing
 * Cross-browser testing setup
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
    // Test directory
    testDir: '../',

    // Global timeout
    timeout: 30000,

    // Test patterns
    testMatch: [
        '**/e2e/**/*.test.js',
        '**/integration/**/*.test.js',
        '**/cross-browser/**/*.test.js'
    ],

    // Parallel execution
    fullyParallel: true,

    // Forbid test.only in CI
    forbidOnly: !!process.env.CI,

    // Retry configuration
    retries: process.env.CI ? 2 : 0,

    // Reporter configuration
    reporter: [
        ['html', { outputFolder: '../reports/playwright' }],
        ['json', { outputFile: '../reports/test-results.json' }],
        ['junit', { outputFile: '../reports/junit.xml' }]
    ],

    // Global test configuration
    use: {
        // Base URL for tests
        baseURL: 'http://localhost:3000',

        // Browser context options
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,

        // Screenshots and videos
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',

        // Action timeout
        actionTimeout: 10000
    },

    // Browser projects
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] }
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] }
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] }
        },
        {
            name: 'tablet',
            use: { ...devices['iPad Pro'] }
        }
    ],

    // Web server for testing
    webServer: {
        command: 'python -m http.server 3000',
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120000
    },

    // Output directory
    outputDir: '../reports/playwright-results',

    // Test metadata
    metadata: {
        project: 'Chinmoy Kumar Portfolio',
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'test'
    }
});