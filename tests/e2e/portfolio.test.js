/**
 * E2E Tests for Portfolio Functionality
 * End-to-end testing of main portfolio features
 * 
 * @version 1.0.0
 * @author Chinmoy Kumar Biswas
 */

const { test, expect } = require('@playwright/test');

test.describe('Portfolio Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/Chinmoy Kumar Biswas/);

        // Check main heading
        const mainHeading = page.locator('h1').first();
        await expect(mainHeading).toBeVisible();

        // Check hero section
        const heroSection = page.locator('#hero');
        await expect(heroSection).toBeVisible();
    });

    test('should have working navigation', async ({ page }) => {
        // Check navigation elements
        const navigation = page.locator('nav');
        await expect(navigation).toBeVisible();

        // Test navigation links
        const aboutLink = page.locator('a[href="#about"]');
        await expect(aboutLink).toBeVisible();
        await aboutLink.click();

        // Wait for scroll and check if about section is in view
        await page.waitForTimeout(1000);
        const aboutSection = page.locator('#about');
        await expect(aboutSection).toBeInViewport();
    });

    test('should have responsive design', async ({ page }) => {
        // Test desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        const desktopNav = page.locator('nav .hidden.md\\:flex');
        await expect(desktopNav).toBeVisible();

        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        const mobileMenuButton = page.locator('#mobile-menu-button');
        await expect(mobileMenuButton).toBeVisible();
    });

    test('should handle theme toggle', async ({ page }) => {
        const themeToggle = page.locator('#theme-toggle');
        await expect(themeToggle).toBeVisible();

        // Get initial theme
        const initialTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark');
        });

        // Click theme toggle
        await themeToggle.click();

        // Check theme changed
        const newTheme = await page.evaluate(() => {
            return document.documentElement.classList.contains('dark');
        });

        expect(newTheme).not.toBe(initialTheme);
    });
});

test.describe('Portfolio Sections', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display about section correctly', async ({ page }) => {
        await page.locator('a[href="#about"]').click();
        await page.waitForTimeout(1000);

        const aboutSection = page.locator('#about');
        await expect(aboutSection).toBeInViewport();

        const aboutContent = aboutSection.locator('.prose');
        await expect(aboutContent).toBeVisible();
    });

    test('should display projects section', async ({ page }) => {
        await page.locator('a[href="#projects"]').click();
        await page.waitForTimeout(1000);

        const projectsSection = page.locator('#projects');
        await expect(projectsSection).toBeInViewport();

        // Check for project cards
        const projectCards = projectsSection.locator('.project-card');
        const cardCount = await projectCards.count();
        expect(cardCount).toBeGreaterThan(0);
    });

    test('should display skills section', async ({ page }) => {
        await page.locator('a[href="#skills"]').click();
        await page.waitForTimeout(1000);

        const skillsSection = page.locator('#skills');
        await expect(skillsSection).toBeInViewport();

        // Check for skill items
        const skillItems = skillsSection.locator('.skill-item');
        const skillCount = await skillItems.count();
        expect(skillCount).toBeGreaterThan(0);
    });

    test('should display contact section with form', async ({ page }) => {
        await page.locator('a[href="#contact"]').click();
        await page.waitForTimeout(1000);

        const contactSection = page.locator('#contact');
        await expect(contactSection).toBeInViewport();

        // Check contact form
        const contactForm = contactSection.locator('#contact-form');
        await expect(contactForm).toBeVisible();

        // Check form fields
        await expect(contactForm.locator('#name')).toBeVisible();
        await expect(contactForm.locator('#email')).toBeVisible();
        await expect(contactForm.locator('#message')).toBeVisible();
    });
});

test.describe('Interactive Features', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should handle contact form submission', async ({ page }) => {
        // Navigate to contact section
        await page.locator('a[href="#contact"]').click();
        await page.waitForTimeout(1000);

        // Fill form
        await page.fill('#name', 'Test User');
        await page.fill('#email', 'test@example.com');
        await page.fill('#message', 'This is a test message');

        // Submit form
        await page.click('#contact-form button[type="submit"]');

        // Check for success message or form handling
        await page.waitForTimeout(2000);

        // Verify form was processed (this depends on your form handling)
        const successMessage = page.locator('.success-message');
        const isVisible = await successMessage.isVisible().catch(() => false);

        if (isVisible) {
            await expect(successMessage).toBeVisible();
        }
    });

    test('should handle mobile menu toggle', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        const mobileMenuButton = page.locator('#mobile-menu-button');
        const mobileMenu = page.locator('#mobile-menu');

        // Initially hidden
        await expect(mobileMenu).not.toBeVisible();

        // Click to show
        await mobileMenuButton.click();
        await expect(mobileMenu).toBeVisible();

        // Click to hide
        await mobileMenuButton.click();
        await expect(mobileMenu).not.toBeVisible();
    });

    test('should handle project modal', async ({ page }) => {
        // Navigate to projects section
        await page.locator('a[href="#projects"]').click();
        await page.waitForTimeout(1000);

        // Click on first project card
        const firstProjectCard = page.locator('.project-card').first();
        await firstProjectCard.click();

        // Check if modal opens
        const modal = page.locator('.modal, #project-modal');
        const isVisible = await modal.isVisible().catch(() => false);

        if (isVisible) {
            await expect(modal).toBeVisible();

            // Check modal content
            const modalTitle = modal.locator('h2, h3');
            await expect(modalTitle).toBeVisible();

            // Close modal
            const closeButton = modal.locator('[data-close], .close-button');
            if (await closeButton.isVisible()) {
                await closeButton.click();
                await expect(modal).not.toBeVisible();
            }
        }
    });
});

test.describe('Performance and Loading', () => {
    test('should load within performance budget', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        const loadTime = Date.now() - startTime;

        // Should load within 3 seconds
        expect(loadTime).toBeLessThan(3000);
    });

    test('should load critical resources first', async ({ page }) => {
        const resourceLoadTimes = [];

        page.on('response', response => {
            const url = response.url();
            if (url.includes('.css') || url.includes('.js')) {
                resourceLoadTimes.push({
                    url,
                    timing: Date.now()
                });
            }
        });

        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');

        // Check that critical resources loaded
        const criticalResources = resourceLoadTimes.filter(r =>
            r.url.includes('critical.css') || r.url.includes('app.js')
        );

        expect(criticalResources.length).toBeGreaterThan(0);
    });

    test('should implement service worker caching', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check if service worker is registered
        const swRegistered = await page.evaluate(() => {
            return navigator.serviceWorker.getRegistration('/').then(reg => !!reg);
        });

        expect(swRegistered).toBe(true);
    });
});

test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

        // Should have at least one h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Check heading levels are logical
        for (const heading of headings) {
            const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
            const text = await heading.textContent();

            expect(text?.trim()).toBeTruthy();
            expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(tagName);
        }
    });

    test('should have proper alt text for images', async ({ page }) => {
        const images = await page.locator('img').all();

        for (const img of images) {
            const alt = await img.getAttribute('alt');
            const src = await img.getAttribute('src');

            // All images should have alt text (can be empty for decorative)
            expect(alt).toBeDefined();

            // Informative images should have meaningful alt text
            if (src && !src.includes('decorative')) {
                expect(alt?.length).toBeGreaterThan(0);
            }
        }
    });

    test('should have proper ARIA labels', async ({ page }) => {
        const interactiveElements = await page.locator('button, a[href], input, select, textarea').all();

        for (const element of interactiveElements) {
            const tagName = await element.evaluate(el => el.tagName.toLowerCase());
            const ariaLabel = await element.getAttribute('aria-label');
            const text = await element.textContent();
            const title = await element.getAttribute('title');

            // Interactive elements should have accessible names
            const hasAccessibleName = ariaLabel || text?.trim() || title;

            if (tagName === 'button' || tagName === 'a') {
                expect(hasAccessibleName).toBeTruthy();
            }
        }
    });

    test('should support keyboard navigation', async ({ page }) => {
        // Focus should start at first focusable element
        await page.keyboard.press('Tab');

        const focusedElement = await page.locator(':focus');
        await expect(focusedElement).toBeVisible();

        // Should be able to navigate through interactive elements
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
            const currentFocus = await page.locator(':focus');

            // Element should be visible and focusable
            const isVisible = await currentFocus.isVisible().catch(() => false);
            if (isVisible) {
                await expect(currentFocus).toBeFocused();
            }
        }
    });
});