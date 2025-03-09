// Lingua predefinita
let currentLanguage = 'it';

// Funzione per caricare le traduzioni
async function loadTranslations(lang) {
    try {
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) throw new Error(`Errore nel caricamento delle traduzioni: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Errore nel caricamento delle traduzioni:', error);
        return null;
    }
}

// Funzione per ottenere il valore annidato da un oggetto usando una notazione a punti
function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => prev ? prev[curr] : null, obj);
}

// Funzione per applicare le traduzioni alla pagina
function applyTranslations(translations) {
    if (!translations) return;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(translations, key);
        
        if (translation) {
            // Se è un input, textarea o select, imposta l'attributo placeholder o value
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.getAttribute('placeholder')) {
                    element.setAttribute('placeholder', translation);
                } else {
                    element.value = translation;
                }
            } else if (element.tagName === 'SELECT') {
                // Per i select, dobbiamo tradurre le opzioni
                element.childNodes.forEach(option => {
                    if (option.nodeType === 1) { // È un elemento
                        const optionKey = option.getAttribute('data-i18n');
                        if (optionKey) {
                            const optionTranslation = getNestedValue(translations, optionKey);
                            if (optionTranslation) option.textContent = optionTranslation;
                        }
                    }
                });
            } else {
                // Per tutti gli altri elementi, imposta il testo
                element.textContent = translation;
            }
        }
    });
    
    // Imposta l'attributo lang dell'HTML
    document.documentElement.lang = currentLanguage;
}

// Funzione per cambiare lingua
async function changeLanguage(lang) {
    currentLanguage = lang;
    const translations = await loadTranslations(lang);
    applyTranslations(translations);
    // Salva la preferenza della lingua
    localStorage.setItem('preferredLanguage', lang);
}

// Funzione per inizializzare le traduzioni
async function initializeTranslations() {
    // Controlla se c'è una preferenza di lingua salvata
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLanguage = savedLanguage;
    }
    
    // Carica e applica le traduzioni
    const translations = await loadTranslations(currentLanguage);
    applyTranslations(translations);
}

// Inizializza le traduzioni al caricamento della pagina
document.addEventListener('DOMContentLoaded', initializeTranslations);

// Esponi la funzione di cambio lingua globalmente
window.changeLanguage = changeLanguage;
