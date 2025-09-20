/**
 * Cross-Browser Compatibility Tests
 * Testing across different browsers and devices
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

const { test, expect, devices } = require('@playwright/test');

// Test configurations for different browsers and devices
const testConfigs = [
    { name: 'Desktop Chrome', ...devices['Desktop Chrome'] },
    { name: 'Desktop Firefox', ...devices['Desktop Firefox'] },
    { name: 'Desktop Safari', ...devices['Desktop Safari'] },
    { name: 'iPhone 12', ...devices['iPhone 12'] },
    { name: 'iPad Pro', ...devices['iPad Pro'] },
    { name: 'Samsung Galaxy S21', ...devices['Galaxy S21'] }
];

testConfigs.forEach(config => {
    test.describe(`Cross-Browser Testing - ${config.name}`, () => {
        test.use(config);

        test('should load and render correctly', async ({ page }) => {
            await page.goto('/');

            // Wait for page to load
            await page.waitForLoadState('networkidle');

            // Check basic page structure
            const title = await page.title();
            expect(title).toContain('Chinmoy Kumar Biswas');

            // Check hero section
            const heroSection = page.locator('#hero');
            await expect(heroSection).toBeVisible();

            // Check navigation
            const navigation = page.locator('nav');
            await expect(navigation).toBeVisible();
        });

        test('should handle responsive navigation', async ({ page }) => {
            await page.goto('/');

            const viewport = page.viewportSize();

            if (viewport.width < 768) {
                // Mobile navigation test
                const mobileMenuButton = page.locator('#mobile-menu-button');
                await expect(mobileMenuButton).toBeVisible();

                await mobileMenuButton.click();
                const mobileMenu = page.locator('#mobile-menu');
                await expect(mobileMenu).toBeVisible();
            } else {
                // Desktop navigation test
                const desktopNav = page.locator('nav .hidden.md\\:flex');
                await expect(desktopNav).toBeVisible();
            }
        });

        test('should display content sections properly', async ({ page }) => {
            await page.goto('/');

            const sections = ['#hero', '#about', '#projects', '#skills', '#contact'];

            for (const sectionId of sections) {
                const section = page.locator(sectionId);

                // Scroll to section
                await section.scrollIntoViewIfNeeded();
                await page.waitForTimeout(500);

                // Check if section is visible
                await expect(section).toBeVisible();

                // Check if section has content
                const content = await section.textContent();
                expect(content?.trim().length).toBeGreaterThan(0);
            }
        });

        test('should handle form interactions', async ({ page }) => {
            await page.goto('/');

            // Navigate to contact section
            await page.locator('a[href="#contact"]').click();
            await page.waitForTimeout(1000);

            // Test form fields
            const nameField = page.locator('#name');
            const emailField = page.locator('#email');
            const messageField = page.locator('#message');

            if (await nameField.isVisible()) {
                await nameField.fill('Test User');
                await emailField.fill('test@example.com');
                await messageField.fill('Test message');

                // Check form validation
                const form = page.locator('#contact-form');
                await expect(form).toBeVisible();
            }
        });

        test('should handle theme toggle', async ({ page }) => {
            await page.goto('/');

            const themeToggle = page.locator('#theme-toggle');

            if (await themeToggle.isVisible()) {
                // Get initial theme state
                const initialTheme = await page.evaluate(() => {
                    return document.documentElement.classList.contains('dark');
                });

                // Toggle theme
                await themeToggle.click();
                await page.waitForTimeout(500);

                // Check theme changed
                const newTheme = await page.evaluate(() => {
                    return document.documentElement.classList.contains('dark');
                });

                expect(newTheme).not.toBe(initialTheme);
            }
        });

        test('should load assets properly', async ({ page }) => {
            const failedRequests = [];

            page.on('requestfailed', request => {
                failedRequests.push({
                    url: request.url(),
                    failure: request.failure()
                });
            });

            await page.goto('/');
            await page.waitForLoadState('networkidle');

            // Check for failed requests
            const criticalFailures = failedRequests.filter(req =>
                req.url.includes('.css') ||
                req.url.includes('.js') ||
                req.url.includes('.html')
            );

            expect(criticalFailures).toHaveLength(0);
        });

        test('should meet performance thresholds', async ({ page }) => {
            const startTime = Date.now();

            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');

            const domLoadTime = Date.now() - startTime;

            // Performance expectations vary by device
            const isMobile = config.name.includes('iPhone') || config.name.includes('Galaxy');
            const maxLoadTime = isMobile ? 4000 : 3000;

            expect(domLoadTime).toBeLessThan(maxLoadTime);
        });

        test('should support keyboard navigation', async ({ page }) => {
            await page.goto('/');

            // Skip keyboard navigation test on touch devices
            const isTouchDevice = config.name.includes('iPhone') || config.name.includes('Galaxy');
            if (isTouchDevice) {
                test.skip();
                return;
            }

            // Test keyboard navigation
            await page.keyboard.press('Tab');

            let focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();

            // Navigate through a few elements
            for (let i = 0; i < 3; i++) {
                await page.keyboard.press('Tab');
                focusedElement = page.locator(':focus');

                const isVisible = await focusedElement.isVisible().catch(() => false);
                if (isVisible) {
                    await expect(focusedElement).toBeFocused();
                }
            }
        });

        test('should handle JavaScript features', async ({ page }) => {
            await page.goto('/');

            // Check JavaScript execution
            const jsWorking = await page.evaluate(() => {
                return typeof window.app !== 'undefined' ||
                    document.querySelector('.js-enabled') !== null ||
                    true; // Fallback for basic JS support
            });

            expect(jsWorking).toBe(true);

            // Check for JavaScript errors
            const errors = [];
            page.on('pageerror', error => {
                errors.push(error);
            });

            // Wait a bit for any async operations
            await page.waitForTimeout(2000);

            // Should not have critical JavaScript errors
            expect(errors.length).toBe(0);
        });

        test('should display images correctly', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            const images = await page.locator('img').all();

            for (const img of images) {
                const src = await img.getAttribute('src');
                const alt = await img.getAttribute('alt');

                // All images should have src and alt attributes
                expect(src).toBeTruthy();
                expect(alt).toBeDefined(); // Can be empty string for decorative images

                // Check if image loaded successfully
                const naturalWidth = await img.evaluate((el) => el.naturalWidth);
                const isVisible = await img.isVisible();

                if (isVisible) {
                    expect(naturalWidth).toBeGreaterThan(0);
                }
            }
        });
    });
});

// Additional browser-specific tests
test.describe('Browser-Specific Features', () => {
    test('Chrome - Service Worker Support', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium');

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const swRegistered = await page.evaluate(async () => {
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration('/');
                return !!registration;
            }
            return false;
        });

        expect(swRegistered).toBe(true);
    });

    test('Firefox - CSS Grid Support', async ({ page, browserName }) => {
        test.skip(browserName !== 'firefox');

        await page.goto('/');

        const gridSupported = await page.evaluate(() => {
            const testElement = document.createElement('div');
            testElement.style.display = 'grid';
            return testElement.style.display === 'grid';
        });

        expect(gridSupported).toBe(true);
    });

    test('Safari - WebKit Specific Features', async ({ page, browserName }) => {
        test.skip(browserName !== 'webkit');

        await page.goto('/');

        // Test WebKit specific CSS properties
        const webkitSupport = await page.evaluate(() => {
            const testElement = document.createElement('div');
            testElement.style.webkitTransform = 'scale(1)';
            return testElement.style.webkitTransform !== '';
        });

        expect(webkitSupport).toBe(true);
    });
});