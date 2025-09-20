/**
 * ANIMATION CONTROLLER MODULE
 * Handles scroll animations, intersection observer, and visual effects
 * @module animations
 */

import { PERFORMANCE_CONFIG, prefersReducedMotion, randomBetween, getDeviceType } from '../utils/utilities.js';

let observer = null;
let isObserverInitialized = false;

/**
 * Initialize intersection observer for scroll animations
 */
export const initializeScrollAnimations = () => {
    if (isObserverInitialized || prefersReducedMotion()) {
        // If reduced motion is preferred, show all elements immediately
        if (prefersReducedMotion()) {
            revealAllElements();
        }
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: PERFORMANCE_CONFIG.INTERSECTION_ROOT_MARGIN,
        threshold: PERFORMANCE_CONFIG.INTERSECTION_THRESHOLD
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const animationType = target.dataset.animation || 'fade-in';
                const delay = parseInt(target.dataset.delay) || 0;

                setTimeout(() => {
                    animateElement(target, animationType);

                    // Handle skill progress bars
                    if (target.classList.contains('skill-card')) {
                        animateSkillProgress(target);
                    }
                }, delay);

                // Stop observing once animated (except skill cards for re-animation)
                if (!target.classList.contains('skill-card')) {
                    observer.unobserve(target);
                }
            }
        });
    };

    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(observerCallback, observerOptions);
        isObserverInitialized = true;

        // Observe all animated elements
        observeAnimatedElements();
    } else {
        // Fallback for older browsers
        revealAllElements();
    }
};

/**
 * Animate element based on animation type
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationType - Type of animation
 */
const animateElement = (element, animationType) => {
    element.classList.add('is-visible');

    switch (animationType) {
        case 'fade-in':
            element.classList.add('animate-fade-in');
            break;
        case 'slide-in-left':
            element.classList.add('animate-slide-left');
            break;
        case 'slide-in-right':
            element.classList.add('animate-slide-right');
            break;
        case 'slide-in-up':
            element.classList.add('animate-slide-up');
            break;
        case 'slide-in-down':
            element.classList.add('animate-slide-down');
            break;
        case 'zoom-in':
            element.classList.add('animate-zoom-in');
            break;
        case 'rotate-in':
            element.classList.add('animate-rotate-in');
            break;
        case 'pop-in':
            element.classList.add('animate-pop-in');
            break;
        case 'bounce-in':
            element.classList.add('animate-bounce-in');
            break;
        default:
            element.classList.add('animate-fade-in');
    }
};

/**
 * Animate skill progress bars
 * @param {HTMLElement} skillCard - Skill card element
 */
const animateSkillProgress = (skillCard) => {
    const progressBar = skillCard.querySelector('.skill-progress');
    if (progressBar) {
        const progressValue = progressBar.dataset.progress || 75;
        progressBar.style.setProperty('--progress-width', `${progressValue}%`);
        progressBar.classList.add('is-visible');
    }
};

/**
 * Observe all elements that should be animated
 */
const observeAnimatedElements = () => {
    if (!observer) return;

    const selectors = [
        '.animate-on-scroll',
        '.section-title',
        '.skill-card',
        '.project-card',
        '.certification-card',
        '.article-card',
        '.note-card',
        '.testimonial-card',
        '#hero .animate-fade-in',
        '#about .animate-slide-left',
        '#about .animate-slide-right',
        '#contact .animate-fade-in',
        '#cta .animate-fade-in'
    ];

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            observer.observe(element);
        });
    });
};

/**
 * Reveal all elements immediately (fallback for older browsers or reduced motion)
 */
const revealAllElements = () => {
    const elements = document.querySelectorAll('.animate-on-scroll, .section-title, .skill-card');
    elements.forEach(element => {
        element.classList.add('is-visible');

        // Handle skill progress bars
        if (element.classList.contains('skill-card')) {
            animateSkillProgress(element);
        }
    });
};

/**
 * Create dynamic particles for hero section
 */
export const createParticleSystem = () => {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer || prefersReducedMotion()) return;

    const deviceType = getDeviceType();
    const isSmall = deviceType === 'mobile';
    const numberOfParticles = isSmall
        ? PERFORMANCE_CONFIG.MAX_PARTICLES.mobile
        : PERFORMANCE_CONFIG.MAX_PARTICLES.desktop;

    // Clear existing particles
    particlesContainer.innerHTML = '';

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    const colors = [
        'rgba(99, 102, 241,', // indigo
        'rgba(251, 191, 36,', // amber
        'rgba(129, 140, 248,', // indigo-light
        'rgba(165, 243, 252,', // cyan
        'rgba(236, 72, 153,' // pink
    ];

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        const size = randomBetween(isSmall ? 16 : 24, isSmall ? 56 : 84);
        const x = randomBetween(0, 100);
        const y = randomBetween(0, 100);
        const delay = randomBetween(0, 12);
        const duration = randomBetween(isSmall ? 18 : 22, isSmall ? 28 : 34);
        const opacity = randomBetween(0.1, 0.6);
        const blur = randomBetween(1, 4);

        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${randomColor} ${opacity});
            border-radius: 50%;
            top: ${y}%;
            left: ${x}%;
            animation: particleMove ${duration}s infinite alternate;
            animation-delay: ${delay}s;
            filter: blur(${blur}px);
            z-index: -1;
            will-change: transform, opacity;
            pointer-events: none;
        `;

        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
};

/**
 * Setup floating icons animation
 */
export const setupFloatingIcons = () => {
    const iconsContainer = document.querySelector('.floating-icons-container');
    if (!iconsContainer || prefersReducedMotion()) return;

    const deviceType = getDeviceType();
    const isSmall = deviceType === 'mobile';
    const numberOfIcons = isSmall
        ? PERFORMANCE_CONFIG.MAX_ICONS.mobile
        : PERFORMANCE_CONFIG.MAX_ICONS.desktop;

    const techIcons = [
        '⚡', '🚀', '💻', '🎨', '🔧', '⚙️', '📱', '🌟',
        '💡', '🔥', '⭐', '💎', '🎯', '🌈'
    ];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfIcons; i++) {
        const icon = document.createElement('div');
        const randomIcon = techIcons[Math.floor(Math.random() * techIcons.length)];
        const x = randomBetween(0, 100);
        const y = randomBetween(0, 100);
        const delay = randomBetween(0, 8);
        const duration = randomBetween(15, 25);
        const size = randomBetween(isSmall ? 24 : 32, isSmall ? 36 : 48);

        icon.className = 'floating-icon';
        icon.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            font-size: ${size}px;
            opacity: 0.6;
            animation: floatIcon ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
            z-index: -1;
            pointer-events: none;
            will-change: transform;
        `;
        icon.textContent = randomIcon;

        fragment.appendChild(icon);
    }

    iconsContainer.appendChild(fragment);
};

/**
 * Setup hero parallax effect
 */
export const setupHeroParallax = () => {
    if (prefersReducedMotion()) return;

    const heroSection = document.querySelector('#hero');
    if (!heroSection) return;

    const handleParallax = () => {
        const scrollY = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    };

    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(handleParallax);
            ticking = true;
        }
    };

    const onScroll = () => {
        requestTick();
        ticking = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
};

/**
 * Setup card tilt effect
 */
export const setupCardTilt = () => {
    if (prefersReducedMotion()) return;

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        let isHovering = false;

        const handleMouseMove = (e) => {
            if (!isHovering) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 4;
            const rotateY = (centerX - x) / 4;

            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                scale3d(1.05, 1.05, 1.05)
            `;
        };

        const handleMouseEnter = () => {
            isHovering = true;
            card.style.transition = 'transform 0.1s ease-out';
        };

        const handleMouseLeave = () => {
            isHovering = false;
            card.style.transition = 'transform 0.3s ease-out';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        // Touch support for mobile
        card.addEventListener('touchstart', handleMouseEnter);
        card.addEventListener('touchend', handleMouseLeave);
    });
};

/**
 * Animate elements on viewport entry
 * @param {HTMLElement} element - Element to animate
 */
export const animateOnEntry = (element) => {
    if (!element || prefersReducedMotion()) {
        if (element) element.classList.add('is-visible');
        return;
    }

    if (observer) {
        observer.observe(element);
    } else {
        element.classList.add('is-visible');
    }
};

/**
 * Create loading animation
 * @param {HTMLElement} container - Container for loading animation
 */
export const createLoadingAnimation = (container) => {
    if (!container) return;

    const loader = document.createElement('div');
    loader.className = 'loading-animation';
    loader.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
            <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Loading amazing content...</p>
    `;

    container.appendChild(loader);
    return loader;
};

/**
 * Remove loading animation
 * @param {HTMLElement} loader - Loading animation element
 */
export const removeLoadingAnimation = (loader) => {
    if (!loader) return;

    loader.style.opacity = '0';
    loader.style.transform = 'scale(0.8)';

    setTimeout(() => {
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
    }, 300);
};

/**
 * Initialize all animations
 */
export const initializeAnimations = () => {
    // Delay removing no-js class to avoid flicker
    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Initial reveal of viewport elements
            revealElementsInViewport();

            requestAnimationFrame(() => {
                document.documentElement.classList.remove('no-js');

                // Safety fallback
                setTimeout(() => {
                    const elements = document.querySelectorAll('.animate-on-scroll, .skill-progress');
                    elements.forEach(element => {
                        element.classList.add('is-visible');
                        if (element.classList.contains('skill-progress')) {
                            const value = element.dataset.progress || 75;
                            element.style.setProperty('--progress-width', `${value}%`);
                        }
                    });
                }, 200);
            });

            // Initialize scroll animations
            initializeScrollAnimations();

            // Create visual effects
            createParticleSystem();
            setupFloatingIcons();
            setupHeroParallax();
            setupCardTilt();

        } catch (error) {
            console.warn('Animation initialization failed:', error);
        }
    });
};

/**
 * Reveal elements currently in viewport
 */
const revealElementsInViewport = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;

        if (inView) {
            element.classList.add('is-visible');
        }
    });

    // Handle skill progress bars
    const skillProgressBars = document.querySelectorAll('.skill-card .skill-progress');
    skillProgressBars.forEach(element => {
        const rect = element.getBoundingClientRect();
        const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;

        if (inView) {
            const value = element.dataset.progress || 75;
            element.style.setProperty('--progress-width', `${value}%`);
            element.classList.add('is-visible');
        }
    });
};

export default {
    initializeScrollAnimations,
    createParticleSystem,
    setupFloatingIcons,
    setupHeroParallax,
    setupCardTilt,
    animateOnEntry,
    createLoadingAnimation,
    removeLoadingAnimation,
    initializeAnimations
};