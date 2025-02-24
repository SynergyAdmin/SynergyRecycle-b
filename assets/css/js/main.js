// Caricamento Componenti
function loadComponents() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => document.body.insertAdjacentHTML('afterbegin', data));
    
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => document.body.insertAdjacentHTML('beforeend', data));
}

// Gestione Form
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
        e.preventDefault();
        // Logica di invio
    });
});

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    // Altre inizializzazioni
    
    // CODICE DEBUG IMMAGINE - INIZIO
    const debugImageLoading = () => {
        const targetImage = document.querySelector('img[alt="Innovazione"]');
        
        if(!targetImage) {
            console.error('Nessuna immagine con alt="Innovazione" trovata');
            return;
        }

        fetch(targetImage.src)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                console.log('✅ Immagine caricata con successo:', targetImage.src);
            })
            .catch(err => {
                console.error('❌ Errore caricamento immagine:', err.message);
                console.log('Percorso assoluto tentato:', window.location.href + targetImage.src);
            });
    };

    debugImageLoading();
    // CODICE DEBUG IMMAGINE - FINE
});
});

// Intersection Observer per animazioni al scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Form Validation
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        if(validateForm(data)) {
            sendFormData(data);
        }
    });
}

function validateForm(data) {
    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(data.email)) {
        showError('Email non valida');
        return false;
    }
    
    // Altri controlli
    if(data.name.length < 2) {
        showError('Nome troppo breve');
        return false;
    }
    
    return true;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    contactForm.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

async function sendFormData(data) {
    try {
        // Simulazione invio
        const response = await fetch('https://api.example.com/contact', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if(response.ok) {
            alert('Messaggio inviato con successo!');
            contactForm.reset();
        }
    } catch (error) {
        showError('Errore nell\'invio del messaggio');
    }
}
