// server.js

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// WebSocket connection
wss.on('connection', ws => {
    console.log('New client connected');

    ws.on('message', message => {
        console.log('Received:', message);
        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                // client.send(message);
                if(message == "on"){
                    client.send("message on");
                }
                else if(message == "off"){
                    client.send("message off");
                }
                else{
                    client.send(message);
                }
                
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3005;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
