const dgram = require('dgram');
const net = require('net');
const { exec } = require('child_process');
const { clearTimeout } = require('timers');

// UDP Configuration
const UDP_IP = '127.0.0.1';
const UDP_PORT = 9004;

// TCP Configuration
const TCP_IP = '127.0.0.1';
const TCP_PORT = 9005;

// Check if adb server is running, and start it if not
const checkAndStartADBServer = (callback) => {
    exec('adb get-state', (err, stdout) => {
        if (err || stdout.trim() !== 'device') {
            console.log('ADB server not running or no devices connected. Starting ADB server...');
            exec('adb start-server', (startErr) => {
                if (startErr) {
                    console.error('Failed to start ADB server:', startErr);
                    process.exit(1);
                }
                console.log('ADB server started.');
                callback();
            });
        } else {
            closeApp();
            callback();
        }
    });
};

// Set up ADB port forwarding
const setUpPortForwarding = (callback) => {
    exec(`adb -d forward tcp:${TCP_PORT} tcp:${TCP_PORT}`, (err) => {
        if (err) {
            console.error('Failed to set up port forwarding:', err);
            process.exit(1);
        }
        console.log(`Port forwarding set up for TCP port ${TCP_PORT}.`);
        callback();
    });
};

// Remove ADB port forwarding
const removePortForwarding = () => {
    exec(`adb -d forward --remove tcp:${TCP_PORT}`, (err) => {
        if (err) {
            console.error('Failed to remove port forwarding:', err);
        }
        console.log(`Port forwarding removed for TCP port ${TCP_PORT}.`);
    });
};


// Close Application
const closeApp = () => {
    exec(`adb shell am force-stop com.justinanodic.modulivegui`, (err) => {
        if (err) {
            console.error('Failed close app', err);
        }
        console.log(`Closed application.`);
    });
}

// Create and manage UDP and TCP sockets
const manageSockets = () => {
    let tcpClient;
    let tcpClientConnected = false;
    let stableConnection = false
    let stableTimeout

    const createTCPClient = () => {
        tcpClient = new net.Socket();
        tcpClient.connect(TCP_PORT, TCP_IP, () => {
            console.log('TCP Trying to connect...');
        });

        tcpClient.on('error', (err) => {
            console.error('TCP Client Error:', err);
            tcpClientConnected = false;
        });

        tcpClient.on('connect', (err) => {
            tcpClientConnected = true;
            stableTimeout = setTimeout(()=>{
                stableConnection = true
                console.log(`Connected to TCP server at ${TCP_IP}:${TCP_PORT}`);
            },2000)
        });

        tcpClient.on('close', () => {
            if(stableConnection) console.log('TCP connection closed.');
            tcpClientConnected = false;
            clearTimeout(stableTimeout)
        });
    };

    // Create a UDP socket
    const udpSocket = dgram.createSocket('udp4');
    udpSocket.bind(UDP_PORT, UDP_IP, () => {
        console.log(`UDP socket bound to ${UDP_IP}:${UDP_PORT}`);
    });

    // Handle UDP messages
    udpSocket.on('message', (msg, rinfo) => {
        console.log(`Received UDP message: ${msg} from ${rinfo.address}:${rinfo.port}`);
        if (tcpClientConnected) {
            tcpClient.write(msg);
        } else {
            console.log('TCP client not connected. Dropping message.');
        }
    });

    // Handle UDP errors
    udpSocket.on('error', (err) => {
        console.error('UDP Socket Error:', err);
    });

    // Periodically check if the TCP connection is still working
    const checkTCPConnection = () => {
        if (!tcpClientConnected) {
            if(stableConnection){
                stableConnection = false
                console.log('TCP Trying to connect...');
            }
            tcpClient.connect(TCP_PORT, TCP_IP);
        }
        setTimeout(checkTCPConnection, 5000);
    };

    createTCPClient();
    setTimeout(checkTCPConnection, 5000);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('Relay stopped.');
        udpSocket.close();
        if (tcpClient && !tcpClient.destroyed) {
            tcpClient.end();
        }
        removePortForwarding();
        closeApp();
        process.exit();
    });
};

// Start the script
checkAndStartADBServer(() => {
    setUpPortForwarding(() => {
        manageSockets();
    });
});
