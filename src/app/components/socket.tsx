import {Socket, io} from 'socket.io-client';

class SocketClient {
    private socket?: Socket;
  
    connect = () => {
      // Might need to chaneg in the future
      const url = 'http://127.0.0.1:5000';
      this.socket = io(url);
    };
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(eventName: string, listener: (...args: any[]) => void) {
      if (this.socket) {
        this.socket.on(eventName, listener);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(eventName: string, listener: (args: any) => void) {
      if (this.socket) {
        this.socket.emit(eventName, listener);
      }
    }
    close = () => {
      if (this.socket) {
        this.socket.close();
        this.socket = undefined;
      }
    };
  }
  
  export default new SocketClient();