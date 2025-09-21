/**
 * ===============================================
 * ACCESSIBILITY COMPLIANCE SYSTEM
 * Professional Portfolio by Chinmoy Kumar Biswas
 * Version: 2.0.0
 * ===============================================
 */

class AccessibilityManager {
    constructor(options = {}) {
        this.config = {
            enableKeyboardNavigation: true,
            enableScreenReaderSupport: true,
            enableFocusManagement: true,
            enableColorContrastCheck: true,
            enableMotionReduction: true,
            enableAriaLiveRegions: true,
            autoFixIssues: true,
            logIssues: true,
            ...options
        };

        this.focusableElements = [];
        this.currentFocusIndex = 0;
        this.announcements = [];
        this.contrastIssues = [];

        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
        this.setupMotionReduction();
        this.setupAriaLiveRegions();
        this.checkColorContrast();
        this.fixCommonIssues();
        this.setupSkipLinks();
        this.monitorDynamicContent();

        console.log('♿ Accessibility management system initialized');
    }

    setupKeyboardNavigation() {
        if (!this.config.enableKeyboardNavigation) return;

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'Tab':
                    this.handleTabNavigation(event);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(event);
                    break;
                case 'Escape':
                    this.handleEscape(event);
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowNavigation(event);
                    break;
                case 'Home':
                case 'End':
                    this.handleHomeEnd(event);
                    break;
            }
        });

        // Update focusable elements periodically
        setInterval(() => {
            this.updateFocusableElements();
        }, 1000);

        this.updateFocusableElements();
    }

    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), ' +
            'select:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        )).filter(element => {
            return this.isVisible(element) && !this.isInert(element);
        });
    }

    handleTabNavigation(event) {
        // Enhanced tab navigation with better focus management
        const activeElement = document.activeElement;
        const currentIndex = this.focusableElements.indexOf(activeElement);

        if (event.shiftKey) {
            // Shift + Tab (backward)
            if (currentIndex <= 0) {
                event.preventDefault();
                this.focusableElements[this.focusableElements.length - 1]?.focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex >= this.focusableElements.length - 1) {
                event.preventDefault();
                this.focusableElements[0]?.focus();
            }
        }

        // Announce focus changes for screen readers
        setTimeout(() => {
            this.announceFocusChange(document.activeElement);
        }, 100);
    }

    handleActivation(event) {
        const target = event.target;

        // Handle custom interactive elements
        if (target.hasAttribute('role')) {
            const role = target.getAttribute('role');

            if (['button', 'tab', 'menuitem', 'option'].includes(role)) {
                event.preventDefault();
                target.click();
            }
        }

        // Handle expandable elements
        if (target.hasAttribute('aria-expanded')) {
            event.preventDefault();
            this.toggleExpanded(target);
        }
    }

    handleEscape(event) {
        // Close modals, dropdowns, etc.
        const modal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        const dropdown = document.querySelector('[aria-expanded="true"]');

        if (modal) {
            this.closeModal(modal);
        } else if (dropdown) {
            this.collapseElement(dropdown);
        }
    }

    handleArrowNavigation(event) {
        const target = event.target;
        const role = target.getAttribute('role');

        // Handle arrow navigation in menus, tabs, etc.
        if (['tab', 'menuitem', 'option'].includes(role)) {
            event.preventDefault();

            const container = target.closest('[role="tablist"], [role="menu"], [role="listbox"]');
            if (container) {
                this.navigateInContainer(container, event.key, target);
            }
        }
    }

    handleHomeEnd(event) {
        const target = event.target;
        const role = target.getAttribute('role');

        if (['tab', 'menuitem', 'option'].includes(role)) {
            event.preventDefault();

            const container = target.closest('[role="tablist"], [role="menu"], [role="listbox"]');
            if (container) {
                const items = Array.from(container.querySelectorAll(`[role="${role}"]`));

                if (event.key === 'Home') {
                    items[0]?.focus();
                } else {
                    items[items.length - 1]?.focus();
                }
            }
        }
    }

    setupScreenReaderSupport() {
        if (!this.config.enableScreenReaderSupport) return;

        // Add landmark roles where missing
        this.addLandmarkRoles();

        // Improve headings hierarchy
        this.fixHeadingHierarchy();

        // Add missing labels
        this.addMissingLabels();

        // Set up proper descriptions
        this.addDescriptions();

        // Handle dynamic content announcements
        this.setupDynamicAnnouncements();
    }

    addLandmarkRoles() {
        const landmarks = [
            { selector: 'nav:not([role])', role: 'navigation' },
            { selector: 'main:not([role])', role: 'main' },
            { selector: 'aside:not([role])', role: 'complementary' },
            { selector: 'footer:not([role])', role: 'contentinfo' },
            { selector: 'header:not([role])', role: 'banner' }
        ];

        landmarks.forEach(({ selector, role }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.setAttribute('role', role);
            });
        });
    }

    fixHeadingHierarchy() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let lastLevel = 0;
        let issues = 0;

        headings.forEach((heading, index) => {
            const currentLevel = parseInt(heading.tagName.charAt(1));

            if (index === 0 && currentLevel !== 1) {
                this.logAccessibilityIssue('First heading should be h1', heading);
                issues++;
            }

            if (currentLevel > lastLevel + 1) {
                this.logAccessibilityIssue(`Heading level skipped from h${lastLevel} to h${currentLevel}`, heading);
                issues++;
            }

            lastLevel = currentLevel;
        });

        if (issues === 0) {
            console.log('✅ Heading hierarchy is properly structured');
        }
    }

    addMissingLabels() {
        // Form inputs without labels
        const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([id])');
        unlabeledInputs.forEach(input => {
            if (!this.hasAssociatedLabel(input)) {
                const label = this.generateLabel(input);
                input.setAttribute('aria-label', label);
                this.logAccessibilityIssue('Added missing label', input);
            }
        });

        // Buttons without accessible names
        const unlabeledButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby]):empty');
        unlabeledButtons.forEach(button => {
            const icon = button.querySelector('i, svg');
            if (icon) {
                button.setAttribute('aria-label', this.inferButtonLabel(button));
                this.logAccessibilityIssue('Added missing button label', button);
            }
        });

        // Links without accessible names
        const unlabeledLinks = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        unlabeledLinks.forEach(link => {
            if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
                link.setAttribute('aria-label', this.inferLinkLabel(link));
                this.logAccessibilityIssue('Added missing link label', link);
            }
        });
    }

    addDescriptions() {
        // Add descriptions for complex interactive elements
        const complexElements = document.querySelectorAll('[role="tab"], [role="button"][aria-expanded]');

        complexElements.forEach(element => {
            if (!element.hasAttribute('aria-describedby')) {
                const description = this.generateDescription(element);
                if (description) {
                    const descId = `desc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const descElement = document.createElement('div');
                    descElement.id = descId;
                    descElement.className = 'sr-only';
                    descElement.textContent = description;
                    element.parentNode.insertBefore(descElement, element.nextSibling);
                    element.setAttribute('aria-describedby', descId);
                }
            }
        });
    }

    setupFocusManagement() {
        if (!this.config.enableFocusManagement) return;

        // Enhance focus visibility
        this.addFocusStyles();

        // Focus trapping for modals
        this.setupFocusTrapping();

        // Focus restoration
        this.setupFocusRestoration();

        // Skip to content functionality
        this.addSkipToContentLink();
    }

    addFocusStyles() {
        const focusStyles = document.createElement('style');
        focusStyles.textContent = `
            .accessibility-focus-ring {
                outline: 2px solid var(--primary-color, #00f5ff) !important;
                outline-offset: 2px !important;
                border-radius: 4px !important;
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color, #00f5ff);
                color: var(--bg-primary, #0f0f23);
                padding: 8px;
                z-index: 10000;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(focusStyles);

        // Add focus ring to interactive elements
        document.addEventListener('focusin', (event) => {
            event.target.classList.add('accessibility-focus-ring');
        });

        document.addEventListener('focusout', (event) => {
            event.target.classList.remove('accessibility-focus-ring');
        });
    }

    setupSkipLinks() {
        const skipLinks = [
            { href: '#main', text: 'Skip to main content' },
            { href: '#navigation', text: 'Skip to navigation' },
            { href: '#footer', text: 'Skip to footer' }
        ];

        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';

        skipLinks.forEach(link => {
            const target = document.querySelector(link.href);
            if (target) {
                const skipLink = document.createElement('a');
                skipLink.href = link.href;
                skipLink.className = 'skip-link';
                skipLink.textContent = link.text;
                skipLinksContainer.appendChild(skipLink);
            }
        });

        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }

    setupMotionReduction() {
        if (!this.config.enableMotionReduction) return;

        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleMotionPreference = (mediaQuery) => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('reduce-motion');
                this.announceToScreenReader('Animations reduced for accessibility');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }
        };

        handleMotionPreference(prefersReducedMotion);
        prefersReducedMotion.addListener(handleMotionPreference);

        // Add CSS for reduced motion
        const motionStyles = document.createElement('style');
        motionStyles.textContent = `
            @media (prefers-reduced-motion: reduce) {
                *, ::before, ::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
            
            .reduce-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(motionStyles);
    }

    setupAriaLiveRegions() {
        if (!this.config.enableAriaLiveRegions) return;

        // Create live regions for announcements
        const liveRegions = [
            { id: 'aria-live-polite', level: 'polite' },
            { id: 'aria-live-assertive', level: 'assertive' }
        ];

        liveRegions.forEach(region => {
            if (!document.getElementById(region.id)) {
                const liveRegion = document.createElement('div');
                liveRegion.id = region.id;
                liveRegion.setAttribute('aria-live', region.level);
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                document.body.appendChild(liveRegion);
            }
        });
    }

    checkColorContrast() {
        if (!this.config.enableColorContrastCheck) return;

        // Basic contrast checking for text elements
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');

        textElements.forEach(element => {
            const styles = getComputedStyle(element);
            const backgroundColor = styles.backgroundColor;
            const color = styles.color;

            if (this.hasLowContrast(color, backgroundColor)) {
                this.contrastIssues.push(element);
                this.logAccessibilityIssue('Low color contrast detected', element);
            }
        });

        if (this.contrastIssues.length === 0) {
            console.log('✅ No obvious color contrast issues found');
        }
    }

    fixCommonIssues() {
        if (!this.config.autoFixIssues) return;

        // Add missing alt attributes to images
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(img => {
            img.alt = this.inferImageAlt(img);
            this.logAccessibilityIssue('Added missing alt attribute', img);
        });

        // Fix empty alt attributes for decorative images
        const decorativeImages = document.querySelectorAll('img[alt=""]');
        decorativeImages.forEach(img => {
            if (!img.hasAttribute('role')) {
                img.setAttribute('role', 'presentation');
            }
        });

        // Add proper roles to interactive elements
        const clickableElements = document.querySelectorAll('[onclick]:not(button):not(a):not([role])');
        clickableElements.forEach(element => {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            this.logAccessibilityIssue('Added button role to clickable element', element);
        });

        // Fix missing form labels
        const formControls = document.querySelectorAll('input, select, textarea');
        formControls.forEach(control => {
            if (!this.hasAccessibleName(control)) {
                const label = this.findOrCreateLabel(control);
                if (label) {
                    this.logAccessibilityIssue('Associated label with form control', control);
                }
            }
        });
    }

    monitorDynamicContent() {
        // Monitor for dynamically added content
        if ('MutationObserver' in window) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.processNewContent(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    processNewContent(element) {
        // Apply accessibility fixes to new content
        const images = element.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.alt = this.inferImageAlt(img);
        });

        const interactiveElements = element.querySelectorAll('[onclick]:not([role])');
        interactiveElements.forEach(el => {
            el.setAttribute('role', 'button');
            el.setAttribute('tabindex', '0');
        });

        // Update focusable elements list
        this.updateFocusableElements();
    }

    // Utility methods
    isVisible(element) {
        const styles = getComputedStyle(element);
        return styles.display !== 'none' &&
            styles.visibility !== 'hidden' &&
            styles.opacity !== '0';
    }

    isInert(element) {
        return element.hasAttribute('inert') ||
            element.closest('[inert]') !== null;
    }

    hasAssociatedLabel(input) {
        return document.querySelector(`label[for="${input.id}"]`) !== null ||
            input.closest('label') !== null;
    }

    hasAccessibleName(element) {
        return element.hasAttribute('aria-label') ||
            element.hasAttribute('aria-labelledby') ||
            this.hasAssociatedLabel(element) ||
            element.textContent.trim().length > 0;
    }

    generateLabel(input) {
        const type = input.type || 'text';
        const placeholder = input.placeholder || '';
        const name = input.name || '';

        if (placeholder) return placeholder;
        if (name) return name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${type.charAt(0).toUpperCase() + type.slice(1)} input`;
    }

    inferImageAlt(img) {
        const src = img.src || '';
        const filename = src.split('/').pop().split('.')[0];
        return filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Image';
    }

    // Public API methods
    announceToScreenReader(message, priority = 'polite') {
        const liveRegion = document.getElementById(`aria-live-${priority}`);
        if (liveRegion) {
            liveRegion.textContent = message;

            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }

        this.announcements.push({ message, priority, timestamp: Date.now() });
    }

    focusElement(selector) {
        const element = document.querySelector(selector);
        if (element && this.focusableElements.includes(element)) {
            element.focus();
            return true;
        }
        return false;
    }

    checkAccessibility() {
        return {
            focusableElements: this.focusableElements.length,
            contrastIssues: this.contrastIssues.length,
            announcements: this.announcements.length,
            hasSkipLinks: document.querySelectorAll('.skip-link').length > 0,
            hasLiveRegions: document.querySelectorAll('[aria-live]').length > 0,
            landmarkRoles: document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"]').length
        };
    }

    logAccessibilityIssue(message, element) {
        if (this.config.logIssues) {
            console.warn('♿ Accessibility:', message, element);
        }
    }

    getAccessibilityReport() {
        return {
            timestamp: Date.now(),
            url: window.location.href,
            checks: this.checkAccessibility(),
            issues: this.contrastIssues.length,
            announcements: this.announcements,
            recommendations: this.getAccessibilityRecommendations()
        };
    }

    getAccessibilityRecommendations() {
        const recommendations = [];

        if (this.contrastIssues.length > 0) {
            recommendations.push('Improve color contrast for better readability');
        }

        if (document.querySelectorAll('img:not([alt])').length > 0) {
            recommendations.push('Add alt attributes to all images');
        }

        if (document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').length > 0) {
            recommendations.push('Ensure all form inputs have accessible labels');
        }

        return recommendations;
    }
}

// Initialize accessibility management
document.addEventListener('DOMContentLoaded', () => {
    const accessibilityManager = new AccessibilityManager({
        enableKeyboardNavigation: true,
        enableScreenReaderSupport: true,
        enableFocusManagement: true,
        enableColorContrastCheck: true,
        enableMotionReduction: true,
        enableAriaLiveRegions: true,
        autoFixIssues: true,
        logIssues: true
    });

    // Expose to global scope
    window.accessibilityManager = accessibilityManager;

    console.log('♿ Accessibility compliance system ready');
});

// export removed for non-module usage