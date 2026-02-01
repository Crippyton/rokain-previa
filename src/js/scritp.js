 // Loading Animation with Percentage
        let percentage = 0;
        const percentageElement = document.getElementById('loadingPercentage');
        const loaderElement = document.getElementById('loader');
        
        const loadingInterval = setInterval(() => {
            percentage += Math.random() * 15;
            if (percentage >= 100) {
                percentage = 100;
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loaderElement.classList.add('hidden');
                    initializeCounters();
                }, 500);
            }
            percentageElement.textContent = Math.floor(percentage) + '%';
        }, 150);

        // Counter Animation
        function initializeCounters() {
            const counters = document.querySelectorAll('.counter-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        // Start countdown for seconds
                        if (counter.parentElement.querySelector('.counter-label').textContent === 'Segundos') {
                            startCountdown();
                        }
                    }
                };
                updateCounter();
            });
        }

        // Countdown for seconds
        function startCountdown() {
            const secondsCounter = document.querySelector('.counter-item:last-child .counter-number');
            setInterval(() => {
                let currentValue = parseInt(secondsCounter.textContent);
                currentValue = currentValue > 0 ? currentValue - 1 : 60;
                secondsCounter.textContent = currentValue;
            }, 1000);
        }

        // Create Stars
        function createStars() {
            const starsContainer = document.getElementById('starsContainer');
            const starCount = 100;
            
            for (let i = 0; i < starCount; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 3 + 's';
                star.style.animationDuration = (2 + Math.random() * 3) + 's';
                starsContainer.appendChild(star);
            }
        }

        createStars();

        // Create Enhanced Particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 60;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const startX = Math.random() * window.innerWidth;
                const startY = Math.random() * window.innerHeight;
                const endX = (Math.random() - 0.5) * 300;
                const endY = (Math.random() - 0.5) * 300;
                
                particle.style.left = startX + 'px';
                particle.style.top = startY + 'px';
                particle.style.setProperty('--tx', endX + 'px');
                particle.style.setProperty('--ty', endY + 'px');
                particle.style.animationDelay = Math.random() * 20 + 's';
                particle.style.animationDuration = (15 + Math.random() * 10) + 's';
                
                particlesContainer.appendChild(particle);
            }
        }

        createParticles();

        // Enhanced Social Links Hover
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-8px) scale(1.2) rotate(' + (Math.random() * 20 - 10) + 'deg)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
            });

            link.addEventListener('click', function(e) {
                e.preventDefault();
                createRipple(e);
            });
        });

        // Ripple Effect
        function createRipple(e) {
            const ripple = document.createElement('div');
            ripple.style.position = 'fixed';
            ripple.style.left = e.clientX + 'px';
            ripple.style.top = e.clientY + 'px';
            ripple.style.width = '5px';
            ripple.style.height = '5px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(0, 217, 255, 0.6)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'rippleExpand 0.6s ease-out';
            ripple.style.zIndex = '9999';
            
            document.body.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        }

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleExpand {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Newsletter Form
        document.getElementById('newsletterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-check"></i> Inscrito!';
            button.style.background = 'linear-gradient(135deg, #00FF88, #00CC66)';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, #00D9FF, #0099FF)';
                input.value = '';
            }, 3000);
        });

        // Parallax Effect for Circles
        document.addEventListener('mousemove', (e) => {
            const circles = document.querySelectorAll('.circle');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 20;
                const xMove = (x - 0.5) * speed;
                const yMove = (y - 0.5) * speed;
                circle.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        });

        // Feature Cards Animation on Scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });

        // Easter Egg: Konami Code
        let konamiCode = [];
        const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.key);
            konamiCode = konamiCode.slice(-10);

            if (konamiCode.join(',') === konamiPattern.join(',')) {
                activateEasterEgg();
            }
        });

        function activateEasterEgg() {
            document.body.style.animation = 'rainbow 2s linear infinite';
            const eggStyle = document.createElement('style');
            eggStyle.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(eggStyle);
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10000);
        }

        // Mouse Trail Effect
        let mouseTrail = [];
        const maxTrailLength = 20;

        document.addEventListener('mousemove', (e) => {
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.width = '4px';
            trail.style.height = '4px';
            trail.style.borderRadius = '50%';
            trail.style.background = 'rgba(0, 217, 255, 0.5)';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '9998';
            trail.style.transform = 'translate(-50%, -50%)';
            trail.style.animation = 'trailFade 0.5s ease-out forwards';
            
            document.body.appendChild(trail);
            mouseTrail.push(trail);
            
            if (mouseTrail.length > maxTrailLength) {
                const oldTrail = mouseTrail.shift();
                oldTrail.remove();
            }
        });

        const trailStyle = document.createElement('style');
        trailStyle.textContent = `
            @keyframes trailFade {
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(2);
                }
            }
        `;
        document.head.appendChild(trailStyle);

        // Typing Effect for Message
        const message = document.querySelector('.message');
        const originalHTML = message.innerHTML;
        message.innerHTML = '';
        message.style.opacity = '1';

        setTimeout(() => {
            let charIndex = 0;
            const typingSpeed = 30;
            
            function typeText() {
                if (charIndex < originalHTML.length) {
                    message.innerHTML = originalHTML.substring(0, charIndex + 1);
                    charIndex++;
                    setTimeout(typeText, typingSpeed);
                }
            }
            
            typeText();
        }, 2500);

        // Random Color Shift for Icon
        setInterval(() => {
            const icon = document.querySelector('.icon-glow');
            const colors = ['#00D9FF', '#FF00FF', '#FFFFFF', '#00FF88', '#FFD700'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            icon.style.color = randomColor;
        }, 2000);