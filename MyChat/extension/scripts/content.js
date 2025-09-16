// scripts/content.js

// Função para injetar o chat flutuante
function injectFloatingChat() {
    // Verifica se o chat flutuante já existe
    if (document.getElementById('floating-chat-container')) {
        // Se já existe, apenas mostra/esconde se estiver minimizado
        const iframe = document.getElementById('floating-chat-iframe');
        const toggleBtn = document.getElementById('floating-chat-toggle');
        if (iframe && iframe.style.display === 'none') {
            iframe.style.display = 'block';
            toggleBtn.textContent = '➖';
        }
        return;
    }

    // Cria um iframe para o chat flutuante
    const iframe = document.createElement('iframe');
    iframe.id = 'floating-chat-iframe';
    iframe.src = chrome.runtime.getURL('chat.html');
    iframe.style.cssText = `
        width: 350px;
        height: 500px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    // Cria o container do chat flutuante
    const container = document.createElement('div');
    container.id = 'floating-chat-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    `;

    // Botão de minimizar/restaurar
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'floating-chat-toggle';
    toggleBtn.textContent = '💬';
    toggleBtn.style.cssText = `
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #0084ff;
        color: white;
        border: none;
        margin-bottom: 10px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        font-size: 20px;
    `;

    // Adiciona os elementos ao DOM
    container.appendChild(toggleBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);

    // Estado inicial (minimizado)
    // O chat deve aparecer aberto quando injetado pela primeira vez
    iframe.style.display = 'block'; // Alterado para 'block'
    toggleBtn.textContent = '➖'; // Alterado para '➖'

    // Event listener para o botão de toggle
    toggleBtn.addEventListener('click', function() {
        if (iframe.style.display === 'none') {
            iframe.style.display = 'block';
            toggleBtn.textContent = '➖';
        } else {
            iframe.style.display = 'none';
            toggleBtn.textContent = '💬';
        }
    });

    // Função para receber mensagens do iframe (para minimizar)
    window.addEventListener('message', function(event) {
        if (event.data.type === 'CHAT_MINIMIZE') {
            iframe.style.display = 'none';
            toggleBtn.textContent = '💬';
        }
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "injectFloatingChat") {
        injectFloatingChat();
    }
});
