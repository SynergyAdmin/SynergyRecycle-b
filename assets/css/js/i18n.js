// assets/js/i18n.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const defaultLang = 'it'; // Lingua predefinita se nessuna è salvata/selezionata
    const localesPath = './assets/locales/'; // Percorso relativo a index.html

    // --- STATE VARIABLES ---
    let currentLang = defaultLang;
    let translations = {}; // Oggetto per contenere le traduzioni caricate

    // --- DOM ELEMENTS ---
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const mobileLanguageBtn = document.getElementById('mobile-language-btn');
    const mobileLanguageDropdown = document.getElementById('mobile-language-dropdown');
    const allLanguageOptions = document.querySelectorAll('.language-option[data-lang]'); // Seleziona solo quelli con data-lang

    // --- HELPER FUNCTIONS ---

    /**
     * Ottiene il valore della traduzione da una chiave potenzialmente annidata.
     * @param {string} key - La chiave della traduzione (es. "hero.title").
     * @returns {string|null} Il testo tradotto o null se non trovato.
     */
    function getTranslationValue(key) {
        if (!translations || typeof key !== 'string') return null;
        return key.split('.').reduce((obj, part) => {
            return obj && obj[part] !== undefined ? obj[part] : null;
        }, translations);
    }

    /**
     * Chiude entrambi i menu a tendina della lingua.
     */
    function closeAllLanguageDropdowns() {
        if (languageDropdown) languageDropdown.classList.remove('show');
        if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
        if (mobileLanguageDropdown) mobileLanguageDropdown.classList.remove('show');
        if (mobileLanguageBtn) mobileLanguageBtn.setAttribute('aria-expanded', 'false');
    }

    // --- CORE I18N FUNCTIONS ---

    /**
     * Carica il file JSON della lingua specificata.
     * @param {string} lang - Il codice della lingua (es. "en", "de").
     * @returns {Promise<boolean>} True se caricato con successo, altrimenti False.
     */
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`${localesPath}${lang}.json?v=${Date.now()}`); // Aggiungi cache busting
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            translations = await response.json();
            console.log(`Translations loaded for: ${lang}`);
            return true;
        } catch (error) {
            console.error(`Error loading translation file for ${lang}:`, error);
            translations = {}; // Resetta le traduzioni in caso di errore
            return false;
        }
    }

    /**
     * Applica le traduzioni attualmente caricate agli elementi del DOM.
     */
    function applyTranslations() {
        if (Object.keys(translations).length === 0) {
            console.warn("Attempted to apply translations, but none are loaded.");
            return;
        }

        // Applica traduzioni al testo interno degli elementi
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getTranslationValue(key);
            if (translation !== null) {
                // Sostituisci placeholder {year} se presente (es. nel footer)
                element.textContent = translation.replace('{year}', new Date().getFullYear());
            } else {
                console.warn(`Missing translation for key: ${key}`);
                // Potresti voler lasciare il testo originale o mettere un placeholder
                // element.textContent = key; // Mostra la chiave se la traduzione manca
            }
        });

        // Applica traduzioni agli attributi degli elementi
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const config = element.getAttribute('data-i18n-attr');
            const parts = config.split(':');
            if (parts.length === 2) {
                const attributeName = parts[0].trim();
                const key = parts[1].trim();
                const translation = getTranslationValue(key);
                if (translation !== null) {
                    element.setAttribute(attributeName, translation);
                } else {
                    console.warn(`Missing translation for attribute key: ${key}`);
                }
            } else {
                console.warn(`Invalid data-i18n-attr format: ${config}`);
            }
        });

        // Aggiorna l'attributo lang della pagina
        document.documentElement.lang = currentLang;

        // Potrebbe essere necessario aggiornare componenti dinamici qui,
        // ad esempio le etichette della visualizzazione blockchain se è già stata inizializzata.
        // Se la logica della blockchain è in un altro file, potrebbe essere necessario
        // inviare un evento personalizzato o chiamare una funzione globale per aggiornarla.
        const blockchainVizContainer = document.getElementById('blockchain-viz');
        if (blockchainVizContainer && typeof window.createBlockchainVisualization === 'function') {
             // Verifica se la funzione esiste globalmente
             if (blockchainVizContainer.dataset.initialized === 'true') {
                 console.log('Requesting blockchain visualization update due to language change.');
                 blockchainVizContainer.removeAttribute('data-initialized'); // Permette la ricreazione
                 window.createBlockchainVisualization(); // Chiama la funzione per aggiornare le etichette
             }
        } else if(blockchainVizContainer) {
             // Se la funzione non è globale, potresti dover gestire l'aggiornamento
             // in modo diverso, magari leggendo direttamente le etichette tradotte
             // nello script della blockchain quando viene eseguito.
             console.log("Blockchain visualization found, but update function is not globally accessible or viz not initialized.");
        }

    }

    /**
     * Funzione principale per cambiare la lingua.
     * @param {string} lang - Il codice della lingua a cui passare.
     */
    async function changeLanguage(lang) {
        if (!lang || lang === currentLang && Object.keys(translations).length > 0) {
            console.log(`Language ${lang} is already active or invalid.`);
            closeAllLanguageDropdowns();
            return; // Non fare nulla se la lingua è la stessa o non valida
        }

        console.log(`Changing language to: ${lang}`);
        currentLang = lang;

        // Carica le nuove traduzioni
        const loaded = await loadTranslations(lang);

        if (loaded) {
            // Applica le traduzioni al DOM
            applyTranslations();
            // Salva la preferenza dell'utente
            try {
                 localStorage.setItem('selectedLanguage', lang);
            } catch (e) {
                 console.warn("Could not save language preference to localStorage:", e);
            }
        } else {
            // Gestisci il fallimento del caricamento (es. torna alla lingua precedente o default)
            console.error(`Failed to load translations for ${lang}. Reverting might be needed.`);
            // Potresti voler ricaricare la lingua precedente qui
        }

        closeAllLanguageDropdowns();
    }

    // --- EVENT LISTENERS SETUP ---

    /**
     * Gestisce il click su un'opzione di lingua nel dropdown.
     * @param {Event} event - L'oggetto evento del click.
     */
    function handleLanguageSelect(event) {
        const target = event.currentTarget; // L'elemento .language-option cliccato
        const lang = target.getAttribute('data-lang');
        if (lang) {
            changeLanguage(lang);
        }
    }

    // Aggiungi listener a tutte le opzioni di lingua
    if (allLanguageOptions.length > 0) {
        allLanguageOptions.forEach(option => {
            option.addEventListener('click', handleLanguageSelect);
        });
    } else {
        console.warn("No language options with [data-lang] attribute found.");
    }

    // Aggiungi listener per aprire/chiudere i dropdown
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = languageDropdown.classList.toggle('show');
            languageBtn.setAttribute('aria-expanded', isShown);
            // Chiudi l'altro dropdown se aperto
            if (mobileLanguageDropdown) mobileLanguageDropdown.classList.remove('show');
            if (mobileLanguageBtn) mobileLanguageBtn.setAttribute('aria-expanded', 'false');
        });
    }

    if (mobileLanguageBtn && mobileLanguageDropdown) {
        mobileLanguageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = mobileLanguageDropdown.classList.toggle('show');
            mobileLanguageBtn.setAttribute('aria-expanded', isShown);
            // Chiudi l'altro dropdown se aperto
            if (languageDropdown) languageDropdown.classList.remove('show');
            if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Aggiungi listener per chiudere i dropdown cliccando fuori
    document.addEventListener('click', closeAllLanguageDropdowns);

    // Impedisci la chiusura quando si clicca *dentro* i dropdown
    if (languageDropdown) {
        languageDropdown.addEventListener('click', e => e.stopPropagation());
    }
    if (mobileLanguageDropdown) {
        mobileLanguageDropdown.addEventListener('click', e => e.stopPropagation());
    }


    // --- INITIALIZATION ---

    /**
     * Inizializza il sistema i18n caricando la lingua appropriata.
     */
    async function initializeI18n() {
         let initialLang = defaultLang;
         try {
             const savedLang = localStorage.getItem('selectedLanguage');
             if (savedLang) {
                 // Verifica se abbiamo un file JSON per la lingua salvata (opzionale ma buono)
                 // Potresti fare un fetch HEAD qui, ma per ora assumiamo sia valida
                 initialLang = savedLang;
             }
         } catch(e) {
             console.warn("Could not read language preference from localStorage:", e);
         }


        console.log(`Initializing i18n with language: ${initialLang}`);
        currentLang = initialLang; // Imposta subito currentLang

        // Carica e applica le traduzioni iniziali
        const loaded = await loadTranslations(initialLang);
        if (loaded) {
            applyTranslations();
        } else {
            // Se il caricamento fallisce (es. lingua salvata non valida), prova con il default
            if (initialLang !== defaultLang) {
                console.warn(`Failed to load initial language ${initialLang}, falling back to ${defaultLang}`);
                currentLang = defaultLang; // Aggiorna currentLang al default
                const fallbackLoaded = await loadTranslations(defaultLang);
                if (fallbackLoaded) {
                    applyTranslations();
                } else {
                     console.error(`CRITICAL: Could not load default language file (${defaultLang}). Internationalization may not work.`);
                     // A questo punto, la pagina mostrerà il testo HTML originale
                }
            } else {
                 console.error(`CRITICAL: Could not load default language file (${defaultLang}). Internationalization may not work.`);
            }
        }
    }

    // Esegui l'inizializzazione
    initializeI18n();

}); // Fine DOMContentLoaded
