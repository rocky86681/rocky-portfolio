document.addEventListener('DOMContentLoaded', () => {
    
    // --- Custom Cursor ---
    const cursor = document.querySelector('.cursor-glow');
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-icon');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // --- Loading Screen ---
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.progress');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                triggerInitialReveals();
            }, 500);
        }
    }, 150);

    // --- Navigation ---
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            
            // If it's a skill card, animate the bar
            if(entry.target.classList.contains('skill-card')) {
                const bar = entry.target.querySelector('.skill-level');
                if(bar) {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 300);
                }
            }
            
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    function triggerInitialReveals() {
        const initialReveals = document.querySelectorAll('.hero .reveal-text, .hero .reveal-up');
        initialReveals.forEach(el => el.classList.add('active'));
    }

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            projects.forEach(project => {
                if (filterValue === 'all' || project.getAttribute('data-category') === filterValue) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // --- Video Modal ---
    const playBtns = document.querySelectorAll('.play-btn');
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalBg = document.querySelector('.modal-bg');
    const modalVideoContainer = document.getElementById('modal-video-container');

    function openModal(videoUrl) {
        if(videoUrl) {
            modalVideoContainer.innerHTML = `<iframe src="${videoUrl}" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>`;
        } else {
            modalVideoContainer.innerHTML = `
                <div class="video-placeholder" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; color:var(--text-secondary); gap:1rem;">
                    <i class="ph-fill ph-play-circle" style="font-size:4rem; color:var(--accent-blue);"></i>
                    <p>No video linked</p>
                </div>
            `;
        }
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
        setTimeout(() => {
            if(modalVideoContainer) modalVideoContainer.innerHTML = ''; // Stop video playing
        }, 400);
    }

    playBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Get the video URL from the data-video attribute
            const videoUrl = btn.getAttribute('data-video');
            openModal(videoUrl);
        });
    });

    closeModal.addEventListener('click', closeVideoModal);
    modalBg.addEventListener('click', closeVideoModal);

    // Form Submission with AJAX
    const form = document.querySelector('.contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.querySelector('.btn-content').innerText;
            btn.querySelector('.btn-content').innerText = 'Sending...';
            
            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    btn.querySelector('.btn-content').innerText = 'Message Sent!';
                    form.reset();
                } else {
                    btn.querySelector('.btn-content').innerText = 'Error Sending!';
                }
                setTimeout(() => {
                    btn.querySelector('.btn-content').innerText = originalText;
                }, 3000);
            }).catch(error => {
                btn.querySelector('.btn-content').innerText = 'Error Sending!';
                setTimeout(() => {
                    btn.querySelector('.btn-content').innerText = originalText;
                }, 3000);
            });
        });
    }

    // Dynamic glow effect for glass cards on mousemove
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            // Add a subtle radial gradient mask in CSS if we want, currently just handled by cursor
        });
    });
});
