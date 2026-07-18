// Application logic for MultiFrame Workspace

document.addEventListener('DOMContentLoaded', () => {
    // Icons initialization
    lucide.createIcons();

    // DOM Elements
    const workspaceGrid = document.getElementById('workspace-grid');
    const layoutButtons = document.querySelectorAll('.layout-btn');
    const presetSelector = document.getElementById('preset-selector');
    const btnSaveAll = document.getElementById('btn-save-all');
    const btnHelp = document.getElementById('btn-help');
    const helpModal = document.getElementById('help-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const toastContainer = document.getElementById('toast-container');

    const framesCount = 4;
    const frameStates = {};

    // Standard Presets data
    const presets = {
        localhost: [
            { name: "Port 3000", url: "http://localhost:3000" },
            { name: "Port 3001", url: "http://localhost:3001" },
            { name: "Port 3002", url: "http://localhost:3002" },
            { name: "Port 3003", url: "http://localhost:3003" }
        ],
        search: [
            { name: "Bing", url: "https://www.bing.com" },
            { name: "DuckDuckGo", url: "https://duckduckgo.com" },
            { name: "Yahoo", url: "https://search.yahoo.com" },
            { name: "Ecosia", url: "https://www.ecosia.org" }
        ],
        news: [
            { name: "G1", url: "https://g1.globo.com" },
            { name: "UOL", url: "https://www.uol.com.br" },
            { name: "CNN Brasil", url: "https://www.cnnbrasil.com.br" },
            { name: "BBC Brasil", url: "https://www.bbc.com/portuguese" }
        ]
    };

    // Load general state from localStorage
    function loadSavedState() {
        // Load layout
        const savedLayout = localStorage.getItem('workspace-layout') || 'grid';
        changeLayout(savedLayout);

        // Load each frame configuration
        for (let i = 1; i <= framesCount; i++) {
            const nameVal = localStorage.getItem(`frame-name-${i}`) || `Conta ${i}`;
            const urlVal = localStorage.getItem(`frame-url-${i}`) || '';
            const zoomVal = localStorage.getItem(`frame-zoom-${i}`) || '1';

            // Set DOM values
            document.getElementById(`name-${i}`).value = nameVal;
            document.getElementById(`url-${i}`).value = urlVal;
            document.getElementById(`zoom-select-${i}`).value = zoomVal;

            // Set Credentials Drawer values
            document.getElementById(`username-${i}`).value = localStorage.getItem(`cred-user-${i}`) || '';
            document.getElementById(`password-${i}`).value = localStorage.getItem(`cred-pass-${i}`) || '';

            // Apply scale/zoom and load URL in iframe
            applyIframeZoom(i, parseFloat(zoomVal));
            if (urlVal) {
                loadIframeUrl(i, urlVal);
            } else {
                hideLoader(i);
            }
        }
    }

    // Save all states manually
    function saveAllState() {
        for (let i = 1; i <= framesCount; i++) {
            const nameVal = document.getElementById(`name-${i}`).value;
            const urlVal = document.getElementById(`url-${i}`).value;
            const zoomVal = document.getElementById(`zoom-select-${i}`).value;
            const userVal = document.getElementById(`username-${i}`).value;
            const passVal = document.getElementById(`password-${i}`).value;

            localStorage.setItem(`frame-name-${i}`, nameVal);
            localStorage.setItem(`frame-url-${i}`, urlVal);
            localStorage.setItem(`frame-zoom-${i}`, zoomVal);
            localStorage.setItem(`cred-user-${i}`, userVal);
            localStorage.setItem(`cred-pass-${i}`, passVal);
        }
        showToast('Configurações salvas com sucesso!', 'success');
    }

    // Toast Notification helper
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconHtml = '<i data-lucide="info" class="toast-info-icon"></i>';
        if (type === 'success') {
            iconHtml = '<i data-lucide="check-circle-2" class="toast-success-icon"></i>';
        }
        
        toast.innerHTML = `${iconHtml}<span>${message}</span>`;
        toastContainer.appendChild(toast);
        lucide.createIcons({ attrs: { class: 'toast-icon' } });

        // Auto remove toast
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    // Layout configuration switcher
    function changeLayout(layoutName) {
        workspaceGrid.className = 'workspace-grid'; // Reset classes
        workspaceGrid.classList.add(`${layoutName}-layout`);

        layoutButtons.forEach(btn => {
            if (btn.getAttribute('data-layout') === layoutName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        localStorage.setItem('workspace-layout', layoutName);
    }

    // Iframe scale adjustment (transform scale calculation)
    function applyIframeZoom(id, scale) {
        const iframe = document.getElementById(`iframe-${id}`);
        if (!iframe) return;

        if (scale === 1) {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.transform = 'none';
        } else {
            const pct = (100 / scale) + '%';
            iframe.style.width = pct;
            iframe.style.height = pct;
            iframe.style.transform = `scale(${scale})`;
        }
    }

    // Load URL in iframe with protocol validation
    function loadIframeUrl(id, url) {
        if (!url) return;
        
        showLoader(id);
        const iframe = document.getElementById(`iframe-${id}`);

        // Automatically append protocol if missing
        let parsedUrl = url.trim();
        if (!/^https?:\/\//i.test(parsedUrl)) {
            parsedUrl = 'https://' + parsedUrl;
            document.getElementById(`url-${id}`).value = parsedUrl;
        }

        // Apply URL source
        iframe.src = parsedUrl;

        // Auto-save changes on URL edit
        localStorage.setItem(`frame-url-${id}`, parsedUrl);
    }

    // Loading indicator toggling
    function showLoader(id) {
        document.getElementById(`loader-${id}`).classList.remove('hidden');
    }

    function hideLoader(id) {
        document.getElementById(`loader-${id}`).classList.add('hidden');
    }

    // Iframe loading trigger cleanup
    for (let i = 1; i <= framesCount; i++) {
        const iframe = document.getElementById(`iframe-${i}`);
        iframe.addEventListener('load', () => {
            hideLoader(i);
        });

        // Event for pressing Enter in URL input
        const urlInput = document.getElementById(`url-${i}`);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadIframeUrl(i, urlInput.value);
            }
        });
        urlInput.addEventListener('blur', () => {
            loadIframeUrl(i, urlInput.value);
        });

        // Name input auto-save on blur
        const nameInput = document.getElementById(`name-${i}`);
        nameInput.addEventListener('blur', () => {
            localStorage.setItem(`frame-name-${i}`, nameInput.value);
        });

        // Content Zoom selector action
        const zoomSelect = document.getElementById(`zoom-select-${i}`);
        zoomSelect.addEventListener('change', () => {
            const scale = parseFloat(zoomSelect.value);
            applyIframeZoom(i, scale);
            localStorage.setItem(`frame-zoom-${i}`, scale);
        });

        // Reload Button click listener
        document.getElementById(`reload-btn-${i}`).addEventListener('click', () => {
            const url = urlInput.value;
            if (url) {
                loadIframeUrl(i, url);
            } else {
                showToast(`Nenhuma URL configurada para o painel ${i}`, 'info');
            }
        });

        // Maximize Zoom Toggle
        const maxBtn = document.getElementById(`max-btn-${i}`);
        const card = document.getElementById(`frame-card-${i}`);
        
        const toggleMaximize = () => {
            const isMaximized = card.classList.contains('maximized');
            
            // De-maximize all cards first
            document.querySelectorAll('.frame-card').forEach(c => {
                c.classList.remove('maximized');
                const btn = c.querySelector('.btn-maximize');
                btn.innerHTML = '<i data-lucide="maximize-2"></i>';
            });

            if (!isMaximized) {
                card.classList.add('maximized');
                maxBtn.innerHTML = '<i data-lucide="minimize-2"></i>';
                showToast(`Grade ${i} maximizada. Clique novamente ou pressione Esc para restaurar.`, 'info');
            } else {
                maxBtn.innerHTML = '<i data-lucide="maximize-2"></i>';
            }
            lucide.createIcons();
        };

        maxBtn.addEventListener('click', toggleMaximize);
        
        // Double-click on header to maximize
        card.querySelector('.frame-header').addEventListener('dblclick', (e) => {
            // Check it is not inside input or buttons
            if (e.target.tagName !== 'INPUT' && !e.target.closest('.frame-header-controls')) {
                toggleMaximize();
            }
        });

        // Locker drawer toggler
        const lockerBtn = document.getElementById(`locker-btn-${i}`);
        const drawer = document.getElementById(`drawer-${i}`);
        lockerBtn.addEventListener('click', () => {
            drawer.classList.toggle('open');
            lockerBtn.classList.toggle('active');
        });

        // Toggle password visibility
        const togglePwBtn = document.getElementById(`toggle-pw-${i}`);
        const pwInput = document.getElementById(`password-${i}`);
        togglePwBtn.addEventListener('click', () => {
            const isPassword = pwInput.type === 'password';
            pwInput.type = isPassword ? 'text' : 'password';
            togglePwBtn.innerHTML = isPassword ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
            lucide.createIcons();
        });

        // Copy credentials actions
        const copyUserBtn = document.getElementById(`copy-user-1` === `copy-user-${i}` ? `copy-user-1` : `copy-user-${i}`);
        document.getElementById(`copy-user-${i}`).addEventListener('click', () => {
            const inputVal = document.getElementById(`username-${i}`).value;
            if (inputVal) {
                navigator.clipboard.writeText(inputVal).then(() => {
                    showToast('Nome de usuário copiado!', 'success');
                    animateCopyBtn(document.getElementById(`copy-user-${i}`));
                });
            } else {
                showToast('Campo de usuário vazio.', 'info');
            }
        });

        document.getElementById(`copy-pw-${i}`).addEventListener('click', () => {
            const inputVal = pwInput.value;
            if (inputVal) {
                navigator.clipboard.writeText(inputVal).then(() => {
                    showToast('Senha copiada!', 'success');
                    animateCopyBtn(document.getElementById(`copy-pw-${i}`));
                });
            } else {
                showToast('Campo de senha vazio.', 'info');
            }
        });

        // Save credential action
        document.getElementById(`save-cred-${i}`).addEventListener('click', () => {
            const userVal = document.getElementById(`username-${i}`).value;
            const passVal = pwInput.value;
            localStorage.setItem(`cred-user-${i}`, userVal);
            localStorage.setItem(`cred-pass-${i}`, passVal);
            drawer.classList.remove('open');
            lockerBtn.classList.remove('active');
            showToast(`Credenciais da Conta ${i} salvas com sucesso!`, 'success');
        });
    }

    // Copy button temporary tick icon animation
    function animateCopyBtn(btn) {
        btn.classList.add('copied');
        btn.innerHTML = '<i data-lucide="check"></i>';
        lucide.createIcons();
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = '<i data-lucide="copy"></i>';
            lucide.createIcons();
        }, 1500);
    }

    // Escape key listener to close maximized frame
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.frame-card.maximized').forEach(card => {
                card.classList.remove('maximized');
                const id = card.getAttribute('data-id');
                document.getElementById(`max-btn-${id}`).innerHTML = '<i data-lucide="maximize-2"></i>';
            });
            lucide.createIcons();
        }
    });

    // Layout buttons event listeners
    layoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const layout = btn.getAttribute('data-layout');
            changeLayout(layout);
            showToast(`Layout alterado para: ${btn.title}`, 'info');
        });
    });

    // Presets selection event listener
    presetSelector.addEventListener('change', () => {
        const selectedPreset = presetSelector.value;
        if (!selectedPreset || !presets[selectedPreset]) return;

        const data = presets[selectedPreset];
        for (let i = 1; i <= framesCount; i++) {
            const p = data[i - 1];
            document.getElementById(`name-${i}`).value = p.name;
            document.getElementById(`url-${i}`).value = p.url;
            localStorage.setItem(`frame-name-${i}`, p.name);
            localStorage.setItem(`frame-url-${i}`, p.url);

            loadIframeUrl(i, p.url);
        }

        showToast(`Preset "${presetSelector.options[presetSelector.selectedIndex].text}" carregado!`, 'success');
        presetSelector.value = ""; // reset dropdown selection
    });

    // Save All button click listener
    btnSaveAll.addEventListener('click', saveAllState);

    // Help Modal events
    btnHelp.addEventListener('click', () => {
        helpModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        helpModal.classList.remove('open');
    });

    modalOkBtn.addEventListener('click', () => {
        helpModal.classList.remove('open');
    });

    // Close modal on click outside content card
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.classList.remove('open');
        }
    });

    // Initial setup loading
    loadSavedState();
});
