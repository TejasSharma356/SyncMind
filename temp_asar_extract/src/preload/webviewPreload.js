const { contextBridge, ipcRenderer } = require('electron');

// We are injecting this script directly into the <webview> environment.
// Due to isolation, we interact with the DOM and use ipcRenderer to communicate with the HOST (App.jsx).

// Helper: Try to click the CC button on Google Meet or Teams
function autoEnableCaptions() {
    const host = window.location.hostname;

    const attemptClick = setInterval(() => {
        let clicked = false;

        // Google Meet CC Button Selector (often aria-label contains Turn on captions)
        if (host.includes('meet.google.com')) {
            const ccButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
                const label = btn.getAttribute('aria-label');
                return label && label.toLowerCase().includes('turn on captions');
            });
            if (ccButtons.length > 0) {
                ccButtons[0].click();
                clicked = true;
                console.log("Hybrid Sensor: Auto-enabled Google Meet Captions");
            }
        }
        // MS Teams CC Button Selector (very dynamic, trying standard generic attributes)
        else if (host.includes('teams.microsoft.com')) {
            // Teams often requires opening 'More' menu first, this is a simplified approach
            // Look for a turn on live captions button directly or by aria-label
            const ccButtons = Array.from(document.querySelectorAll('button, [role="button"]')).filter(el => {
                const text = (el.innerText || el.getAttribute('aria-label') || '').toLowerCase();
                return text.includes('turn on live captions') || text.includes('live captions');
            });
            if (ccButtons.length > 0) {
                ccButtons[0].click();
                clicked = true;
                console.log("Hybrid Sensor: Auto-enabled MS Teams Captions");
            }
        }

        if (clicked || document.querySelector('.caption-content, .VfPpkd-vQzf8d, .ts-message-text')) {
            clearInterval(attemptClick); // Stop attempting once we clicked or captions are present
        }
    }, 5000);
}

// Start watching the DOM for captions
function startMutationObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    // Google Meet selector: .VfPpkd-vQzf8d (text) and earlier name container
                    // Microsoft Teams selector: .ts-message-text or .ui-chat__message
                    // Generic fallback: .caption-content

                    let text = '';
                    let name = 'Unknown Speaker';

                    // Try Google Meet Structure
                    if (node.classList && node.classList.contains('VfPpkd-vQzf8d')) {
                        text = node.innerText || node.textContent;
                        // Seek parent or sibling for name in Meet
                        const container = node.closest('.Tmb7Fd'); // just a guess class, usually changes
                        if (container) {
                            const nameEl = container.querySelector('.zs7s8d, .name'); // placeholder classes
                            if (nameEl) name = nameEl.innerText;
                        }
                        if (!name || name === 'Unknown Speaker') name = 'Speaker (Meet)';
                    }
                    // Try MS Teams Structure
                    else if (node.matches && (node.matches('.ts-message-text') || node.classList.contains('caption-content'))) {
                        text = node.innerText || node.textContent;
                        // Seek previous sibling or container for name
                        const container = node.closest('.ts-message, .ui-chat__message');
                        if (container) {
                            const nameEl = container.querySelector('.ts-msg-name, .ui-chat__message__author');
                            if (nameEl) name = nameEl.innerText;
                        }
                        if (!name || name === 'Unknown Speaker') name = 'Speaker (Teams)';
                    }

                    if (text && text.trim().length > 0) {
                        // Send back to the HOST renderer window
                        ipcRenderer.sendToHost('new-caption', { name, text: text.trim() });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log('Hybrid Sensor: Live Meeting Portal Observer Started.');
}

window.addEventListener('load', () => {
    autoEnableCaptions();
    startMutationObserver();
});
