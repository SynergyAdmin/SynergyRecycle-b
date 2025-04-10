// assets/js/i18n.js

// Variabile globale per le traduzioni (accessibile anche dallo script inline)
window.currentTranslations = {};

document.addEventListener('DOMContentLoaded', () => {
    console.log("i18n.js: DOMContentLoaded event fired."); // DEBUG

    // --- CONFIGURATION ---
    const defaultLang = 'it';
    const localesPath = './assets/locales/'; // Assicurati che sia corretto!

    // --- STATE VARIABLES ---
    let currentLang = defaultLang; // Verrà sovrascritto dall'inizializzazione

    // --- DOM ELEMENTS ---
    // Li cerchiamo qui dentro DOMContentLoaded
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const mobileLanguageBtn = document.getElementById('mobile-language-btn');
    const mobileLanguageDropdown = document.getElementById('mobile-language-dropdown');
    const allLanguageOptions = document.querySelectorAll('.language-option[data-lang]');

    // Verifica se gli elementi sono stati trovati
    if (!languageBtn) console.error("i18n.js: Element with ID 'language-btn' not found!");
    if (!languageDropdown) console.error("i18n.js: Element with ID 'language-dropdown' not found!");
    if (!mobileLanguageBtn) console.error("i18n.js: Element with ID 'mobile-language-btn' not found!");
    if (!mobileLanguageDropdown) console.error("i18n.js: Element with ID 'mobile-language-dropdown' not found!");
    if (allLanguageOptions.length === 0) console.warn("i18n.js: No elements with '.language-option[data-lang]' found.");

    // --- HELPER FUNCTIONS ---
    function getTranslationValue(key) {
        if (!window.currentTranslations || typeof key !== 'string') return null;
        return key.split('.').reduce((obj, part) => {
            return obj && obj[part] !== undefined ? obj[part] : null;
        }, window.currentTranslations);
    }

    function closeAllLanguageDropdowns() {
        if (languageDropdown && languageDropdown.classList.contains('show')) {
            languageDropdown.classList.remove('show');
            if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
            console.log("i18n.js: Closed desktop dropdown."); // DEBUG
        }
        if (mobileLanguageDropdown && mobileLanguageDropdown.classList.contains('show')) {
            mobileLanguageDropdown.classList.remove('show');
            if (mobileLanguageBtn) mobileLanguageBtn.setAttribute('aria-expanded', 'false');
            console.log("i18n.js: Closed mobile dropdown."); // DEBUG
        }
    }

    // --- CORE I18N FUNCTIONS ---
    async function loadTranslations(lang) {
        console.log(`i18n.js: Attempting to load translations for ${lang}...`); // DEBUG
        try {
            const response = await fetch(`${localesPath}${lang}.json?v=${Date.now()}`); // Cache busting
            if (!response.ok) {
                 console.error(`i18n.js: HTTP error! status: ${response.status} for ${lang}.json`); // DEBUG
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            window.currentTranslations = await response.json(); // Salva globalmente
            console.log(`i18n.js: Translations successfully loaded for: ${lang}`); // DEBUG
            return true;
        } catch (error) {
            console.error(`i18n.js: Error loading translation file for ${lang}:`, error); // DEBUG
            window.currentTranslations = {}; // Resetta
            return false;
        }
    }

    function applyTranslations() {
        console.log("i18n.js: Applying translations..."); // DEBUG
        if (Object.keys(window.currentTranslations).length === 0) {
            console.warn("i18n.js: No translations loaded to apply."); // DEBUG
            return;
        }

        let appliedCount = 0;
        let attrAppliedCount = 0;

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getTranslationValue(key);
            if (translation !== null) {
                element.textContent = translation.replace('{year}', new Date().getFullYear());
                appliedCount++;
            } else {
                console.warn(`i18n.js: Missing translation for key: ${key}`);
            }
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const config = element.getAttribute('data-i18n-attr');
            const parts = config.split(':');
            if (parts.length === 2) {
                const attributeName = parts[0].trim();
                const key = parts[1].trim();
                const translation = getTranslationValue(key);
                if (translation !== null) {
                    element.setAttribute(attributeName, translation);
                    attrAppliedCount++;
                } else {
                    console.warn(`i18n.js: Missing translation for attribute key: ${key}`);
                }
            } else {
                console.warn(`i18n.js: Invalid data-i18n-attr format: ${config}`);
            }
        });

        document.documentElement.lang = currentLang;
        console.log(`i18n.js: Applied ${appliedCount} text translations and ${attrAppliedCount} attribute translations for ${currentLang}. Updated lang attribute.`); // DEBUG

        // Richiama l'aggiornamento della blockchain se la funzione globale esiste
        if (typeof window.createBlockchainVisualization === 'function') {
             console.log("i18n.js: Requesting blockchain visualization update."); // DEBUG
             if(document.getElementById('blockchain-viz')) {
                  document.getElementById('blockchain-viz').removeAttribute('data-initialized'); // Permette la ricreazione
             }
             window.createBlockchainVisualization();
        } else {
             console.warn("i18n.js: window.createBlockchainVisualization is not defined. Cannot update blockchain labels."); // DEBUG
        }
    }

    async function changeLanguage(lang) {
        if (!lang || (lang === currentLang && Object.keys(window.currentTranslations).length > 0)) {
            console.log(`i18n.js: Language ${lang} is already active or invalid. Aborting change.`); // DEBUG
            closeAllLanguageDropdowns();
            return;
        }
        console.log(`i18n.js: Changing language to: ${lang}`); // DEBUG
        currentLang = lang; // Aggiorna subito lo stato interno

        const loaded = await loadTranslations(lang);
        if (loaded) {
            applyTranslations();
            try { localStorage.setItem('selectedLanguage', lang); }
            catch (e) { console.warn("i18n.js: Could not save language preference:", e); }
        } else {
            console.error(`i18n.js: Failed to load translations for ${lang}. Language change aborted.`); // DEBUG
            // Considera di ripristinare currentLang alla lingua precedente qui
        }
        closeAllLanguageDropdowns();
    }

    // --- EVENT LISTENERS SETUP ---
    function handleLanguageSelect(event) {
        const target = event.currentTarget;
        const lang = target.getAttribute('data-lang');
        console.log(`i18n.js: Language option clicked: ${lang}`); // DEBUG
        if (lang) {
            changeLanguage(lang);
        } else {
             console.warn("i18n.js: Clicked language option missing data-lang attribute."); // DEBUG
        }
    }

    if (allLanguageOptions.length > 0) {
        allLanguageOptions.forEach(option => {
            option.addEventListener('click', handleLanguageSelect);
        });
    }

    // Listener per aprire/chiudere dropdown desktop
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCurrentlyShown = languageDropdown.classList.contains('show');
            // Chiudi sempre l'altro prima di aprirne uno
            if (mobileLanguageDropdown) mobileLanguageDropdown.classList.remove('show');
            if (mobileLanguageBtn) mobileLanguageBtn.setAttribute('aria-expanded', 'false');
            // Ora apri/chiudi quello corrente
            languageDropdown.classList.toggle('show');
            languageBtn.setAttribute('aria-expanded', !isCurrentlyShown);
            console.log(`i18n.js: Desktop language button clicked. Dropdown is now ${!isCurrentlyShown ? 'shown' : 'hidden'}.`); // DEBUG
        });
    }

    // Listener per aprire/chiudere dropdown mobile
    if (mobileLanguageBtn && mobileLanguageDropdown) {
        mobileLanguageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isCurrentlyShown = mobileLanguageDropdown.classList.contains('show');
             // Chiudi sempre l'altro prima di aprirne uno
            if (languageDropdown) languageDropdown.classList.remove('show');
            if (languageBtn) languageBtn.setAttribute('aria-expanded', 'false');
            // Ora apri/chiudi quello corrente
            mobileLanguageDropdown.classList.toggle('show');
            mobileLanguageBtn.setAttribute('aria-expanded', !isCurrentlyShown);
             console.log(`i18n.js: Mobile language button clicked. Dropdown is now ${!isCurrentlyShown ? 'shown' : 'hidden'}.`); // DEBUG
        });
    }

    // Listener per chiudere cliccando fuori
    document.addEventListener('click', (e) => {
        // Controlla se il click è avvenuto FUORI dai bottoni E dai dropdown
        let clickedOutside = true;
        if (languageBtn && languageBtn.contains(e.target)) clickedOutside = false;
        if (languageDropdown && languageDropdown.contains(e.target)) clickedOutside = false;
        if (mobileLanguageBtn && mobileLanguageBtn.contains(e.target)) clickedOutside = false;
        if (mobileLanguageDropdown && mobileLanguageDropdown.contains(e.target)) clickedOutside = false;

        if (clickedOutside) {
            // Solo se abbiamo effettivamente cliccato fuori, chiudi tutto
            // console.log("i18n.js: Clicked outside language selectors, closing dropdowns."); // DEBUG (può essere rumoroso)
            closeAllLanguageDropdowns();
        }
    });

    // Impedire ai click *dentro* i dropdown di propagare e chiudere il dropdown stesso
    // (Questo potrebbe non essere strettamente necessario con il check document.addEventListener sopra, ma è una sicurezza)
    if (languageDropdown) languageDropdown.addEventListener('click', e => e.stopPropagation());
    if (mobileLanguageDropdown) mobileLanguageDropdown.addEventListener('click', e => e.stopPropagation());


    // --- INITIALIZATION ---
    async function initializeI18n() {
         let initialLang = defaultLang;
         try {
             const savedLang = localStorage.getItem('selectedLanguage');
             if (savedLang) initialLang = savedLang;
         } catch(e) { console.warn("i18n.js: Could not read language preference:", e); }

        console.log(`i18n.js: Initializing with language: ${initialLang}`); // DEBUG
        currentLang = initialLang; // Imposta stato interno

        const loaded = await loadTranslations(initialLang);
        if (loaded) {
            applyTranslations();
        } else {
            if (initialLang !== defaultLang) {
                console.warn(`i18n.js: Failed initial load for ${initialLang}, falling back to ${defaultLang}`); // DEBUG
                currentLang = defaultLang; // Aggiorna stato
                const fallbackLoaded = await loadTranslations(defaultLang);
                if (fallbackLoaded) {
                    applyTranslations();
                } else {
                     console.error(`i18n.js: CRITICAL: Could not load default language file (${defaultLang}).`); // DEBUG
                }
            } else {
                 console.error(`i18n.js: CRITICAL: Could not load default language file (${defaultLang}).`); // DEBUG
            }
        }
    }

    // Esegui l'inizializzazione
    initializeI18n();

}); // Fine DOMContentLoaded
