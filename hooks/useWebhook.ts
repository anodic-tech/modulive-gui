import { useEffect, useState } from 'react'

export default () => {

    const [data, setData] = useState({
        modules: [],
        active_module: { X: null, Y: null },
        xfade: 63,
        variation_knob: 0,
        tempo: 0
    } as ModuliveData);

    useEffect(() => {

        let ws: WebSocket

        try {

            ws = new WebSocket(`ws://127.0.0.1:9005`);

            ws.onmessage = e => {
                try {
                    console.log(`Received message: ${e.data.toString()}`);
                    const newData = JSON.parse(e.data.toString()).data;
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
            };

            ws.onopen = e => {
                console.log('Server connected')
            }

            ws.onerror = e => {
                // an error occurred
                console.log(e)
                console.log(`Server error: ${e.type}`);
            };

            ws.onclose = e => {
                // connection closed
                console.log('Client disconnected');
                console.log(e.code, e.reason);
            };

        } catch (e) {
            console.error('Error binding socket: ' + e)
        }

        return () => { ws.close(); }

    }, []);

    return data;

};