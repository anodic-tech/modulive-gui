declare module 'net' {
    import TcpSockets from 'react-native-tcp-socket';
    export = TcpSockets;
}

declare module 'tls' {
    import TcpSockets from 'react-native-tcp-socket';
    export const Server = TcpSockets.TLSServer;
    export const TLSSocket = TcpSockets.TLSSocket;
    export const connect = TcpSockets.connectTLS;
    export const createServer = TcpSockets.createTLSServer;
}

type ModuliveData = {
    modules: Module[],
    active_module: {
        A: ActiveModule | 'None',
        B: ActiveModule | 'None',
    }
}

type Module = {
    name: string,
    color_index: number
  }
  
  type ActiveModule = {
    name: string,
    color_index: number
    sections: (Section|'None')[]
  }
  
  type Section = {
    name: string,
    color_index: number,
    is_playing: boolean,
    is_triggered: boolean
  }