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
            console.log(`Received:${typeof(message)}`, message);
            // Broadcast the message to all connected clients
            // wss.clients.forEach(client => {
            //     if (client !== ws && client.readyState === WebSocket.OPEN) {
            //         // Handle different messages for controlling LEDs
            //         if (message.includes("led")) {
            //             const [command, ledNumber] = message.split(' ');
            //             if (['on', 'off'].includes(command) && [1, 2, 3, 4].includes(parseInt(ledNumber))) {
            //                 client.send(message);
            //             }
            //         }
            //     }
            // });
            if (Buffer.isBuffer(message)) {
                // Convert Buffer to string
                const messageString = message.toString('utf-8');
                console.log('Received:', messageString);
        
                // Broadcast the message to all connected clients
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        console.log("Test Client block");
                        // Handle different messages for controlling LEDs
                        if (messageString.includes("led")) {
                            console.log("Test led block",messageString);
                            const [led,ledNumber, command] = messageString.split(' ');
                            console.log("command-ledNumber",command,ledNumber);
                            if (['on', 'off'].includes(command) && [1, 2, 3, 4].includes(parseInt(ledNumber))) {
                                client.send(messageString);
                            }
                        }
                    }
                });
            } else {
                console.error('Received message is not a Buffer');
            }
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
