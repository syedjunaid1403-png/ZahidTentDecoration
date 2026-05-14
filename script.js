// ==================== DOM ELEMENTS ====================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const stickyCta = document.getElementById('stickyCta');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

// ==================== NAVBAR SCROLL ====================
let lastScrollY = 0;

function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide sticky CTA
    if (scrollY > 600) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }

    lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

// ==================== HAMBURGER MENU ====================
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow =
            navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ==================== ACTIVE NAV LINK ====================
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ==================== SCROLL REVEAL ====================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            el.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        counter.textContent = Math.floor(current);
                    }, 16);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(counter);
    });
}

animateCounters();

// ==================== GALLERY FILTER ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeUp 0.5s forwards';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// ==================== LIGHTBOX ====================
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ==================== HERO PARTICLES ====================
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${4 + Math.random() * 6}s`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = `${0.3 + Math.random() * 0.5}`;
        container.appendChild(particle);
    }
}

createParticles();

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== TOAST NOTIFICATIONS ====================
function showToast(type, title, message, duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || '📢'}</span>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" aria-label="Close">&times;</button>
    `;

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 400);
    });

    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 400);
        }
    }, duration);
}

// ==================== ENQUIRY FORM ====================
const enquiryForm = document.getElementById('enquiryForm');

if (enquiryForm) {
    enquiryForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.classList.remove('error'));

        // Get values
        const name = document.getElementById('enquiry-name').value.trim();
        const phone = document.getElementById('enquiry-phone').value.trim();
        const eventType = document.getElementById('enquiry-event').value;
        const eventDate = document.getElementById('enquiry-date').value;
        const email = document.getElementById('enquiry-email').value.trim();
        const message = document.getElementById('enquiry-message').value.trim();

        // Validate
        let isValid = true;

        if (!name) {
            document.getElementById('error-name').textContent = 'Please enter your name';
            document.getElementById('enquiry-name').classList.add('error');
            isValid = false;
        }

        if (!phone) {
            document.getElementById('error-phone').textContent = 'Please enter your phone number';
            document.getElementById('enquiry-phone').classList.add('error');
            isValid = false;
        } else if (!/^[0-9\s\-\+]{10,15}$/.test(phone)) {
            document.getElementById('error-phone').textContent = 'Please enter a valid phone number';
            document.getElementById('enquiry-phone').classList.add('error');
            isValid = false;
        }

        if (!eventType) {
            document.getElementById('error-event').textContent = 'Please select an event type';
            document.getElementById('enquiry-event').classList.add('error');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = document.getElementById('form-submit-btn');
        const btnLabel = submitBtn.querySelector('.btn-label');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        submitBtn.disabled = true;
        btnLabel.style.display = 'none';
        btnIcon.style.display = 'none';
        btnLoading.style.display = 'inline-flex';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email, eventType, eventDate, message })
            });

            const data = await response.json();

            if (data.success) {
                // Construct WhatsApp Message
                const myWhatsAppNumber = "919849141451"; // Zahid Tent House WhatsApp Number (with country code)

                let waMessage = `*New Enquiry - Zahid Tent Decorators* 🎪\n\n`;
                waMessage += `*Name:* ${name}\n`;
                waMessage += `*Phone:* ${phone}\n`;
                if (email) waMessage += `*Email:* ${email}\n`;
                waMessage += `*Event Type:* ${eventType}\n`;
                if (eventDate) waMessage += `*Event Date:* ${eventDate}\n`;
                if (message) waMessage += `\n*Message:*\n${message}`;

                // Encode for URL
                const encodedMessage = encodeURIComponent(waMessage);
                const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodedMessage}`;

                // Show success toast
                showToast('success', 'Redirecting to WhatsApp...', 'Opening WhatsApp to send your enquiry.');

                // Reset form
                enquiryForm.reset();

                // Open WhatsApp in a new tab after a brief delay so they see the toast
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 1000);

            } else {
                showToast('error', 'Submission Failed', data.error || 'Please try again or call us directly.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showToast('error', 'Connection Error', 'Could not connect to server. Please try calling us at 098491 41451.');
        } finally {
            submitBtn.disabled = false;
            btnLabel.style.display = 'inline';
            btnIcon.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });

    // Clear error on input
    document.querySelectorAll('#enquiryForm input, #enquiryForm select, #enquiryForm textarea').forEach(input => {
        input.addEventListener('input', function () {
            this.classList.remove('error');
            const errorEl = this.parentElement.querySelector('.form-error');
            if (errorEl) errorEl.textContent = '';
        });
    });
}

// ==================== 3D TILT ANIMATION ====================
const tiltElements = document.querySelectorAll('.service-card, .gallery-item');

tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        el.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
        el.style.zIndex = '10';
        el.style.boxShadow = '0 20px 40px rgba(106, 27, 26, 0.2)';
    });
    
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        el.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        el.style.zIndex = '1';
        el.style.boxShadow = '';
    });
});

// ==================== INITIAL STATE ====================
handleNavScroll();
