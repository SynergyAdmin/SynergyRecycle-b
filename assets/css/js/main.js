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
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!hamburgerBtn || !mobileNav) return;
    
    hamburgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const isExpanded = mobileNav.classList.contains('active');
        hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        
        // Cambia il simbolo dell'hamburger quando è aperto
        hamburgerBtn.textContent = isExpanded ? '✕' : '☰';
    });
    
    // Chiudi il menu quando si clicca su un link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.textContent = '☰';
        });
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

// Funzione per copiare l'indirizzo
    function copyAddress(elementId) {
        const element = document.getElementById(elementId);
        const fullAddress = element.getAttribute('data-address');
        
        // Copia negli appunti
        navigator.clipboard.writeText(fullAddress).then(() => {
            // Mostra messaggio di conferma
            const copyMsg = document.getElementById(elementId + '-copy-msg');
            copyMsg.classList.add('show');
            
            // Nascondi dopo 2 secondi
            setTimeout(() => {
                copyMsg.classList.remove('show');
            }, 2000);
        });
    }
    
    // Funzione per espandere/comprimere l'indirizzo
    document.querySelectorAll('.crypto-value').forEach(element => {
        element.addEventListener('click', function() {
            // Toggle tra versione abbreviata e completa
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                // Mostra indirizzo completo
                this.textContent = this.getAttribute('data-address');
            } else {
                // Mostra versione abbreviata
                const address = this.getAttribute('data-address');
                // Primi 6 caratteri + ... + ultimi 4 caratteri
                this.textContent = address.substring(0, 6) + '...' + address.substring(address.length - 4);
            }
        });
    });
</script>
