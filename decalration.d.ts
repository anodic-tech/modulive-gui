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
        X: ActiveModule | null,
        Y: ActiveModule | null,
    },
    xfade: number
}

type Module = {
    name: string,
    color_index: number
  }
  
  type ActiveModule = {
    name: string,
    color_index: string
    sections: (Section|null)[]
    params: (Param|null)[]
  }
  
  type Section = {
    name: string,
    color_index: string,
    is_playing: boolean,
    is_triggered: boolean
  }

  type Param = {
    name: string,
    color_index: string,
    value: string
  }