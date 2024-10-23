const dgram = require('dgram');
const WebSocket = require('ws');
const { clearTimeout } = require('timers');

// UDP Configuration
const UDP_IP = '127.0.0.1';
const UDP_PORT = 9004;

// WebSocket Configuration
const WS_PORT = 9005;

// Create and manage UDP and WebSocket servers
const manageSockets = () => {
    let wsServer;
    let wsClients = new Set();
    let stableConnection = false;
    let stableTimeout;

    // Create a WebSocket server
    wsServer = new WebSocket.Server({ port: WS_PORT });
    console.log(`WebSocket server is running on ws://localhost:${WS_PORT}`);

    wsServer.on('connection', (ws) => {
        console.log('New WebSocket client connected');
        wsClients.add(ws);

        ws.on('close', () => {
            console.log('WebSocket client disconnected');
            wsClients.delete(ws);
        });

        ws.on('error', (err) => {
            console.error('WebSocket Client Error:', err);
        });
    });

    // Create a UDP socket
    const udpSocket = dgram.createSocket('udp4');
    udpSocket.bind(UDP_PORT, UDP_IP, () => {
        console.log(`UDP socket bound to ${UDP_IP}:${UDP_PORT}`);
    });

    // Handle UDP messages
    udpSocket.on('message', (msg, rinfo) => {
        console.log(`Received UDP message: ${msg} from ${rinfo.address}:${rinfo.port}`);
        if (wsClients.size > 0) {
            wsClients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(msg.toString(), (error) => {
                        if (error) {
                            console.error('WebSocket send error:', error);
                        }
                    });
                }
            });
        } else {
            console.log('No WebSocket clients connected. Dropping message.');
        }
    });

    // Handle UDP errors
    udpSocket.on('error', (err) => {
        console.error('UDP Socket Error:', err);
    });

    // Periodically check for WebSocket connections
    const checkWebSocketConnection = () => {
        if (wsClients.size === 0 && !stableConnection) {
            stableConnection = true;
            console.log('No WebSocket clients connected. Waiting for clients...');
        } else if (wsClients.size > 0 && stableConnection) {
            stableConnection = false;
            console.log('WebSocket clients connected.');
        }
        setTimeout(checkWebSocketConnection, 5000);
    };

    setTimeout(checkWebSocketConnection, 5000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('Relay stopped.');
        udpSocket.close();
        wsServer.close(() => {
            console.log('WebSocket server closed.');
            process.exit();
        });
    });
};

// Start the script
manageSockets();
