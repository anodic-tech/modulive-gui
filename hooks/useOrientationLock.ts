import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import DeviceInfo from 'react-native-device-info'
import TcpSocket from 'react-native-tcp-socket';

export default (orientation:ScreenOrientation.OrientationLock) => {

    useEffect(() => {

        const lockScreen = async () => {
            await ScreenOrientation.lockAsync(orientation);
        }

        try{
            lockScreen()
        } catch (e) {
            console.error('Error setting orientation: ' + e)
        }

    },[orientation]);

};