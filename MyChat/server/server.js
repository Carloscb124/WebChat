const WebSocket = require('ws');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let users = new Map(); // Mapeia WebSocket -> nome de usuário
let onlineCount = 0;

wss.on('connection', function connection(ws) {
    console.log('Novo cliente conectado');
    
    ws.on('message', function incoming(message) {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'login') {
                // Login do usuário
                users.set(ws, data.username);
                onlineCount = users.size;
                
                // Notifica todos sobre o novo usuário
                broadcast({
                    type: 'user_joined',
                    username: data.username,
                    onlineCount: onlineCount
                });
            } else if (data.type === 'message') {
                // Mensagem de chat
                const username = users.get(ws);
                if (username) {
                    broadcast({
                        type: 'new_message',
                        username: username,
                        text: data.text,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    });
    
    ws.on('close', function() {
        const username = users.get(ws);
        if (username) {
            users.delete(ws);
            onlineCount = users.size;
            
            // Notifica todos que o usuário saiu
            broadcast({
                type: 'user_left',
                username: username,
                onlineCount: onlineCount
            });
        }
        console.log('Cliente desconectado');
    });
});

function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(3000, function() {
    console.log('Servidor rodando na porta 3000');
});