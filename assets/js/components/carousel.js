/**
 * CAROUSEL COMPONENT MODULE
 * Handles testimonial carousel and other carousel functionality
 * @module carousel
 */

import { debounce } from '../utils/utilities.js';

let carousels = new Map();

/**
 * Initialize all carousels
 */
export const initializeCarousels = () => {
    // Initialize testimonial carousel
    const testimonialCarousel = document.getElementById('testimonials-carousel');
    if (testimonialCarousel) {
        initializeTestimonialCarousel();
    }

    // Initialize any other carousels
    const otherCarousels = document.querySelectorAll('[data-carousel]');
    otherCarousels.forEach(carousel => {
        const carouselId = carousel.id || `carousel-${Date.now()}`;
        initializeCarousel(carouselId, {
            container: carousel,
            autoplay: carousel.dataset.autoplay === 'true',
            interval: parseInt(carousel.dataset.interval) || 5000,
            showDots: carousel.dataset.showDots !== 'false',
            showArrows: carousel.dataset.showArrows !== 'false'
        });
    });
};

/**
 * Initialize testimonial carousel specifically
 */
const initializeTestimonialCarousel = () => {
    const carousel = document.getElementById('testimonials-carousel');
    const prevButton = document.getElementById('testimonial-prev');
    const nextButton = document.getElementById('testimonial-next');
    const dotsContainer = document.getElementById('testimonial-dots');

    if (!carousel) return;

    const carouselConfig = {
        container: carousel,
        prevButton,
        nextButton,
        dotsContainer,
        autoplay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        currentIndex: 0
    };

    carousels.set('testimonials', carouselConfig);

    // Create dots
    createTestimonialDots(carouselConfig);

    // Setup event listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide('testimonials');
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide('testimonials');
        });
    }

    // Start autoplay
    if (carouselConfig.autoplay) {
        startAutoplay('testimonials');
    }

    // Show first slide
    showSlide('testimonials', 0);

    // Pause on hover
    setupHoverPause('testimonials');
};

/**
 * Initialize a generic carousel
 * @param {string} carouselId - Carousel identifier
 * @param {Object} config - Carousel configuration
 */
export const initializeCarousel = (carouselId, config = {}) => {
    const {
        container,
        autoplay = false,
        interval = 5000,
        showDots = true,
        showArrows = true,
        infinite = true,
        slideWidth = '100%',
        slidesToShow = 1,
        slidesToScroll = 1
    } = config;

    if (!container) return;

    const slides = container.querySelectorAll('.carousel-slide, .slide');
    if (slides.length === 0) return;

    const carouselConfig = {
        container,
        slides: Array.from(slides),
        autoplay,
        interval,
        showDots,
        showArrows,
        infinite,
        slideWidth,
        slidesToShow,
        slidesToScroll,
        currentIndex: 0,
        isTransitioning: false,
        autoplayTimer: null
    };

    carousels.set(carouselId, carouselConfig);

    // Setup carousel structure
    setupCarouselStructure(carouselId);

    // Create navigation
    if (showDots) createDots(carouselId);
    if (showArrows) createArrows(carouselId);

    // Start autoplay
    if (autoplay) startAutoplay(carouselId);

    // Show first slide
    showSlide(carouselId, 0);

    // Setup responsive handling
    setupResponsiveHandling(carouselId);
};

/**
 * Setup carousel structure
 * @param {string} carouselId - Carousel identifier
 */
const setupCarouselStructure = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    const { container, slides } = config;

    // Wrap slides in carousel track
    const track = document.createElement('div');
    track.className = 'carousel-track';
    track.style.cssText = `
        display: flex;
        transition: transform 0.3s ease-in-out;
        width: 100%;
    `;

    // Move slides to track
    slides.forEach(slide => {
        slide.style.cssText = `
            flex: 0 0 ${config.slideWidth};
            width: ${config.slideWidth};
        `;
        track.appendChild(slide);
    });

    container.innerHTML = '';
    container.appendChild(track);
    container.style.overflow = 'hidden';

    // Update config with track reference
    config.track = track;
};

/**
 * Create navigation dots
 * @param {string} carouselId - Carousel identifier
 */
const createDots = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    let dotsContainer = config.dotsContainer;

    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots flex items-center justify-center space-x-2 mt-4';
        config.container.parentNode.appendChild(dotsContainer);
        config.dotsContainer = dotsContainer;
    }

    dotsContainer.innerHTML = '';

    config.slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot w-3 h-3 rounded-full bg-gray-400 transition-colors duration-200 hover:bg-gray-600';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

        dot.addEventListener('click', () => {
            showSlide(carouselId, index);
            if (config.autoplay) {
                resetAutoplay(carouselId);
            }
        });

        dotsContainer.appendChild(dot);
    });
};

/**
 * Create arrow navigation
 * @param {string} carouselId - Carousel identifier
 */
const createArrows = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    const { container } = config;

    // Previous button
    if (!config.prevButton) {
        const prevButton = document.createElement('button');
        prevButton.className = 'carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10';
        prevButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
        `;
        prevButton.setAttribute('aria-label', 'Previous slide');

        prevButton.addEventListener('click', () => {
            prevSlide(carouselId);
        });

        container.style.position = 'relative';
        container.appendChild(prevButton);
        config.prevButton = prevButton;
    }

    // Next button
    if (!config.nextButton) {
        const nextButton = document.createElement('button');
        nextButton.className = 'carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10';
        nextButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        `;
        nextButton.setAttribute('aria-label', 'Next slide');

        nextButton.addEventListener('click', () => {
            nextSlide(carouselId);
        });

        container.appendChild(nextButton);
        config.nextButton = nextButton;
    }
};

/**
 * Create testimonial dots specifically
 * @param {Object} config - Carousel configuration
 */
const createTestimonialDots = (config) => {
    const { container, dotsContainer } = config;
    if (!dotsContainer) return;

    const testimonials = container.querySelectorAll('.testimonial-card');
    dotsContainer.innerHTML = '';

    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'dot w-3 h-3 bg-gray-500 rounded-full cursor-pointer transition duration-300 hover:bg-gray-400';

        dot.addEventListener('click', () => {
            showSlide('testimonials', index);
            resetAutoplay('testimonials');
        });

        dotsContainer.appendChild(dot);
    });
};

/**
 * Show specific slide
 * @param {string} carouselId - Carousel identifier
 * @param {number} index - Slide index
 */
export const showSlide = (carouselId, index) => {
    const config = carousels.get(carouselId);
    if (!config || config.isTransitioning) return;

    const { slides, infinite, track, dotsContainer } = config;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    // Handle infinite scrolling
    if (infinite) {
        if (index >= totalSlides) {
            index = 0;
        } else if (index < 0) {
            index = totalSlides - 1;
        }
    } else {
        index = Math.max(0, Math.min(index, totalSlides - 1));
    }

    config.currentIndex = index;
    config.isTransitioning = true;

    // Update carousel position
    if (track) {
        const translateX = -index * 100;
        track.style.transform = `translateX(${translateX}%)`;
    } else {
        // Fallback for testimonial carousel
        config.container.style.transform = `translateX(-${index * 100}%)`;
    }

    // Update dots
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot, .carousel-dot');
        dots.forEach((dot, dotIndex) => {
            if (dotIndex === index) {
                dot.classList.add('active', 'bg-indigo-600');
                dot.classList.remove('bg-gray-400', 'bg-gray-500');
            } else {
                dot.classList.remove('active', 'bg-indigo-600');
                dot.classList.add('bg-gray-400');
            }
        });
    }

    // Reset transition flag after animation
    setTimeout(() => {
        config.isTransitioning = false;
    }, 300);
};

/**
 * Go to next slide
 * @param {string} carouselId - Carousel identifier
 */
export const nextSlide = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    showSlide(carouselId, config.currentIndex + 1);

    if (config.autoplay) {
        resetAutoplay(carouselId);
    }
};

/**
 * Go to previous slide
 * @param {string} carouselId - Carousel identifier
 */
export const prevSlide = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    showSlide(carouselId, config.currentIndex - 1);

    if (config.autoplay) {
        resetAutoplay(carouselId);
    }
};

/**
 * Start autoplay
 * @param {string} carouselId - Carousel identifier
 */
const startAutoplay = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config || !config.autoplay) return;

    // Clear existing timer
    if (config.autoplayTimer) {
        clearInterval(config.autoplayTimer);
    }

    config.autoplayTimer = setInterval(() => {
        nextSlide(carouselId);
    }, config.interval);
};

/**
 * Stop autoplay
 * @param {string} carouselId - Carousel identifier
 */
export const stopAutoplay = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config || !config.autoplayTimer) return;

    clearInterval(config.autoplayTimer);
    config.autoplayTimer = null;
};

/**
 * Reset autoplay timer
 * @param {string} carouselId - Carousel identifier
 */
const resetAutoplay = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config || !config.autoplay) return;

    stopAutoplay(carouselId);
    startAutoplay(carouselId);
};

/**
 * Setup hover pause functionality
 * @param {string} carouselId - Carousel identifier
 */
const setupHoverPause = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config || !config.autoplay) return;

    const { container } = config;

    container.addEventListener('mouseenter', () => {
        stopAutoplay(carouselId);
    });

    container.addEventListener('mouseleave', () => {
        startAutoplay(carouselId);
    });

    // Also pause on focus for accessibility
    container.addEventListener('focusin', () => {
        stopAutoplay(carouselId);
    });

    container.addEventListener('focusout', () => {
        startAutoplay(carouselId);
    });
};

/**
 * Setup responsive handling
 * @param {string} carouselId - Carousel identifier
 */
const setupResponsiveHandling = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    const handleResize = debounce(() => {
        // Recalculate positions and update display
        showSlide(carouselId, config.currentIndex);
    }, 150);

    window.addEventListener('resize', handleResize);
};

/**
 * Destroy carousel
 * @param {string} carouselId - Carousel identifier
 */
export const destroyCarousel = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    // Stop autoplay
    stopAutoplay(carouselId);

    // Remove event listeners and clean up
    // (Implementation depends on specific cleanup needs)

    carousels.delete(carouselId);
};

/**
 * Update carousel configuration
 * @param {string} carouselId - Carousel identifier
 * @param {Object} newConfig - New configuration options
 */
export const updateCarousel = (carouselId, newConfig) => {
    const config = carousels.get(carouselId);
    if (!config) return;

    Object.assign(config, newConfig);

    // Restart autoplay if needed
    if (config.autoplay) {
        resetAutoplay(carouselId);
    }
};

/**
 * Get carousel state
 * @param {string} carouselId - Carousel identifier
 * @returns {Object|null} Carousel state
 */
export const getCarouselState = (carouselId) => {
    const config = carousels.get(carouselId);
    if (!config) return null;

    return {
        currentIndex: config.currentIndex,
        totalSlides: config.slides.length,
        isAutoplay: !!config.autoplayTimer,
        isTransitioning: config.isTransitioning
    };
};

export default {
    initializeCarousels,
    initializeCarousel,
    showSlide,
    nextSlide,
    prevSlide,
    stopAutoplay,
    destroyCarousel,
    updateCarousel,
    getCarouselState
};