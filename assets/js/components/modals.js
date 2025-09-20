/**
 * MODAL COMPONENT MODULE
 * Handles modal functionality including project details, LLM features, and general modals
 * @module modals
 */

import { sanitizeHTML, copyToClipboard, delay } from '../utils/utilities.js';

let openModals = new Set();

/**
 * Project data for modals
 */
const projectsData = {
    project1: {
        title: "E-commerce Platform",
        image: "https://placehold.co/800x500/3b82f6/ffffff?text=E-commerce+Platform",
        description: "This is a robust full-stack e-commerce solution designed to provide a seamless shopping experience. It features user authentication with secure password hashing, a comprehensive product catalog with advanced search and filtering capabilities, a dynamic shopping cart, and integrated payment processing via Stripe. The backend is built with Node.js and Express.js, utilizing MongoDB for flexible and scalable data storage. The frontend is a dynamic single-page application developed with React, ensuring a highly responsive and intuitive user interface across all devices. Implemented secure API endpoints and robust error handling.",
        technologies: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Stripe API", "JWT Auth"],
        liveDemo: "#",
        github: "#"
    },
    project2: {
        title: "Task Management App",
        image: "https://placehold.co/800x500/6366f1/ffffff?text=Task+Manager+App",
        description: "A highly interactive and collaborative task management application that helps individuals and teams organize their daily tasks efficiently. Key features include intuitive drag-and-drop functionality for easy task reordering and categorization, real-time updates across multiple connected devices, and robust user collaboration features allowing teams to manage projects together seamlessly. The application leverages Vue.js for a reactive and performant frontend and Firebase (specifically Firestore for real-time database and Firebase Authentication) for a fast, scalable, and secure backend solution.",
        technologies: ["Vue.js", "Firebase", "Drag & Drop API", "Firestore", "Vuex", "Realtime Sync"],
        liveDemo: "#",
        github: "#"
    },
    project3: {
        title: "Interactive Data Dashboard",
        image: "https://placehold.co/800x500/f59e0b/ffffff?text=Data+Dashboard",
        description: "An intuitive and dynamic data visualization dashboard built to provide actionable insights from complex datasets. It integrates D3.js for powerful and customizable charts (including interactive bar charts, line graphs, and pie charts) and React for managing the interactive UI components and state. Users can filter data by various parameters, zoom into specific time ranges, and explore trends with ease. This project demonstrates strong data handling, transformation, and visualization capabilities, making complex data understandable at a glance.",
        technologies: ["D3.js", "React", "Chart.js", "Data Visualization", "API Integration", "Responsive Charts"],
        liveDemo: "#",
        github: "#"
    },
    project4: {
        title: "Mobile App Concept (UI/UX)",
        image: "https://placehold.co/800x500/475569/ffffff?text=Mobile+App+Concept",
        description: "This project showcases the complete UI/UX design and high-fidelity prototyping for a modern fitness tracking mobile application. The design process involved extensive user research, persona creation, user journey mapping, wireframing, and interactive mockups created in Figma. The focus was on creating an intuitive and engaging user experience, including features like personalized workout tracking, progress visualization, nutrition logging, and social sharing. A detailed case study outlines the design decisions, user flows, and usability testing insights.",
        technologies: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Usability Testing", "Mobile UI"],
        liveDemo: "#",
        github: "#"
    },
    project5: {
        title: "Personal Blog Platform",
        image: "https://placehold.co/800x500/6b7280/ffffff?text=Blog+Platform",
        description: "A custom-built personal blog platform designed for content creators and writers. It features a robust content management system (CMS), markdown support, and SEO optimization. The platform is built with Next.js for server-side rendering (SSR) and static site generation (SSG), providing extremely fast load times and a superior user experience. GraphQL is utilized for efficient and flexible data fetching from the CMS.",
        technologies: ["Next.js", "React", "GraphQL", "Strapi CMS", "Markdown", "SEO Optimization", "SSR/SSG"],
        liveDemo: "#",
        github: "#"
    },
    project6: {
        title: "Simple Game Development",
        image: "https://placehold.co/800x500/374151/ffffff?text=Game+Dev",
        description: "A fun, browser-based game developed using pure JavaScript and HTML Canvas. This project demonstrates fundamental game development mechanics from the ground up, including sprite animation, precise collision detection, dynamic score tracking, and basic physics simulations. It's a testament to building interactive experiences from scratch, understanding core game loop principles, and optimizing for browser performance.",
        technologies: ["JavaScript", "HTML Canvas", "Game Loop", "Collision Detection", "Basic Physics", "Web Audio API"],
        liveDemo: "#",
        github: "#"
    },
    project7: {
        title: "UI Dashboard Kit",
        image: "https://placehold.co/800x500/14b8a6/ffffff?text=Dashboard+Kit",
        description: "A reusable admin dashboard template with modular widgets, role-based access, charts, tables, and authentication flows. Built for speed and clarity.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js", "Vite"],
        liveDemo: "#",
        github: "#"
    },
    project8: {
        title: "SaaS Starter",
        image: "https://placehold.co/800x500/0ea5e9/ffffff?text=SaaS+Starter",
        description: "A production-ready starter for SaaS apps with subscriptions, teams, roles, email auth, and billing integration.",
        technologies: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Stripe"],
        liveDemo: "#",
        github: "#"
    },
    project9: {
        title: "Creator Portfolio",
        image: "https://placehold.co/800x500/6366f1/ffffff?text=Creator+Portfolio",
        description: "A sleek portfolio template for creators with Firebase CMS editing, image optimization, and SEO best practices.",
        technologies: ["Vue.js", "Firebase", "UI/UX", "SEO"],
        liveDemo: "#",
        github: "#"
    }
};

/**
 * Initialize modal functionality
 */
export const initializeModals = () => {
    setupProjectModals();
    setupLLMModals();
    setupKeyboardHandlers();
    setupClickOutsideHandlers();
};

/**
 * Setup project detail modals
 */
const setupProjectModals = () => {
    const projectCards = document.querySelectorAll('.project-card');
    const projectDetailModal = document.getElementById('project-detail-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    if (!projectDetailModal) return;

    // Add click listeners to project cards
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.dataset.projectId;
            openProjectModal(projectId);
        });
    });

    // Close modal button
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeProjectModal);
    }
};

/**
 * Setup LLM feature modals
 */
const setupLLMModals = () => {
    const openLlmInputModalButton = document.getElementById('open-llm-input-modal-button');
    const closeLlmInputModalButton = document.getElementById('close-llm-input-modal-button');
    const closeLlmDisplayModalButton = document.getElementById('close-llm-display-modal-button');
    const generateBriefButton = document.getElementById('generate-brief-button');
    const copyIdeaButton = document.getElementById('copy-idea-button');

    if (openLlmInputModalButton) {
        openLlmInputModalButton.addEventListener('click', openLlmInputModal);
    }

    if (closeLlmInputModalButton) {
        closeLlmInputModalButton.addEventListener('click', closeLlmInputModal);
    }

    if (closeLlmDisplayModalButton) {
        closeLlmDisplayModalButton.addEventListener('click', closeLlmDisplayModal);
    }

    if (generateBriefButton) {
        generateBriefButton.addEventListener('click', handleGenerateBrief);
    }

    if (copyIdeaButton) {
        copyIdeaButton.addEventListener('click', handleCopyBrief);
    }
};

/**
 * Setup keyboard event handlers for modals
 */
const setupKeyboardHandlers = () => {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && openModals.size > 0) {
            // Close the most recently opened modal
            const modalIds = Array.from(openModals);
            const lastModal = modalIds[modalIds.length - 1];
            closeModal(lastModal);
        }
    });
};

/**
 * Setup click outside handlers for modals
 */
const setupClickOutsideHandlers = () => {
    const modals = document.querySelectorAll('.modal, .modal-overlay');

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                const modalId = modal.id || modal.querySelector('[id]')?.id;
                if (modalId && openModals.has(modalId)) {
                    closeModal(modalId);
                }
            }
        });
    });
};

/**
 * Open project detail modal
 * @param {string} projectId - Project ID
 */
const openProjectModal = async (projectId) => {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = document.getElementById('project-detail-modal');
    const modalProjectTitle = document.getElementById('modal-project-title');
    const modalProjectImage = document.getElementById('modal-project-image');
    const modalProjectDescription = document.getElementById('modal-project-description');
    const modalProjectTech = document.getElementById('modal-project-tech');
    const modalLiveDemo = document.getElementById('modal-live-demo');
    const modalGithub = document.getElementById('modal-github');

    if (!modal || !modalProjectTitle) return;

    // Update modal content
    modalProjectTitle.textContent = project.title;
    modalProjectDescription.textContent = project.description;

    // Handle image loading with skeleton
    if (modalProjectImage) {
        modalProjectImage.classList.add('hidden');
        const skeleton = modalProjectImage.previousElementSibling;
        if (skeleton) skeleton.style.display = 'block';

        try {
            await loadImage(project.image);
            modalProjectImage.src = project.image;
            modalProjectImage.classList.remove('hidden');
            if (skeleton) skeleton.style.display = 'none';
        } catch (error) {
            console.error('Failed to load project image:', error);
            modalProjectImage.src = 'https://placehold.co/800x500/cccccc/333333?text=Image+Error';
            modalProjectImage.classList.remove('hidden');
            if (skeleton) skeleton.style.display = 'none';
        }
    }

    // Update technologies
    if (modalProjectTech) {
        modalProjectTech.innerHTML = '';
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full';
            span.textContent = tech;
            modalProjectTech.appendChild(span);
        });
    }

    // Update links
    if (modalLiveDemo) modalLiveDemo.href = project.liveDemo;
    if (modalGithub) modalGithub.href = project.github;

    // Open modal
    openModal('project-detail-modal');
};

/**
 * Close project modal
 */
const closeProjectModal = () => {
    closeModal('project-detail-modal');
};

/**
 * Open LLM input modal
 */
const openLlmInputModal = () => {
    const projectThemeInput = document.getElementById('project-theme-input');
    openModal('llm-input-modal');

    // Focus on input field after animation
    setTimeout(() => {
        if (projectThemeInput) projectThemeInput.focus();
    }, 100);
};

/**
 * Close LLM input modal
 */
const closeLlmInputModal = () => {
    closeModal('llm-input-modal');

    // Clear input field
    const projectThemeInput = document.getElementById('project-theme-input');
    if (projectThemeInput) {
        setTimeout(() => {
            projectThemeInput.value = '';
        }, 300);
    }
};

/**
 * Open LLM display modal
 * @param {string} content - Content to display
 */
const openLlmDisplayModal = (content = "Generating brief...") => {
    const llmIdeaContent = document.getElementById('llm-idea-content');
    if (llmIdeaContent) {
        llmIdeaContent.textContent = content;
    }
    openModal('llm-idea-display-modal');
};

/**
 * Close LLM display modal
 */
const closeLlmDisplayModal = () => {
    closeModal('llm-idea-display-modal');
};

/**
 * Handle generate brief button click
 */
const handleGenerateBrief = async () => {
    const projectThemeInput = document.getElementById('project-theme-input');
    if (!projectThemeInput) return;

    const theme = projectThemeInput.value.trim();
    if (!theme) {
        showNotification('Please enter a project theme!', 'warning');
        return;
    }

    closeLlmInputModal();
    openLlmDisplayModal(`Generating a detailed project brief based on your theme: ${theme}...`);

    try {
        const brief = await generateProjectBrief(theme);
        const llmIdeaContent = document.getElementById('llm-idea-content');
        if (llmIdeaContent) {
            llmIdeaContent.textContent = brief;
        }
    } catch (error) {
        console.error('Error generating project brief:', error);
        const llmIdeaContent = document.getElementById('llm-idea-content');
        if (llmIdeaContent) {
            llmIdeaContent.textContent = 'Failed to generate project brief. Please try again.';
        }
    }
};

/**
 * Handle copy brief button click
 */
const handleCopyBrief = async () => {
    const llmIdeaContent = document.getElementById('llm-idea-content');
    if (!llmIdeaContent) return;

    const textToCopy = llmIdeaContent.textContent;

    if (!textToCopy ||
        textToCopy.startsWith("Generating") ||
        textToCopy.startsWith("Failed") ||
        textToCopy.startsWith("Error")) {
        showNotification('Nothing to copy yet or generation is still in progress!', 'warning');
        return;
    }

    try {
        const success = await copyToClipboard(textToCopy);
        if (success) {
            showNotification('Project brief copied to clipboard!', 'success');
        } else {
            throw new Error('Clipboard API failed');
        }
    } catch (error) {
        console.error('Failed to copy text:', error);
        showNotification('Failed to copy the brief. Please copy it manually.', 'error');
    }
};

/**
 * Generate project brief (local template-based)
 * @param {string} theme - Project theme
 * @returns {Promise<string>} Generated brief
 */
const generateProjectBrief = async (theme) => {
    // Simulate API delay
    await delay(1500);

    const sanitizedTheme = sanitizeHTML(theme);
    const capitalizedTheme = sanitizedTheme.charAt(0).toUpperCase() + sanitizedTheme.slice(1);

    return `Project Title: ${capitalizedTheme} — Modern Web App

Overview:
A polished, responsive ${sanitizedTheme} designed to deliver a fast, accessible, and delightful user experience. It focuses on real-world usability, clean architecture, and maintainability.

Core Features:
- Intuitive onboarding and clear navigation
- Mobile-first responsive UI with offline-friendly caching
- Real-time updates and optimistic UI (where applicable)
- Robust forms with validation and helpful feedback
- Accessible components, keyboard navigation, and dark mode

Suggested Tech Stack:
- Frontend: React/Vite or Next.js, Tailwind CSS
- Backend: Node.js with Express or serverless functions
- Database: PostgreSQL or MongoDB (Prisma/Drizzle ORM)
- Auth & APIs: JWT/OAuth, REST or GraphQL
- Tooling: ESLint, Prettier, Vitest/Jest

Target Audience:
- Users who need a reliable ${sanitizedTheme} with clear value and minimal friction.

Potential Challenges/Considerations:
- Designing scalable data models and efficient queries
- Balancing performance, accessibility, and visual polish`;
};

/**
 * Generic modal open function
 * @param {string} modalId - Modal element ID
 */
const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openModals.add(modalId);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Add animation class after a brief delay
    setTimeout(() => {
        modal.classList.add('is-visible');
    }, 10);
};

/**
 * Generic modal close function
 * @param {string} modalId - Modal element ID
 */
const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openModals.delete(modalId);
    modal.classList.remove('is-visible');

    // Re-enable scrolling if no modals are open
    if (openModals.size === 0) {
        document.body.style.overflow = '';
    }

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

/**
 * Load image with promise
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} Loaded image
 */
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Show notification message
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 */
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const iconMap = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    const colorMap = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    };

    notification.className = `
        fixed top-4 right-4 ${colorMap[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50
        transition-all duration-300 transform translate-x-full max-w-sm
    `;

    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-xl">${iconMap[type]}</span>
            <span class="flex-1">${sanitizeHTML(message)}</span>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
};

/**
 * Create custom modal
 * @param {Object} options - Modal options
 * @returns {HTMLElement} Created modal element
 */
export const createModal = (options = {}) => {
    const {
        id = `modal-${Date.now()}`,
        title = '',
        content = '',
        showCloseButton = true,
        className = '',
        onOpen = () => { },
        onClose = () => { }
    } = options;

    const modalHTML = `
        <div id="${id}" class="modal fixed inset-0 bg-black bg-opacity-50 z-50 hidden ${className}" style="display: none;">
            <div class="modal-content bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 relative transform scale-90 opacity-0 transition-all duration-300" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9);">
                ${title ? `<h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">${title}</h2>` : ''}
                ${showCloseButton ? `
                    <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                ` : ''}
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById(id);

    // Setup close button
    if (showCloseButton) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeCustomModal(id, onClose);
            });
        }
    }

    // Setup click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCustomModal(id, onClose);
        }
    });

    return modal;
};

/**
 * Open custom modal
 * @param {string} modalId - Modal ID
 * @param {Function} onOpen - Callback on open
 */
const openCustomModal = (modalId, onOpen = () => { }) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openModals.add(modalId);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.transform = 'translate(-50%, -50%) scale(1)';
            content.style.opacity = '1';
        }
        onOpen();
    }, 10);
};

/**
 * Close custom modal
 * @param {string} modalId - Modal ID
 * @param {Function} onClose - Callback on close
 */
const closeCustomModal = (modalId, onClose = () => { }) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    openModals.delete(modalId);

    const content = modal.querySelector('.modal-content');
    if (content) {
        content.style.transform = 'translate(-50%, -50%) scale(0.9)';
        content.style.opacity = '0';
    }

    if (openModals.size === 0) {
        document.body.style.overflow = '';
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        onClose();
    }, 300);
};

export default {
    initializeModals,
    openProjectModal,
    closeProjectModal,
    openLlmInputModal,
    closeLlmInputModal,
    openLlmDisplayModal,
    closeLlmDisplayModal,
    createModal,
    projectsData
};