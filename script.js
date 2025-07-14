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

// LLM Feature elements
const generateIdeaButton = document.getElementById('generate-idea-button');
const llmIdeaModal = document.getElementById('llm-idea-modal');
const closeLlmModalButton = document.getElementById('close-llm-modal-button');
const llmIdeaContent = document.getElementById('llm-idea-content');
const copyIdeaButton = document.getElementById('copy-idea-button');


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


// --- Mobile Menu Logic ---
mobileMenuButton.addEventListener('click', function () {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('#mobile-menu a').forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// --- Loading Spinner Logic ---
// Hide spinner once the page content is fully loaded
window.addEventListener('load', () => {
    loadingSpinner.classList.add('opacity-0');
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
    }, 500); // Allow transition to finish before hiding
});

// --- Scroll-to-Top Button Logic ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        scrollToTopButton.classList.remove('scale-0', 'opacity-0');
        scrollToTopButton.classList.add('scale-100', 'opacity-100');
    } else {
        scrollToTopButton.classList.remove('scale-100', 'opacity-100');
        scrollToTopButton.classList.add('scale-0', 'opacity-0');
    }
});

scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll to top
    });
});

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
            }, delay);
            observer.unobserve(target); // Stop observing once animated
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe section titles
sectionTitles.forEach(title => {
    observer.observe(title);
});

// Observe elements with animate-on-scroll class
animateOnScrollElements.forEach(element => {
    observer.observe(element);
});

// Observe specific elements with custom animations
if (heroContent) observer.observe(heroContent);
if (aboutImage) observer.observe(aboutImage);
if (aboutText) observer.observe(aboutText);
if (contactSection) observer.observe(contactSection);
if (ctaSection) observer.observe(ctaSection);

// Observe new certification cards
certificationCards.forEach(card => {
    observer.observe(card);
});

// Observe new article cards
articleCards.forEach(card => {
    observer.observe(card);
});


// --- Project Detail Modal Logic ---

// Function to open the project modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (project) {
        modalProjectTitle.textContent = project.title;
        modalProjectImage.src = project.image;
        modalProjectImage.alt = project.title;
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
closeModalButton.addEventListener('click', closeProjectModal);

// Close modal if clicked outside content
projectDetailModal.addEventListener('click', function (event) {
    if (event.target === projectDetailModal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && projectDetailModal.classList.contains('is-visible')) {
        closeProjectModal();
    }
});

// --- Dynamic Particle Generation (for Hero Section) ---
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
        const numberOfParticles = 25; // Increased for more density
        for (let i = 0; i < numberOfParticles; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 70 + 30; // Particles between 30px and 100px
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 20; // Longer animation delay range
            const duration = Math.random() * 15 + 25; // Longer animation duration
            const opacity = Math.random() * 0.5 + 0.1; // Wider opacity range
            const blur = Math.random() * 5 + 1; // Wider blur range

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
});

// --- Contact Form Submission (mailto:) ---
contactForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    // Construct the mailto link
    const mailtoLink = `mailto:your.email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    // Open the user's default email client
    window.location.href = mailtoLink;

    // Optionally, clear the form after opening mail client
    contactForm.reset();

    // Provide a user friendly message (since mailto doesn't give feedback)
    alert('Your email client should open shortly with your message. Thank you!');
});

// --- LLM Feature: Generate Project Idea ---

// Function to open the LLM idea modal
function openLlmIdeaModal(content = "Generating idea...") {
    llmIdeaContent.textContent = content;
    llmIdeaModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    setTimeout(() => {
        llmIdeaModal.classList.add('is-visible');
    }, 10);
}

// Function to close the LLM idea modal
function closeLlmIdeaModal() {
    llmIdeaModal.classList.remove('is-visible');
    document.body.style.overflow = ''; // Re-enable scrolling
    setTimeout(() => {
        llmIdeaModal.classList.add('hidden');
    }, 300);
}

// Event listener for the "Generate Project Idea" button
generateIdeaButton.addEventListener('click', async () => {
    openLlmIdeaModal("Generating a creative project idea for you..."); // Show loading message

    const prompt = `Generate a creative and feasible web development project idea for a portfolio. The idea should be concise (1-2 sentences) and could involve technologies like React, Node.js, UI/UX design, data visualization, or general software engineering principles. Provide only the idea, no conversational text.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide this in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            llmIdeaContent.textContent = text; // Display the generated idea
        } else {
            llmIdeaContent.textContent = "Failed to generate an idea. Please try again.";
            console.error("Gemini API returned an unexpected structure:", result);
        }
    } catch (error) {
        llmIdeaContent.textContent = "Error connecting to the idea generator. Please check your network or try again later.";
        console.error("Error calling Gemini API:", error);
    }
});

// Event listener to close the LLM idea modal
closeLlmModalButton.addEventListener('click', closeLlmModalButton); // Fixed: Should be closeLlmModalButton
closeLlmModalButton.addEventListener('click', closeLlmModal); // Fixed: Should be closeLlmModal

// Close LLM modal if clicked outside content
llmIdeaModal.addEventListener('click', function (event) {
    if (event.target === llmIdeaModal) {
        closeLlmModal();
    }
});

// Close LLM modal with Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && llmIdeaModal.classList.contains('is-visible')) {
        closeLlmModal();
    }
});

// Copy idea to clipboard
copyIdeaButton.addEventListener('click', () => {
    const textToCopy = llmIdeaContent.textContent;
    if (textToCopy && textToCopy !== "Generating a creative project idea for you..." && textToCopy !== "Failed to generate an idea. Please try again." && textToCopy !== "Error connecting to the idea generator. Please check your network or try again later.") {
        try {
            // Use execCommand for broader browser compatibility in iframes
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Idea copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy the idea. Please copy it manually.');
        }
    } else {
        alert('Nothing to copy yet!');
    }
});
