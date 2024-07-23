import dgram from 'react-native-udp';
import { useEffect, useState } from 'react';

const PORT = Number(process.env.EXPO_PUBLIC_SOCKET_PORT)
const ADDRESS = process.env.EXPO_PUBLIC_SOCKET_ADDRESS

export default () => {

    const [data, setData] = useState({modules: []});
  
    useEffect(() => {
        const socket = dgram.createSocket({type:'udp4', debug: true});
        socket.bind({port: PORT, address: ADDRESS});
        socket.on('message', function(msg, _) {
            const newData = JSON.parse(msg.toString()).data;
            console.info('Message received', newData);
            setData(newData);
          })
        return () => { socket.close(); }
    },[PORT,ADDRESS]);
    return data;
};