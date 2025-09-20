/**
 * NAVIGATION COMPONENT MODULE
 * Handles navigation functionality, mobile menu, scroll spy, and scroll-to-top
 * @module navigation
 */

import { debounce, getElementOffset, smoothScrollTo } from '../utils/utilities.js';

let isInitialized = false;

/**
 * Initialize navigation functionality
 */
export const initializeNavigation = () => {
    if (isInitialized) return;

    setupMobileMenu();
    setupScrollSpy();
    setupScrollToTop();
    setupSmoothScrolling();

    isInitialized = true;
};

/**
 * Setup mobile menu functionality
 */
const setupMobileMenu = () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');

    if (!mobileMenuButton || !mobileMenu) return;

    // Toggle mobile menu
    const toggleMobileMenu = (show) => {
        if (show === undefined) {
            show = mobileMenu.classList.contains('hidden');
        }

        if (show) {
            mobileMenu.classList.remove('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            // Update hamburger icon to X
            updateHamburgerIcon(mobileMenuButton, true);

            if (overlay) {
                overlay.classList.remove('hidden');
            }
        } else {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';

            // Update X icon back to hamburger
            updateHamburgerIcon(mobileMenuButton, false);

            if (overlay) {
                overlay.classList.add('hidden');
            }
        }
    };

    // Mobile menu button click handler
    mobileMenuButton.addEventListener('click', () => {
        toggleMobileMenu();
    });

    // Close mobile menu when clicking a link
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    });

    // Close mobile menu when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu(false);
        }
    });

    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu(false);
        }
    }, 150));
};

/**
 * Update hamburger icon animation
 * @param {HTMLElement} button - Menu button element
 * @param {boolean} isOpen - Whether menu is open
 */
const updateHamburgerIcon = (button, isOpen) => {
    const lines = button.querySelectorAll('.hamburger-line');
    if (lines.length === 0) return;

    if (isOpen) {
        lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        lines[1].style.opacity = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        lines[0].style.transform = '';
        lines[1].style.opacity = '1';
        lines[2].style.transform = '';
    }
};

/**
 * Setup scroll spy functionality for navigation highlighting
 */
const setupScrollSpy = () => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    if (navLinks.length === 0) return;

    const sections = Array.from(navLinks)
        .map(link => {
            const href = link.getAttribute('href');
            const section = href ? document.querySelector(href) : null;
            return { link, section, href };
        })
        .filter(item => item.section);

    if (sections.length === 0) return;

    const updateActiveNavigation = () => {
        const scrollPosition = window.pageYOffset + 150; // Offset for fixed navbar

        let currentSection = null;

        sections.forEach(({ section }) => {
            const sectionTop = getElementOffset(section);
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section;
            }
        });

        // Remove active class from all links
        sections.forEach(({ link }) => {
            link.classList.remove('text-indigo-400', 'text-indigo-300', 'active-nav-link');
            link.parentElement?.classList.remove('active');
        });

        // Add active class to current section link
        if (currentSection) {
            const activeItem = sections.find(({ section }) => section === currentSection);
            if (activeItem) {
                activeItem.link.classList.add('text-indigo-400', 'active-nav-link');
                activeItem.link.parentElement?.classList.add('active');
            }
        }
    };

    // Debounced scroll handler for better performance
    const debouncedUpdateNav = debounce(updateActiveNavigation, 10);

    window.addEventListener('scroll', debouncedUpdateNav, { passive: true });

    // Initial call to set active state
    updateActiveNavigation();
};

/**
 * Setup scroll-to-top button functionality
 */
const setupScrollToTop = () => {
    const scrollToTopButton = document.getElementById('scroll-to-top');
    if (!scrollToTopButton) return;

    const toggleScrollButton = () => {
        const showButton = window.pageYOffset > 300;

        if (showButton) {
            scrollToTopButton.classList.remove('scale-0', 'opacity-0');
            scrollToTopButton.classList.add('scale-100', 'opacity-100');
            scrollToTopButton.setAttribute('aria-hidden', 'false');
        } else {
            scrollToTopButton.classList.remove('scale-100', 'opacity-100');
            scrollToTopButton.classList.add('scale-0', 'opacity-0');
            scrollToTopButton.setAttribute('aria-hidden', 'true');
        }
    };

    // Scroll button click handler
    scrollToTopButton.addEventListener('click', () => {
        smoothScrollTo(0, 0, 600);
    });

    // Show/hide scroll button on scroll
    const debouncedToggleButton = debounce(toggleScrollButton, 10);
    window.addEventListener('scroll', debouncedToggleButton, { passive: true });

    // Initial call
    toggleScrollButton();
};

/**
 * Setup smooth scrolling for anchor links
 */
const setupSmoothScrolling = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetElement = href ? document.querySelector(href) : null;

            if (targetElement) {
                e.preventDefault();

                // Calculate offset for fixed header
                const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
                const targetPosition = getElementOffset(targetElement) - headerHeight;

                smoothScrollTo(targetPosition, 0, 800);

                // Update URL without triggering scroll
                history.pushState(null, '', href);

                // Focus target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.removeAttribute('tabindex');
            }
        });
    });
};

/**
 * Create navigation breadcrumbs
 * @param {Array} items - Breadcrumb items [{text: string, href?: string}]
 * @param {HTMLElement} container - Container element for breadcrumbs
 */
export const createBreadcrumbs = (items, container) => {
    if (!container || !items.length) return;

    const breadcrumbNav = document.createElement('nav');
    breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
    breadcrumbNav.className = 'breadcrumbs';

    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb-list flex items-center space-x-2 text-sm text-gray-600';

    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'breadcrumb-item';

        if (index > 0) {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator mx-2 text-gray-400';
            separator.textContent = '/';
            breadcrumbList.appendChild(separator);
        }

        if (item.href && index < items.length - 1) {
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'breadcrumb-link text-indigo-600 hover:text-indigo-800 transition-colors';
            link.textContent = item.text;
            listItem.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.className = 'breadcrumb-current text-gray-900 font-medium';
            span.setAttribute('aria-current', 'page');
            span.textContent = item.text;
            listItem.appendChild(span);
        }

        breadcrumbList.appendChild(listItem);
    });

    breadcrumbNav.appendChild(breadcrumbList);
    container.appendChild(breadcrumbNav);
};

/**
 * Update page navigation state
 * @param {string} activeSection - Currently active section ID
 */
export const updateNavigationState = (activeSection) => {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSection}`) {
            link.classList.add('text-indigo-400', 'active-nav-link');
            link.parentElement?.classList.add('active');
        } else {
            link.classList.remove('text-indigo-400', 'active-nav-link');
            link.parentElement?.classList.remove('active');
        }
    });
};

/**
 * Get current active section
 * @returns {string|null} Active section ID
 */
export const getCurrentSection = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 150;

    for (const section of sections) {
        const sectionTop = getElementOffset(section);
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            return section.id;
        }
    }

    return null;
};

/**
 * Navigate to section programmatically
 * @param {string} sectionId - Section ID to navigate to
 * @param {number} offset - Additional offset
 */
export const navigateToSection = (sectionId, offset = 0) => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const headerHeight = document.querySelector('nav')?.offsetHeight || 80;
    const targetPosition = getElementOffset(section) - headerHeight + offset;

    smoothScrollTo(targetPosition, 0, 800);
    history.pushState(null, '', `#${sectionId}`);
};

export default {
    initializeNavigation,
    createBreadcrumbs,
    updateNavigationState,
    getCurrentSection,
    navigateToSection
};