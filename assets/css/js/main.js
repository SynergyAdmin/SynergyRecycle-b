// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Funzioni principali
    loadComponents();
    initSmoothScroll();
    initIntersectionObserver();
    initFormValidation();
    
    // Inizializza la gestione degli indirizzi crypto
    initCryptoAddresses();
    
    console.log('Script principale caricato correttamente');
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
    // Seleziona sia il pulsante standard che quello hamburger
    const hamburgerBtn = document.getElementById('hamburger-btn') || document.querySelector('.hamburger-btn');
    // Seleziona sia la navigazione mobile che il menu standard
    const mobileNav = document.getElementById('mobile-nav') || document.querySelector('.nav-menu');
    
    if (!hamburgerBtn || !mobileNav) {
        console.warn('Menu mobile elements not found');
        return;
    }
    
    hamburgerBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const isExpanded = mobileNav.classList.contains('active');
        hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        
        // Cambia il simbolo dell'hamburger quando è aperto (se presente)
        if (hamburgerBtn.textContent) {
            hamburgerBtn.textContent = isExpanded ? '✕' : '☰';
        }
    });
    
    // Chiudi il menu quando si clicca su un link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            if (hamburgerBtn.textContent) {
                hamburgerBtn.textContent = '☰';
            }
        });
    });
    
    console.log('Menu mobile inizializzato');
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

function initCryptoAddresses() {
    // Inizializza gli indirizzi in formato abbreviato
    document.querySelectorAll('.crypto-value').forEach(element => {
        const address = element.getAttribute('data-address');
        
        if (address && address.length > 12) {
            element.textContent = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        
        // Aggiungi event listener per espandere/comprimere
        element.addEventListener('click', function() {
            this.classList.toggle('expanded');
            
            if (this.classList.contains('expanded')) {
                this.textContent = this.getAttribute('data-address');
            } else {
                const addr = this.getAttribute('data-address');
                if (addr && addr.length > 12) {
                    this.textContent = addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);
                }
            }
        });
    });
    
    // Gestione dei pulsanti di copia
    document.querySelectorAll('.copy-btn').forEach(button => {
        // Aggiungi feedback visivo
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Aggiungi funzionalità di copia
        button.addEventListener('click', function() {
            const valueElement = this.closest('.crypto-address').querySelector('.crypto-value');
            const textToCopy = valueElement.getAttribute('data-address');
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Mostra il messaggio di copia
                    const copyMsg = this.parentNode.querySelector('.copy-msg');
                    if (copyMsg) {
                        copyMsg.classList.add('show');
                        setTimeout(() => {
                            copyMsg.classList.remove('show');
                        }, 2000);
                    }
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
        });
    });
    
    console.log('Gestione indirizzi crypto inizializzata');
}
