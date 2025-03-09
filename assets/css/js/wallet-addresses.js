/**
 * Funzione di copia migliorata per gli indirizzi wallet
 * Utilizza sia il metodo moderno che un metodo di fallback
 */

// Funzione principale per copiare l'indirizzo
function copyAddress(elementId) {
    const element = document.getElementById(elementId);
    const fullAddress = element.getAttribute('data-address');
    
    // Tenta prima con il metodo moderno
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullAddress)
            .then(() => {
                showCopySuccess(elementId);
            })
            .catch(err => {
                // Se fallisce, usa il metodo alternativo
                fallbackCopyTextToClipboard(fullAddress, elementId);
            });
    } else {
        // Per browser che non supportano l'API Clipboard
        fallbackCopyTextToClipboard(fullAddress, elementId);
    }
}

// Metodo di fallback per copiare il testo usando execCommand
function fallbackCopyTextToClipboard(text, elementId) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Rendi l'elemento invisibile ma parte del DOM
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        // Esegui il comando di copia
        var successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(elementId);
        } else {
            console.error('Fallback: Impossibile copiare');
        }
    } catch (err) {
        console.error('Fallback: Impossibile copiare', err);
    }
    
    document.body.removeChild(textArea);
}

// Funzione per mostrare il messaggio di successo
function showCopySuccess(elementId) {
    const copyMsg = document.getElementById(elementId + '-copy-msg');
    copyMsg.classList.add('show');
    
    // Aggiungi feedback visivo più evidente anche all'indirizzo
    const addressElement = document.getElementById(elementId);
    addressElement.style.backgroundColor = "rgba(40, 167, 69, 0.2)"; // Verde chiaro
    
    // Rimuovi il feedback dopo 2 secondi
    setTimeout(() => {
        copyMsg.classList.remove('show');
        addressElement.style.backgroundColor = "";
    }, 2000);
}

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
