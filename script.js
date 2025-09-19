// Defer removing `no-js` until initial elements are revealed to avoid flicker
function revealElementsInViewport() {
    const inView = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    };
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (inView(el)) el.classList.add('is-visible');
    });
    document.querySelectorAll('.skill-card .skill-progress').forEach(el => {
        if (inView(el)) {
            const v = el.dataset.progress || 75;
            el.style.setProperty('--progress-width', `${v}%`);
            el.classList.add('is-visible');
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    try {
        revealElementsInViewport();
        requestAnimationFrame(() => {
            document.documentElement.classList.remove('no-js');
            // Safety: ensure everything is visible shortly after, regardless of IO timing
            setTimeout(() => {
                document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
                document.querySelectorAll('.skill-progress').forEach(el => {
                    const v = el.dataset.progress || 75;
                    el.style.setProperty('--progress-width', `${v}%`);
                    el.classList.add('is-visible');
                });
            }, 200);
        });
    } catch { }
});

// --- DOM Elements ---

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const loadingSpinner = document.getElementById('loading-spinner');
const scrollToTopButton = document.getElementById('scroll-to-top');

const projectCards = document.querySelectorAll('.project-card');
const projectDetailModal = document.getElementById('project-detail-modal');
const closeModalButton = document.getElementById('close-modal-button');
const modalProjectTitle = document.getElementById('modal-project-title');
const modalProjectImage = document.getElementById('modal-project-image');
const modalProjectDescription = document.getElementById('modal-project-description');
const modalProjectTech = document.getElementById('modal-project-tech');
const modalLiveDemo = document.getElementById('modal-live-demo');
const modalGithub = document.getElementById('modal-github');

const contactForm = document.getElementById('contact-form'); // Reference to the contact form
const heroSection = document.getElementById('hero');

// LLM Feature elements
const openLlmInputModalButton = document.getElementById('open-llm-input-modal-button');
const llmInputModal = document.getElementById('llm-input-modal');
const closeLlmInputModalButton = document.getElementById('close-llm-input-modal-button');
const projectThemeInput = document.getElementById('project-theme-input');
const generateBriefButton = document.getElementById('generate-brief-button');

const llmIdeaDisplayModal = document.getElementById('llm-idea-display-modal');
const closeLlmDisplayModalButton = document.getElementById('close-llm-display-modal-button');
const llmIdeaContent = document.getElementById('llm-idea-content');
const copyIdeaButton = document.getElementById('copy-idea-button');

// Skill progress bars
const skillProgressBars = document.querySelectorAll('.skill-progress');

// Testimonial Carousel elements
const testimonialsCarousel = document.getElementById('testimonials-carousel');
const testimonialPrevButton = document.getElementById('testimonial-prev');
const testimonialNextButton = document.getElementById('testimonial-next');
const testimonialDotsContainer = document.getElementById('testimonial-dots');
let currentTestimonialIndex = 0;
let testimonialInterval;

// Theme Toggle elements
const themeToggleButtons = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
const themeIcons = document.querySelectorAll('#theme-icon, #mobile-theme-icon');

// Project Filter elements
const filterButtons = document.querySelectorAll('.filter-btn');
const allProjectCards = document.querySelectorAll('.project-card');
const tiltCandidates = document.querySelectorAll('.tilt-card');


// Project Data (for modal) - Expanded descriptions
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
        liveDemo: "#", // Link to a Behance or Dribbble case study
        github: "#" // Link to design files or a design repo
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
        liveDemo: "#", // Link to playable game
        github: "#"
    }
};
// Template projects synced with new cards
projectsData.project7 = {
    title: "UI Dashboard Kit",
    image: "https://placehold.co/800x500/14b8a6/ffffff?text=Dashboard+Kit",
    description: "A reusable admin dashboard template with modular widgets, role-based access, charts, tables, and authentication flows. Built for speed and clarity.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Chart.js", "Vite"],
    liveDemo: "#",
    github: "#"
};
projectsData.project8 = {
    title: "SaaS Starter",
    image: "https://placehold.co/800x500/0ea5e9/ffffff?text=SaaS+Starter",
    description: "A production-ready starter for SaaS apps with subscriptions, teams, roles, email auth, and billing integration.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Stripe"],
    liveDemo: "#",
    github: "#"
};
projectsData.project9 = {
    title: "Creator Portfolio",
    image: "https://placehold.co/800x500/6366f1/ffffff?text=Creator+Portfolio",
    description: "A sleek portfolio template for creators with Firebase CMS editing, image optimization, and SEO best practices.",
    technologies: ["Vue.js", "Firebase", "UI/UX", "SEO"],
    liveDemo: "#",
    github: "#"
};


// --- Mobile Menu Logic ---
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Loading Spinner Logic ---
// Hide spinner once the page content is fully loaded
window.addEventListener('load', () => {
    if (loadingSpinner) {
        loadingSpinner.classList.add('opacity-0');
        setTimeout(() => loadingSpinner.classList.add('hidden'), 500);
    }
});

// --- Scroll-to-Top Button Logic ---
window.addEventListener('scroll', () => {
    if (!scrollToTopButton) return;
    if (window.scrollY > 300) {
        scrollToTopButton.classList.remove('scale-0', 'opacity-0');
        scrollToTopButton.classList.add('scale-100', 'opacity-100');
    } else {
        scrollToTopButton.classList.remove('scale-100', 'opacity-100');
        scrollToTopButton.classList.add('scale-0', 'opacity-0');
    }
});

// --- Scrollspy for Navbar ---
const navLinks = document.querySelectorAll('nav a[href^="#"]');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
function onScrollSpy() {
    const fromTop = window.scrollY + 100; // offset for fixed navbar
    sections.forEach((section, idx) => {
        const link = navLinks[idx];
        if (!section) return;
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (fromTop >= top && fromTop < bottom) {
            link.classList.add('text-indigo-400');
        } else {
            link.classList.remove('text-indigo-400');
        }
    });
}
window.addEventListener('scroll', onScrollSpy);

if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll to top
        });
    });
}

// --- Intersection Observer for Scroll Animations ---
const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
const sectionTitles = document.querySelectorAll('.section-title');
const heroContent = document.querySelector('#hero .animate-fade-in');
const aboutImage = document.querySelector('#about .animate-slide-left');
const aboutText = document.querySelector('#about .animate-slide-right');
const contactSection = document.querySelector('#contact .animate-fade-in');
const ctaSection = document.querySelector('#cta .animate-fade-in');

// New sections added to be observed
const certificationCards = document.querySelectorAll('.certification-card');
const articleCards = document.querySelectorAll('.article-card');
const noteCards = document.querySelectorAll('.note-card'); // New: Notes cards


const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the element is visible
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const animationType = target.dataset.animation;
            const delay = parseInt(target.dataset.delay) || 0;

            setTimeout(() => {
                if (animationType === 'fade-in') {
                    target.classList.add('is-visible');
                } else if (animationType === 'slide-in-left') {
                    target.classList.add('is-visible', 'animate-slide-left');
                } else if (animationType === 'slide-in-right') {
                    target.classList.add('is-visible', 'animate-slide-right');
                } else if (animationType === 'zoom-in') {
                    target.classList.add('is-visible', 'animate-zoom-in');
                } else if (animationType === 'rotate-in') {
                    target.classList.add('is-visible', 'animate-rotate-in');
                } else if (animationType === 'pop-in') {
                    target.classList.add('is-visible', 'animate-pop-in');
                }
                else {
                    target.classList.add('is-visible'); // Default fade-in
                }

                // Animate skill progress bars when their parent card is visible
                if (target.classList.contains('skill-card')) {
                    const progressBar = target.querySelector('.skill-progress');
                    if (progressBar) {
                        const progressValue = progressBar.dataset.progress;
                        progressBar.style.setProperty('--progress-width', `${progressValue}%`);
                        progressBar.classList.add('is-visible');
                    }
                }

            }, delay);
            // Only unobserve if it's not a skill card, as skill cards might need re-animation on resize/re-scroll
            if (!target.classList.contains('skill-card')) {
                observer.unobserve(target); // Stop observing once animated
            }
        } else {
            // Do not hide elements once revealed; avoid flicker/disappearance
            // If you want re-animations later, consider toggling only specific cases.
        }
    });
};

let observer;
if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(observerCallback, observerOptions);
} else {
    // Fallback: reveal all animated elements immediately
    document.querySelectorAll('.animate-on-scroll').forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('.skill-progress').forEach(el => {
        const v = el.dataset.progress || 75;
        el.style.setProperty('--progress-width', `${v}%`);
        el.classList.add('is-visible');
    });
}

// Observe section titles
sectionTitles.forEach(title => {
    if (observer) observer.observe(title); else title.classList.add('is-visible');
});

// Observe elements with animate-on-scroll class
animateOnScrollElements.forEach(element => {
    if (observer) observer.observe(element); else element.classList.add('is-visible');
});

// Observe specific elements with custom animations
if (observer) {
    if (heroContent) observer.observe(heroContent);
    if (aboutImage) observer.observe(aboutImage);
    if (aboutText) observer.observe(aboutText);
    if (contactSection) observer.observe(contactSection);
    if (ctaSection) observer.observe(ctaSection);
} else {
    [heroContent, aboutImage, aboutText, contactSection, ctaSection].forEach(el => el && el.classList.add('is-visible'));
}

// Observe new certification cards
certificationCards.forEach(card => {
    if (observer) observer.observe(card); else card.classList.add('is-visible');
});

// Observe new article cards
articleCards.forEach(card => {
    if (observer) observer.observe(card); else card.classList.add('is-visible');
});

// Observe new note cards
noteCards.forEach(card => {
    if (observer) observer.observe(card); else card.classList.add('is-visible');
});

// Observe skill cards to trigger progress bar animations
document.querySelectorAll('.skill-card').forEach(card => {
    if (observer) observer.observe(card); else card.classList.add('is-visible');
});


// --- Project Detail Modal Logic ---

// Function to open the project modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (project) {
        modalProjectTitle.textContent = project.title;

        // Show skeleton loader first
        modalProjectImage.classList.add('hidden');
        modalProjectImage.previousElementSibling.style.display = 'block';

        // Load image and hide skeleton
        const img = new Image();
        img.onload = () => {
            modalProjectImage.src = project.image;
            modalProjectImage.classList.remove('hidden');
            modalProjectImage.previousElementSibling.style.display = 'none';
        };
        img.onerror = () => {
            console.error('Failed to load image for project modal:', project.image);
            // Fallback to a placeholder or hide skeleton anyway
            modalProjectImage.src = 'https://placehold.co/800x500/cccccc/333333?text=Image+Error';
            modalProjectImage.classList.remove('hidden');
            modalProjectImage.previousElementSibling.style.display = 'none';
        };
        img.src = project.image;


        modalProjectDescription.textContent = project.description;

        // Clear previous technologies and add new ones
        modalProjectTech.innerHTML = '';
        project.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'bg-indigo-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full';
            span.textContent = tech;
            modalProjectTech.appendChild(span);
        });

        modalLiveDemo.href = project.liveDemo;
        modalGithub.href = project.github;

        projectDetailModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        setTimeout(() => {
            projectDetailModal.classList.add('is-visible');
        }, 10); // Small delay for transition
    }
}

// Function to close the project modal
function closeProjectModal() {
    projectDetailModal.classList.remove('is-visible');
    document.body.style.overflow = ''; // Re-enable scrolling
    setTimeout(() => {
        projectDetailModal.classList.add('hidden');
    }, 300); // Wait for transition to finish
}

// Add click listeners to project cards
projectCards.forEach(card => {
    card.addEventListener('click', function () {
        const projectId = this.dataset.projectId;
        openProjectModal(projectId);
    });
});

// Add click listener to close modal button
if (closeModalButton) closeModalButton.addEventListener('click', closeProjectModal);

// Close modal if clicked outside content
if (projectDetailModal) {
    projectDetailModal.addEventListener('click', function (event) {
        if (event.target === projectDetailModal) {
            closeProjectModal();
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && projectDetailModal.classList.contains('is-visible')) {
        closeProjectModal();
    }
});

// --- Dynamic Particle Generation (for Hero Section) ---
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.particles-container');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (particlesContainer && !reduceMotion) {
        const isSmall = window.matchMedia('(max-width: 768px)').matches;
        const numberOfParticles = isSmall ? 12 : 22;
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            const size = (isSmall ? Math.random() * 40 + 16 : Math.random() * 60 + 24);
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 12;
            const duration = (isSmall ? Math.random() * 10 + 18 : Math.random() * 12 + 22);
            const opacity = Math.random() * 0.5 + 0.1; // Wider opacity range
            const blur = Math.random() * 3 + 1;

            const colors = ['rgba(99, 102, 241,', 'rgba(251, 191, 36,', 'rgba(129, 140, 248,', 'rgba(165, 243, 252,', 'rgba(236, 72, 153,']; // Added more colors
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

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
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Initialize floating icons and parallax
    try {
        setupFloatingIcons();
        setupHeroParallax();
        setupCardTilt();
    } catch (e) { console.warn('Enhancement init failed:', e); }
});

// --- Contact Form Submission (mailto:) with Validation ---
if (contactForm) contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const subjectError = document.getElementById('subject-error');
    const messageError = document.getElementById('message-error');

    let isValid = true;

    // Validate Name
    if (nameInput.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        nameError.classList.remove('hidden');
        isValid = false;
    } else {
        nameError.classList.add('hidden');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === '') {
        emailError.textContent = 'Email is required.';
        emailError.classList.remove('hidden');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.remove('hidden');
        isValid = false;
    } else {
        emailError.classList.add('hidden');
    }

    // Validate Subject
    if (subjectInput.value.trim() === '') {
        subjectError.textContent = 'Subject is required.';
        subjectError.classList.remove('hidden');
        isValid = false;
    } else {
        subjectError.classList.add('hidden');
    }

    // Validate Message
    if (messageInput.value.trim() === '') {
        messageError.textContent = 'Message is required.';
        messageError.classList.remove('hidden');
        isValid = false;
    } else {
        messageError.classList.add('hidden');
    }

    if (isValid) {
        // Construct the mailto link
        const mailtoLink = `mailto:bangladeshchinmoy@gmail.com?subject=${encodeURIComponent(subjectInput.value.trim())}&body=${encodeURIComponent(`Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`)}`;

        // Open the user's default email client
        window.location.href = mailtoLink;

        // Optionally, clear the form after opening mail client
        contactForm.reset();

        // Provide a user friendly message (since mailto doesn't give feedback)
        alert('Your email client should open shortly with your message. Thank you!');
    } else {
        alert('Please correct the errors in the form.');
    }
});


// --- LLM Feature: Generate Project Brief ---

// Function to open the LLM input modal
function openLlmInputModal() {
    llmInputModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    setTimeout(() => {
        llmInputModal.classList.add('is-visible');
    }, 10);
    projectThemeInput.focus(); // Focus on the input field
}

// Function to close the LLM input modal
function closeLlmInputModal() {
    llmInputModal.classList.remove('is-visible');
    document.body.style.overflow = ''; // Re-enable scrolling
    setTimeout(() => {
        llmInputModal.classList.add('hidden');
        projectThemeInput.value = ''; // Clear input field
    }, 300);
}

// Function to open the LLM display modal
function openLlmDisplayModal(content = "Generating brief...") {
    llmIdeaContent.textContent = content;
    llmIdeaDisplayModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    setTimeout(() => {
        llmIdeaDisplayModal.classList.add('is-visible');
    }, 10);
}

// Function to close the LLM display modal
function closeLlmDisplayModal() {
    llmIdeaDisplayModal.classList.remove('is-visible');
    document.body.style.overflow = ''; // Re-enable scrolling
    setTimeout(() => {
        llmIdeaDisplayModal.classList.add('hidden');
    }, 300);
}


// Event listener for the "Generate Project Brief" button (to open input modal)
if (openLlmInputModalButton) openLlmInputModalButton.addEventListener('click', openLlmInputModal);

// Event listener to close the LLM input modal
if (closeLlmInputModalButton) closeLlmInputModalButton.addEventListener('click', closeLlmInputModal);

// Close LLM input modal if clicked outside content
if (llmInputModal) llmInputModal.addEventListener('click', function (event) {
    if (event.target === llmInputModal) {
        closeLlmInputModal();
    }
});

// Close LLM input modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && llmInputModal.classList.contains('is-visible')) {
        closeLlmInputModal();
    }
});

// Event listener for the "Generate Brief" button inside the input modal
if (generateBriefButton) generateBriefButton.addEventListener('click', async () => {
    const theme = projectThemeInput.value.trim();
    if (!theme) {
        alert("Please enter a project theme!");
        return;
    }

    closeLlmInputModal(); // Close the input modal
    openLlmDisplayModal("Generating a detailed project brief based on your theme: " + theme + "..."); // Show loading message in display modal

    const prompt = `Generate a detailed web development project brief for a portfolio based on the theme "${theme}". The brief should include:
    1.  **Project Title:** A catchy and descriptive title.
    2.  **Overview:** A concise paragraph describing the project's purpose and what it aims to achieve.
    3.  **Core Features:** A bulleted list of 3-5 key functionalities.
    4.  **Suggested Tech Stack:** A list of recommended technologies (e.g., frontend framework, backend, database, APIs).
    5.  **Target Audience:** Who is this project for?
    6.  **Potential Challenges/Considerations:** 1-2 points on what might be challenging or important to consider during development.

    Format the output clearly with headings and bullet points. Do not include any conversational text outside the brief.`;

    // If no API key, provide an on-device templated brief so it works offline
    const hasApiKey = false; // no key wired by default
    if (!hasApiKey) {
        const localBrief = `Project Title: ${theme.charAt(0).toUpperCase() + theme.slice(1)} — Modern Web App\n\nOverview:\nA polished, responsive ${theme} designed to deliver a fast, accessible, and delightful user experience. It focuses on real-world usability, clean architecture, and maintainability.\n\nCore Features:\n- Intuitive onboarding and clear navigation\n- Mobile-first responsive UI with offline-friendly caching\n- Real-time updates and optimistic UI (where applicable)\n- Robust forms with validation and helpful feedback\n- Accessible components, keyboard navigation, and dark mode\n\nSuggested Tech Stack:\n- Frontend: React/Vite or Next.js, Tailwind CSS\n- Backend: Node.js with Express or serverless functions\n- Database: PostgreSQL or MongoDB (Prisma/Drizzle ORM)\n- Auth & APIs: JWT/OAuth, REST or GraphQL\n- Tooling: ESLint, Prettier, Vitest/Jest\n\nTarget Audience:\n- Users who need a reliable ${theme} with clear value and minimal friction.\n\nPotential Challenges/Considerations:\n- Designing scalable data models and efficient queries\n- Balancing performance, accessibility, and visual polish`;
        llmIdeaContent.textContent = localBrief;
        return;
    }
});

// Event listener to close the LLM display modal
if (closeLlmDisplayModalButton) closeLlmDisplayModalButton.addEventListener('click', closeLlmDisplayModal);

// Close LLM display modal if clicked outside content
if (llmIdeaDisplayModal) llmIdeaDisplayModal.addEventListener('click', function (event) {
    if (event.target === llmIdeaDisplayModal) {
        closeLlmDisplayModal();
    }
});

// Close LLM display modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && llmIdeaDisplayModal.classList.contains('is-visible')) {
        closeLlmDisplayModal();
    }
});

// Copy brief to clipboard
if (copyIdeaButton) copyIdeaButton.addEventListener('click', () => {
    const textToCopy = llmIdeaContent.textContent;
    if (textToCopy && !textToCopy.startsWith("Generating") && !textToCopy.startsWith("Failed") && !textToCopy.startsWith("Error")) {
        try {
            // Use execCommand for broader browser compatibility in iframes
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Project brief copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy the brief. Please copy it manually.');
        }
    } else {
        alert('Nothing to copy yet or generation is still in progress!');
    }
});


// --- Testimonial Carousel Logic ---
function showTestimonial(index) {
    const testimonials = testimonialsCarousel.querySelectorAll('.testimonial-card');
    const dots = testimonialDotsContainer.querySelectorAll('.dot');

    // Ensure index wraps around correctly
    if (index >= testimonials.length) {
        index = 0;
    } else if (index < 0) {
        index = testimonials.length - 1;
    }

    // Adjust carousel position
    testimonialsCarousel.style.transform = `translateX(-${index * 100}%)`;

    // Update active dot
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    currentTestimonialIndex = index;
}

function nextTestimonial() {
    showTestimonial(currentTestimonialIndex + 1);
    resetTestimonialAutoPlay();
}

function prevTestimonial() {
    showTestimonial(currentTestimonialIndex - 1);
    resetTestimonialAutoPlay();
}

function createTestimonialDots() {
    const testimonials = testimonialsCarousel.querySelectorAll('.testimonial-card');
    testimonialDotsContainer.innerHTML = ''; // Clear existing dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot', 'w-3', 'h-3', 'bg-gray-500', 'rounded-full', 'cursor-pointer', 'transition', 'duration-300');
        dot.addEventListener('click', () => {
            showTestimonial(index);
            resetTestimonialAutoPlay();
        });
        testimonialDotsContainer.appendChild(dot);
    });
    showTestimonial(0); // Show the first testimonial initially
}

function startTestimonialAutoPlay() {
    testimonialInterval = setInterval(nextTestimonial, 5000); // Change testimonial every 5 seconds
}

function resetTestimonialAutoPlay() {
    clearInterval(testimonialInterval);
    startTestimonialAutoPlay();
}

// --- Theme Toggle Logic ---
function setTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        themeIcons.forEach(icon => {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        });
        const m = document.querySelector('meta#fallback-theme-color');
        if (m) m.setAttribute('content', '#f0f2f5');
    } else {
        document.body.classList.add('dark-mode');
        themeIcons.forEach(icon => {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        });
        const m = document.querySelector('meta#fallback-theme-color');
        if (m) m.setAttribute('content', '#0f172a');
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Add event listeners to theme toggle buttons
themeToggleButtons.forEach(button => {
    button.addEventListener('click', toggleTheme);
});


// --- Project Filtering Logic ---
filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active-filter', 'bg-indigo-600', 'text-white'));
        filterButtons.forEach(btn => btn.classList.add('bg-gray-700', 'text-gray-300'));

        // Add active class to the clicked button
        this.classList.add('active-filter', 'bg-indigo-600', 'text-white');
        this.classList.remove('bg-gray-700', 'text-gray-300');


        const filterValue = this.dataset.filter;

        allProjectCards.forEach(card => {
            const technologies = card.dataset.tech;
            if (filterValue === 'all' || technologies.includes(filterValue)) {
                card.style.display = 'block'; // Show the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    });
});


// --- Three.js 3D Showcase Logic ---
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
// const windowHalfX = window.innerWidth / 2; // Not used directly in mouse interaction
// const windowHalfY = window.innerHeight / 2; // Not used directly in mouse interaction
let skillsGroup;
let isDragging = false; // moved to outer scope for animate access
let fallbackShown = false;
let threeStarted = false;

function init3DScene() {
    if (threeStarted) return;
    const canvas = document.getElementById('three-js-canvas');
    if (!canvas) {
        console.warn("Three.js canvas not found. Skipping 3D scene initialization.");
        return;
    }
    // WebGL support check
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        const fb = document.getElementById('three-fallback');
        if (fb && !fallbackShown) { fb.classList.remove('hidden'); fb.classList.add('flex'); fallbackShown = true; }
        return;
    }
    if (typeof THREE === 'undefined') {
        console.error('THREE.js library not loaded. Showing fallback.');
        const fb = document.getElementById('three-fallback');
        if (fb && !fallbackShown) { fb.classList.remove('hidden'); fb.classList.add('flex'); fallbackShown = true; }
        return;
    }
    console.log("Initializing 3D scene...");
    console.log("Canvas dimensions:", canvas.clientWidth, "x", canvas.clientHeight);

    // Scene
    try {
        scene = new THREE.Scene();
    } catch (e) {
        console.error('Failed to create THREE.Scene()', e);
        const fb = document.getElementById('three-fallback');
        if (fb && !fallbackShown) { fb.classList.remove('hidden'); fb.classList.add('flex'); fallbackShown = true; }
        return;
    }
    scene.background = new THREE.Color(0x1a202c); // Match primary background color

    // Camera
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    } catch (e) {
        console.error('Failed to initialize WebGLRenderer', e);
        const fb = document.getElementById('three-fallback');
        if (fb && !fallbackShown) { fb.classList.remove('hidden'); fb.classList.add('flex'); fallbackShown = true; }
        return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Group for skills to rotate together
    skillsGroup = new THREE.Group();
    scene.add(skillsGroup);

    // Define skills and template labels to show breadth of templates included
    const skills = [
        { name: "React", color: 0x61DAFB, type: "sphere" },
        { name: "Node.js", color: 0x68A063, type: "box" },
        { name: "MongoDB", color: 0x47A248, type: "octahedron" },
        { name: "Tailwind CSS", color: 0x38B2AC, type: "torus" },
        { name: "JavaScript", color: 0xF7DF1E, type: "sphere" },
        { name: "Python", color: 0x3776AB, type: "box" },
        { name: "UI/UX", color: 0xFF69B4, type: "tetrahedron" },
        { name: "Git", color: 0xF05032, type: "torusKnot" },
        { name: "Firebase", color: 0xFFCA28, type: "dodecahedron" },
        { name: "3D Skills", color: 0x8A2BE2, type: "icosahedron" },
        // Template labels (visualized as small boxes with text sprites later)
        { name: "Dashboard Kit", color: 0x14b8a6, type: "box" },
        { name: "SaaS Starter", color: 0x0ea5e9, type: "box" },
        { name: "Creator Portfolio", color: 0x6366f1, type: "box" }
    ];

    // Create 3D objects for each skill
    const geometrySphere = new THREE.SphereGeometry(0.5, 32, 32);
    const geometryBox = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const geometryOctahedron = new THREE.OctahedronGeometry(0.7);
    const geometryTorus = new THREE.TorusGeometry(0.4, 0.2, 16, 100);
    const geometryTetrahedron = new THREE.TetrahedronGeometry(0.7);
    const geometryTorusKnot = new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8);
    const geometryDodecahedron = new THREE.DodecahedronGeometry(0.7);
    const geometryIcosahedron = new THREE.IcosahedronGeometry(0.6); // New geometry for 3D Skills

    const geometries = {
        sphere: geometrySphere,
        box: geometryBox,
        octahedron: geometryOctahedron,
        torus: geometryTorus,
        tetrahedron: geometryTetrahedron,
        torusKnot: geometryTorusKnot,
        dodecahedron: geometryDodecahedron,
        icosahedron: geometryIcosahedron // Added new geometry
    };

    // Utility: create simple text sprite using canvas
    function makeTextSprite(message, parameters = {}) {
        const fontface = parameters.fontface || 'Inter, Arial';
        const fontsize = parameters.fontsize || 44;
        const borderThickness = parameters.borderThickness || 4;
        const borderColor = parameters.borderColor || { r: 50, g: 65, b: 100, a: 1.0 };
        const backgroundColor = parameters.backgroundColor || { r: 17, g: 24, b: 39, a: 0.8 };

        const canvas2d = document.createElement('canvas');
        const context = canvas2d.getContext('2d');
        context.font = `bold ${fontsize}px ${fontface}`;
        const metrics = context.measureText(message);
        const textWidth = metrics.width;
        context.fillStyle = `rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`;
        context.strokeStyle = `rgba(${borderColor.r},${borderColor.g},${borderColor.b},${borderColor.a})`;
        context.lineWidth = borderThickness;
        const padding = 20;
        context.fillRect(borderThickness / 2, borderThickness / 2, textWidth + padding, fontsize + padding);
        context.strokeRect(borderThickness / 2, borderThickness / 2, textWidth + padding, fontsize + padding);
        context.fillStyle = 'rgba(255,255,255,0.95)';
        context.fillText(message, padding / 2 + borderThickness / 2, fontsize + padding / 2);
        const texture = new THREE.CanvasTexture(canvas2d);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2.2, 1.1, 1);
        return sprite;
    }

    skills.forEach((skill, index) => {
        const material = new THREE.MeshPhongMaterial({ color: skill.color, flatShading: true });
        const mesh = new THREE.Mesh(geometries[skill.type], material);

        // Make "3D Skills" object slightly larger
        if (skill.name === "3D Skills") {
            mesh.scale.set(1.2, 1.2, 1.2); // Make it 20% larger
        }

        // Position objects in a circle/sphere
        const angle = (index / skills.length) * Math.PI * 2;
        const radius = 2.5; // Increased radius to spread objects out
        mesh.position.x = radius * Math.cos(angle);
        mesh.position.y = radius * Math.sin(angle);
        mesh.position.z = (Math.random() - 0.5) * 2; // Increased z variation

        // Random rotation for initial variety
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;

        skillsGroup.add(mesh);

        // Add a tiny text label above each mesh
        const label = makeTextSprite(skill.name, { fontsize: 64 });
        label.position.set(mesh.position.x, mesh.position.y + 1.1, mesh.position.z);
        skillsGroup.add(label);
        // console.debug(`Added skill: ${skill.name} at (${mesh.position.x.toFixed(2)}, ${mesh.position.y.toFixed(2)}, ${mesh.position.z.toFixed(2)})`);
    });

    // Mouse interaction for rotation
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Adjust rotation speed
        skillsGroup.rotation.y += deltaX * 0.005;
        skillsGroup.rotation.x += deltaY * 0.005;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    threeStarted = true;
}

function onWindowResize() {
    const canvas = document.getElementById('three-js-canvas');
    if (!canvas) return;

    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function animate3DScene() {
    try {
        requestAnimationFrame(animate3DScene);

        if (skillsGroup) {
            if (!isDragging) {
                skillsGroup.rotation.y += 0.002;
                skillsGroup.rotation.x += 0.0005;
            }
            skillsGroup.children.forEach(mesh => {
                mesh.rotation.x += 0.005 * Math.random();
                mesh.rotation.y += 0.005 * Math.random();
            });
        }

        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    } catch (e) {
        console.error('3D animation loop error:', e);
        const fb = document.getElementById('three-fallback');
        if (fb && !fallbackShown) { fb.classList.remove('hidden'); fb.classList.add('flex'); fallbackShown = true; }
    }
}

// --- Initialize on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize testimonial carousel
    if (testimonialsCarousel && testimonialPrevButton && testimonialNextButton && testimonialDotsContainer) {
        createTestimonialDots();
        startTestimonialAutoPlay();
        testimonialPrevButton.addEventListener('click', prevTestimonial);
        testimonialNextButton.addEventListener('click', nextTestimonial);
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark if no preference
    setTheme(savedTheme);

    // Appearance section theme toggle
    const sectionThemeToggle = document.getElementById('section-theme-toggle');
    if (sectionThemeToggle) sectionThemeToggle.addEventListener('click', toggleTheme);

    // Trigger initial filter to show all projects (guarded)
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.click();

    // Initialize the 3D scene reliably; show fallback for reduced motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.getElementById('three-js-canvas');
    const fallback = document.getElementById('three-fallback');
    if (canvas) {
        if (reduceMotion) {
            if (fallback && !fallbackShown) { fallback.classList.remove('hidden'); fallback.classList.add('flex'); fallbackShown = true; }
        } else {
            const inView = () => {
                const r = canvas.getBoundingClientRect();
                return r.top < (window.innerHeight || document.documentElement.clientHeight) && r.bottom > 0;
            };
            if (inView()) {
                try { init3DScene(); animate3DScene(); } catch (e) { console.error(e); }
            } else if ('IntersectionObserver' in window) {
                const canvasObserver = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && !threeStarted) {
                            try { init3DScene(); animate3DScene(); } catch (e) { console.error(e); }
                            obs.disconnect();
                        }
                    });
                }, { threshold: 0.15 });
                canvasObserver.observe(canvas);
            } else {
                // No IO support, just start
                try { init3DScene(); animate3DScene(); } catch (e) { console.error(e); }
            }
            // Final safety: start after a short delay if still not started
            setTimeout(() => {
                if (!threeStarted) { try { init3DScene(); animate3DScene(); } catch (e) { console.error(e); } }
            }, 1000);
        }
    }
});

// --- UI Enhancements: Floating Icons, Parallax, Tilt ---
function setupFloatingIcons() {
    const container = document.querySelector('.floating-icons');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!container || reduceMotion) return;
    const isSmall = window.matchMedia('(max-width: 768px)').matches;
    const icons = [
        'fab fa-react',
        'fab fa-node',
        'fas fa-database',
        'fab fa-github',
        'fas fa-cloud',
        'fas fa-bolt',
        'fas fa-lock',
        'fas fa-code',
        'fas fa-mobile-alt',
        'fas fa-cubes'
    ];
    const colors = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#22d3ee', '#f472b6'];
    const count = isSmall ? 8 : 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const el = document.createElement('i');
        el.className = `icon ${icons[i % icons.length]}`;
        el.style.left = `${Math.random() * 100}%`;
        el.style.top = `${Math.random() * 100}%`;
        el.style.color = colors[i % colors.length];
        el.style.animationDuration = `${10 + Math.random() * 8}s`;
        el.style.animationDelay = `${Math.random() * 4}s`;
        frag.appendChild(el);
    }
    container.appendChild(frag);
}

function setupHeroParallax() {
    if (!heroSection) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const particles = document.querySelector('.particles-container');
    const aurora = document.querySelector('.aurora-bg');
    let raf = null;
    function onMove(e) {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            if (particles) particles.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0)`;
            if (aurora) aurora.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0)`;
        });
    }
    heroSection.addEventListener('mousemove', onMove);
    heroSection.addEventListener('mouseleave', () => {
        if (particles) particles.style.transform = '';
        if (aurora) aurora.style.transform = '';
    });
}

function setupCardTilt() {
    if (!tiltCandidates || tiltCandidates.length === 0) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const maxTilt = 10; // degrees
    tiltCandidates.forEach(card => {
        const glow = card.querySelector('.tilt-glow');
        function onMove(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (0.5 - y) * maxTilt;
            const tiltY = (x - 0.5) * maxTilt;
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            if (glow) {
                glow.style.setProperty('--mx', `${x * 100}%`);
                glow.style.setProperty('--my', `${y * 100}%`);
            }
        }
        function reset() {
            card.style.transform = '';
        }
        if (!reduceMotion && finePointer) {
            card.addEventListener('mousemove', onMove);
            card.addEventListener('mouseleave', reset);
        } else if (glow) {
            glow.style.display = 'none';
        }
    });
}

