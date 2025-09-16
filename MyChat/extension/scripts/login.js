document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('usernameInput');
    const loginBtn = document.getElementById('loginBtn');
    
    loginBtn.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        if (username) {
            // Salva o nome de usuário no storage
            chrome.storage.local.set({ username }, function() {
                // Redireciona para a página do chat
                window.location.href = 'chat.html';
            });
        } else {
            alert('Por favor, digite um nome de usuário.');
        }
    });
    
    // Enter para enviar
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});