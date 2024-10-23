import { useEffect, useState } from 'react'
import DeviceInfo from 'react-native-device-info'
import TcpSocket from 'react-native-tcp-socket'

export default () => {

    const [data, setData] = useState({
        modules: [],
        active_module: { X: null, Y: null },
        xfade: 63,
        variation_knob: 0,
        tempo: 0
    } as ModuliveData);

    useEffect(() => {

        let server: TcpSocket.Server

        const startServer = async () => {

            console.log('create server')
            console.log(TcpSocket)

            const PORT = Number(process.env.EXPO_PUBLIC_SOCKET_PORT)
            const ADDRESS = await DeviceInfo.isEmulator() ?
                process.env.EXPO_PUBLIC_EMULATOR_SOCKET_ADDRESS as string :
                process.env.EXPO_PUBLIC_SOCKET_ADDRESS as string

            server = TcpSocket.createServer((socket) => {

                socket.on('data', (rawData) => {
                    try {
                        console.log(`Received message: ${rawData.toString()}`);
                        const newData = JSON.parse(rawData.toString()).data;
                        // console.info('Message received', JSON.stringify(newData));
                        setData((prevData) => {
                            if (JSON.stringify(newData) === JSON.stringify(prevData)) {
                                return prevData; // No state change
                            } else {
                                return newData; // Update state
                            }
                        });
                    } catch (e) {
                        console.log(e)
                    }
                });

                socket.on('error', (error) => {
                    console.log(`Socket error: ${error}`);
                });

                socket.on('close', () => {
                    console.log('Client disconnected');
                });

            })

            console.log(server.listen)

            await server.listen({ port: PORT, host: ADDRESS }, () => {
                console.log(`TCP server listening on port ${PORT}`);
            });

            server.on('error', (error) => {
                console.log(`Server error: ${error}`);
            });
        }

        try {
            startServer()
        } catch (e) {
            console.error('Error binding socket: ' + e)
        }

        return () => { server.close(); }
    }, []);

    return data;

};