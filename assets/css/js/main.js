// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initSmoothScroll();
    initIntersectionObserver();
    initFormValidation();
});

async function loadComponents() {
    try {
        const [header, footer] = await Promise.all([
            fetch('components/header.html').then(r => r.text()),
            fetch('components/footer.html').then(r => r.text())
        ]);
        
        document.body.insertAdjacentHTML('afterbegin', header);
        document.body.insertAdjacentHTML('beforeend', footer);
        initMobileMenu();
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburgerBtn?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('active', entry.isIntersecting);
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        // Add validation logic
    });
}
