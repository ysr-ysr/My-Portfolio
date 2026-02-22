/* ============================================
   YOUSSRA ZAHAF – GALAXY PORTFOLIO
   JavaScript: Starfield, Scroll Reveal, Nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Animated Starfield Canvas ──
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.3,
                opacity: Math.random() * 0.7 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
            });
        }
    }

    function createShootingStar() {
        if (Math.random() < 0.005 && shootingStars.length < 2) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height * 0.5;
            shootingStars.push({
                x: startX,
                y: startY,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 6 + 4,
                angle: (Math.random() * 30 + 15) * (Math.PI / 180),
                opacity: 1,
                decay: Math.random() * 0.015 + 0.01,
            });
        }
    }

    function drawStars(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background stars
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
            const currentOpacity = star.opacity * (0.6 + 0.4 * twinkle);

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
            ctx.fill();

            // Faint glow on larger stars
            if (star.radius > 1.2) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 210, 255, ${currentOpacity * 0.1})`;
                ctx.fill();
            }
        });

        // Shooting stars
        createShootingStar();
        shootingStars = shootingStars.filter(ss => {
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= ss.decay;

            if (ss.opacity <= 0) return false;

            const tailX = ss.x - Math.cos(ss.angle) * ss.length;
            const tailY = ss.y - Math.sin(ss.angle) * ss.length;

            const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(ss.x, ss.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Bright head
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
            ctx.fill();

            return true;
        });
    }

    function animateStars(time) {
        drawStars(time);
        requestAnimationFrame(animateStars);
    }

    resizeCanvas();
    createStars(200);
    requestAnimationFrame(animateStars);

    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars(200);
    });


    // ── Scroll Reveal with Intersection Observer ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve – let them stay visible
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ── Navbar Scroll Effect ──
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // ── Active Nav Link Highlight ──
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();


    // ── Mobile Menu Toggle ──
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');
    let menuOpen = false;

    menuToggle.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('hidden');
        menuToggle.innerHTML = menuOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            mobileMenu.classList.add('hidden');
            menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });


    // ── Smooth Scroll for all anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });


    // ── Parallax Effect on Nebula Blobs ──
    const blobs = document.querySelectorAll('.nebula-blob');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        blobs.forEach((blob, i) => {
            const factor = (i + 1) * 8;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });
    });

});
