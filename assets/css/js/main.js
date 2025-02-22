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
