        // 1. Navigation Bar Scroll Effect (Solid to Glossy)
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('bg-slate-900/80', 'backdrop-blur-md', 'shadow-lg', 'border-cyan-500/40');
            } else {
                navbar.classList.remove('bg-slate-900/80', 'backdrop-blur-md', 'shadow-lg', 'border-cyan-500/40');
            }
        });

        // Dropdown Toggle Logic
        const menuBtn = document.getElementById('menu-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const menuArrow = document.getElementById('menu-arrow');
        let isDropdownOpen = false;

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            if (isDropdownOpen) {
                dropdownMenu.classList.remove('hidden');
                setTimeout(() => {
                    dropdownMenu.classList.remove('opacity-0', '-translate-y-2');
                    menuArrow.classList.add('rotate-180');
                }, 10);
            } else {
                dropdownMenu.classList.add('opacity-0', '-translate-y-2');
                menuArrow.classList.remove('rotate-180');
                setTimeout(() => {
                    dropdownMenu.classList.add('hidden');
                }, 300);
            }
        });

        window.addEventListener('click', () => {
            if (isDropdownOpen) {
                isDropdownOpen = false;
                dropdownMenu.classList.add('opacity-0', '-translate-y-2');
                menuArrow.classList.remove('rotate-180');
                setTimeout(() => {
                    dropdownMenu.classList.add('hidden');
                }, 300);
            }
        });

        // Left-Corner Mapping Navigation Drawer & Custom Hamburger Logic
        const navToggleBtn = document.getElementById('nav-toggle-btn');
        const sideDrawer = document.getElementById('side-drawer');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const drawerLinks = document.querySelectorAll('.drawer-link');
        let isDrawerOpen = false;

        function toggleDrawer() {
            isDrawerOpen = !isDrawerOpen;
            if (isDrawerOpen) {
                sideDrawer.classList.remove('-translate-x-full');
                hamburgerIcon.classList.add('hamburger-active');
            } else {
                sideDrawer.classList.add('-translate-x-full');
                hamburgerIcon.classList.remove('hamburger-active');
            }
        }

        navToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDrawer();
        });

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isDrawerOpen) toggleDrawer();
            });
        });

        document.addEventListener('click', (e) => {
            if (isDrawerOpen && !sideDrawer.contains(e.target) && !navToggleBtn.contains(e.target)) {
                toggleDrawer();
            }
        });

        // 2. Enhanced Three.js 3D Cosmic Background + Floating Particles & Dynamic Lighting
        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Multi-layered Cosmic Particle System
        const particleCount = 1200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleVelocities = [];

        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 30;     // x
            particlePositions[i + 1] = (Math.random() - 0.5) * 30; // y
            particlePositions[i + 2] = (Math.random() - 0.5) * 30; // z
            
            particleVelocities.push({
                x: (Math.random() - 0.5) * 0.008,
                y: -Math.random() * 0.02 - 0.005,
                z: (Math.random() - 0.5) * 0.008
            });
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        // Enhanced Glowing Particle Material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.05,
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const starField = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(starField);

        // Add subtle floating geometric wireframe rings for deep cosmic atmosphere
        const ringGeometry = new THREE.TorusGeometry(8, 0.02, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.15, wireframe: true });
        const cosmicRing = new THREE.Mesh(ringGeometry, ringMaterial);
        scene.add(cosmicRing);

        camera.position.z = 6;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        function animateCosmos() {
            requestAnimationFrame(animateCosmos);

            targetX += (mouseX - targetX) * 0.04;
            targetY += (mouseY - targetY) * 0.04;

            starField.rotation.y = targetX * 0.4;
            starField.rotation.x = targetY * 0.4;

            cosmicRing.rotation.x += 0.001;
            cosmicRing.rotation.y += 0.002;

            const positions = starField.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                let i3 = i * 3;
                positions[i3] += particleVelocities[i].x;
                positions[i3 + 1] += particleVelocities[i].y;
                positions[i3 + 2] += particleVelocities[i].z;

                if (positions[i3 + 1] < -15) {
                    positions[i3 + 1] = 15;
                    positions[i3] = (Math.random() - 0.5) * 30;
                }
            }
            starField.geometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }
        animateCosmos();

        // 4. Advanced GSAP Reveal & 3D Scroll Animations
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.gsap-section').forEach((section) => {
            gsap.fromTo(section, 
                { opacity: 0, y: 80, rotateX: 10, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
