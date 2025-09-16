document.getElementById('openChat').addEventListener('click', function() {
    chrome.tabs.create({ url: chrome.runtime.getURL('login.html') });
});
document.getElementById('openFloatingChat').addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
            // Envia uma mensagem para o content script na aba ativa
            chrome.tabs.sendMessage(tabs[0].id, { action: "injectFloatingChat" });
        }
    });
});