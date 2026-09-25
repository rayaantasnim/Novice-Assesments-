
        // Spotlight effect tracking mouse coordinates
        window.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        // 1. Three.js 3D Universe Background (Moving Stars & Falling Stars)
        const canvas = document.getElementById('bg-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create Starfield Particles
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 2000;
        const starPositions = new Float32Array(starsCount * 3);

        for(let i = 0; i < starsCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 2000;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

        // Create glowing star material
        const starsMaterial = new THREE.PointsMaterial({
            color: 0x06b6d4,
            size: 2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Create Falling Stars / Shooting Stars
        const shootingStarsCount = 20;
        const shootingStarsGeometry = new THREE.BufferGeometry();
        const shootingPositions = new Float32Array(shootingStarsCount * 3);
        const shootingVelocities = [];

        for(let i = 0; i < shootingStarsCount; i++) {
            shootingPositions[i * 3] = (Math.random() - 0.5) * 1000;
            shootingPositions[i * 3 + 1] = Math.random() * 500 + 200;
            shootingPositions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
            
            shootingVelocities.push({
                x: (Math.random() - 0.5) * 2,
                y: -(Math.random() * 5 + 3),
                z: (Math.random() - 0.5) * 2
            });
        }

        shootingStarsGeometry.setAttribute('position', new THREE.BufferAttribute(shootingPositions, 3));
        const shootingMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 4,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const shootingStars = new THREE.Points(shootingStarsGeometry, shootingMaterial);
        scene.add(shootingStars);

        camera.position.z = 400;

        // Mouse interaction for 3D feel
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - window.innerWidth / 2) * 0.2;
            mouseY = (event.clientY - window.innerHeight / 2) * 0.2;
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);

            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            starField.rotation.y += 0.0005;
            starField.rotation.x += 0.0002;

            scene.rotation.y = targetX * 0.001;
            scene.rotation.x = -targetY * 0.001;

            // Animate shooting stars
            const positions = shootingStarsGeometry.attributes.position.array;
            for(let i = 0; i < shootingStarsCount; i++) {
                positions[i * 3] += shootingVelocities[i].x;
                positions[i * 3 + 1] += shootingVelocities[i].y;
                positions[i * 3 + 2] += shootingVelocities[i].z;

                // Reset shooting star when it goes too low
                if(positions[i * 3 + 1] < -500) {
                    positions[i * 3] = (Math.random() - 0.5) * 1000;
                    positions[i * 3 + 1] = Math.random() * 500 + 200;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;
                }
            }
            shootingStarsGeometry.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        }
        animate();

        // Window Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 2. GSAP ScrollTrigger Animations for Sections
        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray('.gsap-section').forEach((section) => {
            gsap.fromTo(section, 
                { opacity: 0, y: 50 }, 
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // 3. Navigation Bar Scroll Effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('bg-slate-900/90', 'backdrop-blur-xl', 'shadow-2xl');
            } else {
                navbar.classList.remove('bg-slate-900/90', 'backdrop-blur-xl', 'shadow-2xl');
            }
        });

        // Dropdown Toggle Logic for Navbar Menu
        const menuBtn = document.getElementById('menu-btn');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const menuArrow = document.getElementById('menu-arrow');
        let isDropdownOpen = false;

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            menuBtn.setAttribute('aria-expanded', isDropdownOpen);
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
                menuBtn.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.add('opacity-0', '-translate-y-2');
                menuArrow.classList.remove('rotate-180');
                setTimeout(() => {
                    dropdownMenu.classList.add('hidden');
                }, 300);
            }
        });

        // Question Dropdown Accordion Logic & Confetti Trigger
        const qTriggers = document.querySelectorAll('.q-dropdown-trigger');
        qTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const targetId = trigger.getAttribute('data-target');
                const targetAns = document.getElementById(targetId);
                const arrow = trigger.querySelector('.q-arrow');
                const isHidden = targetAns.classList.contains('hidden');

                trigger.setAttribute('aria-expanded', isHidden);

                if (isHidden) {
                    targetAns.classList.remove('hidden');
                    arrow.classList.add('rotate-180');

                    // Fire Confetti effect at trigger coordinates on opening
                    const rect = trigger.getBoundingClientRect();
                    const x = (rect.left + rect.width / 2) / window.innerWidth;
                    const y = (rect.top + rect.height / 2) / window.innerHeight;

                    if (typeof confetti === 'function') {
                        confetti({
                            particleCount: 70,
                            spread: 60,
                            origin: { x: x, y: y },
                            colors: ['#06b6d4', '#6366f1', '#a855f7', '#14b8a6', '#f59e0b', '#f43f5e']
                        });
                    }
                } else {
                    targetAns.classList.add('hidden');
                    arrow.classList.remove('rotate-180');
                }
            });
        });
