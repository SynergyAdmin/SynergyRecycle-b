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
