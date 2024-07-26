import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info'
import TcpSocket from 'react-native-tcp-socket';

export default () => {

    const [data, setData] = useState({modules: []});

    useEffect(() => {

        let server:TcpSocket.Server

        const startServer = async () => {

            const PORT = Number(process.env.EXPO_PUBLIC_SOCKET_PORT) 
            const ADDRESS = await DeviceInfo.isEmulator() ? 
                process.env.EXPO_PUBLIC_EMULATOR_SOCKET_ADDRESS as string:
                process.env.EXPO_PUBLIC_SOCKET_ADDRESS as string

            server = TcpSocket.createServer((socket) => {

                socket.on('data', (data) => {
                    console.log(`Received message: ${data.toString()}`);
                    const newData = JSON.parse(data.toString()).data;
                    console.info('Message received', newData);
                    setData(newData);
                  });
                
                  socket.on('error', (error) => {
                    console.log(`Socket error: ${error}`);
                  });
                
                  socket.on('close', () => {
                    console.log('Client disconnected');
                  });

            })

            await server.listen({ port: PORT, host: ADDRESS}, () => {
                console.log(`TCP server listening on port ${PORT}`);
            });

            server.on('error', (error) => {
                console.log(`Server error: ${error}`);
            });
        }

        try{
            startServer()
        } catch (e) {
            console.error('Error binding socket: ' + e)
        }

        return () => { server.close(); }
    });

    return data;

};