document.addEventListener('DOMContentLoaded', function() {
    const userAvatar = document.getElementById('userAvatar');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const onlineUsers = document.getElementById('onlineUsers');
    const usersCount = document.getElementById('usersCount');
    const onlineStatus = document.getElementById('onlineStatus');
    const minimizeBtn = document.getElementById('minimizeBtn');
    
    let username = '';
    let socket = null;
    
    // Recupera o nome de usuário do storage
    chrome.storage.local.get('username', function(data) {
        if (data.username) {
            username = data.username;
            userAvatar.textContent = username.charAt(0).toUpperCase();
            
            // Conecta ao servidor WebSocket (substitua pela URL do seu servidor)
            socket = new WebSocket('ws://localhost:3000');
            
            socket.onopen = function() {
                console.log('Conectado ao servidor');
                socket.send(JSON.stringify({ type: 'login', username: username }));
            };
            
            socket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                
                if (data.type === 'user_joined') {
                    usersCount.textContent = data.onlineCount;
                    onlineStatus.textContent = `${data.onlineCount} online`;
                    addMessage('Sistema', `${data.username} entrou no chat.`);
                } else if (data.type === 'new_message') {
                    addMessage(data.username, data.text, data.timestamp);
                } else if (data.type === 'user_left') {
                    usersCount.textContent = data.onlineCount;
                    onlineStatus.textContent = `${data.onlineCount} online`;
                    addMessage('Sistema', `${data.username} saiu do chat.`);
                }
            };
            
            socket.onclose = function() {
                console.log('Conexão fechada');
            };
        } else {
            // Se não tiver usuário, volta para o login
            window.location.href = 'login.html';
        }
    });
    
    function addMessage(sender, text, timestamp = null) {
        const messageDiv = document.createElement('div');
        const isMyMessage = sender === username;
        
        messageDiv.classList.add('message');
        messageDiv.classList.add(isMyMessage ? 'my-message' : 'other-message');
        
        const time = timestamp ? new Date(timestamp) : new Date();
        const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            ${!isMyMessage ? `<div class="message-sender">${sender}</div>` : ''}
            <div class="message-content">${text}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (text && socket) {
            socket.send(JSON.stringify({
                type: 'message',
                username: username,
                text: text
            }));
            
            addMessage(username, text);
            messageInput.value = '';
        }
    }
    
    minimizeBtn.addEventListener('click', function() {
        // Se estiver em um iframe (chat flutuante), envia mensagem para minimizar
        if (window !== window.top) {
            window.parent.postMessage({ type: 'CHAT_MINIMIZE' }, '*');
        } else {
            // Se estiver em uma janela normal, apenas fecha
            window.close();
        }
    });
});