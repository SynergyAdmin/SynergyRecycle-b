// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    initSmoothScroll();
    initIntersectionObserver();
    initFormValidation();
});

async function loadComponents() {
    try {
        // Carica header e footer
        const headerResponse = await fetch('./components/header.html');
        const footerResponse = await fetch('./components/footer.html');
        
        const header = await headerResponse.text();
        const footer = await footerResponse.text();
        
        document.getElementById('header-container').innerHTML = header;
        document.getElementById('footer-container').innerHTML = footer;
        
        // IMPORTANTE: inizializza il menu mobile DOPO che l'header è stato inserito nel DOM
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

// Aggiungi event listener per tutti i pulsanti di copia all'avvio della pagina
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza gli indirizzi in formato abbreviato
    document.querySelectorAll('.crypto-value').forEach(element => {
        const address = element.getAttribute('data-address');
        
        if (address.length > 12) {
            element.textContent = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        
        // Aggiungi event listener per espandere/comprimere
        element.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                this.textContent = this.getAttribute('data-address');
            } else {
                const addr = this.getAttribute('data-address');
                if (addr.length > 12) {
                    this.textContent = addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
                }
            }
        });
    });
    
    // Aggiungi feedback visivo ai pulsanti
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Aggiungi un console.log per verificare che lo script si carichi
console.log('Script per la gestione degli indirizzi wallet caricato correttamente');
