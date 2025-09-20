/**
 * THREE.JS SKILLS SHOWCASE MODULE
 * Handles 3D visualization of skills and technologies
 * @module threeJS
 */

import { prefersReducedMotion, randomBetween } from '../utils/utilities.js';

export class ThreeJSSkillsShow {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.skillsGroup = null;
        this.isInitialized = false;
        this.isDragging = false;
        this.fallbackShown = false;
        this.animationId = null;
        this.canvas = null;
        this.fallback = null;
    }

    /**
     * Initialize the 3D scene
     */
    async init() {
        if (this.isInitialized) return;

        this.canvas = document.getElementById('three-js-canvas');
        this.fallback = document.getElementById('three-fallback');

        if (!this.canvas) {
            console.warn("Three.js canvas not found. Skipping 3D scene initialization.");
            return;
        }

        // Check for reduced motion preference
        if (prefersReducedMotion()) {
            this.showFallback();
            return;
        }

        // Check WebGL support
        if (!this.checkWebGLSupport()) {
            this.showFallback();
            return;
        }

        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('THREE.js library not loaded. Showing fallback.');
            this.showFallback();
            return;
        }

        try {
            await this.initializeScene();
            this.startAnimation();
            this.isInitialized = true;
            console.log("✅ 3D scene initialized successfully");
        } catch (error) {
            console.error('Failed to initialize 3D scene:', error);
            this.showFallback();
        }
    }

    /**
     * Check WebGL support
     */
    checkWebGLSupport() {
        const gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        return !!gl;
    }

    /**
     * Initialize the Three.js scene
     */
    async initializeScene() {
        console.log("Initializing 3D scene...");

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a202c); // Match primary background color

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        // Add lights
        this.setupLighting();

        // Create skills group
        this.skillsGroup = new THREE.Group();
        this.scene.add(this.skillsGroup);

        // Create skill objects
        this.createSkillObjects();

        // Setup interactions
        this.setupInteractions();

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Setup scene lighting
     */
    setupLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Main point light
        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        // Secondary point light
        const pointLight2 = new THREE.PointLight(0x6366f1, 0.3);
        pointLight2.position.set(-5, -5, -5);
        this.scene.add(pointLight2);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 5);
        this.scene.add(directionalLight);
    }

    /**
     * Create skill objects
     */
    createSkillObjects() {
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
            { name: "Three.js", color: 0x8A2BE2, type: "icosahedron" },
            { name: "Dashboard Kit", color: 0x14b8a6, type: "cylinder" },
            { name: "SaaS Starter", color: 0x0ea5e9, type: "cone" },
            { name: "Creator Portfolio", color: 0x6366f1, type: "octahedron" }
        ];

        const geometries = this.createGeometries();

        skills.forEach((skill, index) => {
            const geometry = geometries[skill.type];
            const material = new THREE.MeshPhongMaterial({
                color: skill.color,
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Position objects in a sphere formation
            const phi = Math.acos(-1 + (2 * index) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            const radius = 3;

            mesh.position.setFromSphericalCoords(radius, phi, theta);

            // Add some randomness to z position
            mesh.position.z += randomBetween(-0.5, 0.5);

            // Random initial rotation
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            // Store original position for animation
            mesh.userData = {
                originalPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: randomBetween(0.001, 0.01),
                    y: randomBetween(0.001, 0.01),
                    z: randomBetween(0.001, 0.01)
                },
                floatSpeed: randomBetween(0.5, 2),
                floatAmplitude: randomBetween(0.1, 0.3)
            };

            this.skillsGroup.add(mesh);

            // Create text label
            const label = this.createTextSprite(skill.name);
            label.position.copy(mesh.position);
            label.position.y += 0.8;
            this.skillsGroup.add(label);
        });
    }

    /**
     * Create geometries for different shapes
     */
    createGeometries() {
        return {
            sphere: new THREE.SphereGeometry(0.3, 32, 32),
            box: new THREE.BoxGeometry(0.6, 0.6, 0.6),
            octahedron: new THREE.OctahedronGeometry(0.4),
            torus: new THREE.TorusGeometry(0.3, 0.15, 16, 100),
            tetrahedron: new THREE.TetrahedronGeometry(0.4),
            torusKnot: new THREE.TorusKnotGeometry(0.25, 0.08, 64, 8),
            dodecahedron: new THREE.DodecahedronGeometry(0.4),
            icosahedron: new THREE.IcosahedronGeometry(0.35),
            cylinder: new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8),
            cone: new THREE.ConeGeometry(0.3, 0.8, 8)
        };
    }

    /**
     * Create text sprite for labels
     */
    createTextSprite(message) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const fontSize = 40;
        const fontFamily = 'Inter, Arial, sans-serif';

        context.font = `bold ${fontSize}px ${fontFamily}`;
        const metrics = context.measureText(message);
        const textWidth = metrics.width;

        canvas.width = textWidth + 20;
        canvas.height = fontSize + 20;

        // Re-set font after canvas resize
        context.font = `bold ${fontSize}px ${fontFamily}`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Background
        context.fillStyle = 'rgba(17, 24, 39, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        context.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        context.lineWidth = 2;
        context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);

        // Text
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.fillText(message, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.5
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1.5, 0.75, 1);

        return sprite;
    }

    /**
     * Setup mouse interactions
     */
    setupInteractions() {
        let previousMousePosition = { x: 0, y: 0 };
        let isMouseDown = false;

        this.canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            this.isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        this.canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
            this.isDragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            isMouseDown = false;
            this.isDragging = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!isMouseDown || !this.isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            // Rotate skills group
            this.skillsGroup.rotation.y += deltaX * 0.01;
            this.skillsGroup.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isMouseDown = true;
                this.isDragging = true;
                const touch = e.touches[0];
                previousMousePosition = { x: touch.clientX, y: touch.clientY };
            }
        });

        this.canvas.addEventListener('touchend', () => {
            isMouseDown = false;
            this.isDragging = false;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            if (!isMouseDown || !this.isDragging || e.touches.length !== 1) return;

            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - previousMousePosition.x;
            const deltaY = touch.clientY - previousMousePosition.y;

            this.skillsGroup.rotation.y += deltaX * 0.01;
            this.skillsGroup.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: touch.clientX, y: touch.clientY };
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.canvas || !this.camera || !this.renderer) return;

        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        if (!this.skillsGroup) return;

        const time = Date.now() * 0.001;

        // Auto-rotate group when not dragging
        if (!this.isDragging) {
            this.skillsGroup.rotation.y += 0.002;
            this.skillsGroup.rotation.x += 0.0005;
        }

        // Animate individual meshes
        this.skillsGroup.children.forEach((child, index) => {
            if (child.isMesh) {
                const userData = child.userData;

                // Individual rotation
                child.rotation.x += userData.rotationSpeed.x;
                child.rotation.y += userData.rotationSpeed.y;
                child.rotation.z += userData.rotationSpeed.z;

                // Floating animation
                const floatOffset = Math.sin(time * userData.floatSpeed + index) * userData.floatAmplitude;
                child.position.y = userData.originalPosition.y + floatOffset;
            }
        });

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.animationId) return;
        this.animate();
    }

    /**
     * Stop animation loop
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Show fallback content
     */
    showFallback() {
        if (this.fallback && !this.fallbackShown) {
            this.fallback.classList.remove('hidden');
            this.fallback.classList.add('flex');
            this.fallbackShown = true;
            console.log("Showing 3D fallback content");
        }
    }

    /**
     * Destroy the 3D scene
     */
    destroy() {
        console.log("Destroying 3D scene...");

        // Stop animation
        this.stopAnimation();

        // Clean up Three.js objects
        if (this.scene) {
            this.scene.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }

        if (this.renderer) {
            this.renderer.dispose();
        }

        // Remove event listeners
        window.removeEventListener('resize', this.handleResize.bind(this));

        // Reset properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.skillsGroup = null;
        this.isInitialized = false;
        this.isDragging = false;
    }

    /**
     * Get current state
     */
    getState() {
        return {
            isInitialized: this.isInitialized,
            isDragging: this.isDragging,
            fallbackShown: this.fallbackShown,
            hasCanvas: !!this.canvas,
            hasScene: !!this.scene
        };
    }
}

export default { ThreeJSSkillsShow };