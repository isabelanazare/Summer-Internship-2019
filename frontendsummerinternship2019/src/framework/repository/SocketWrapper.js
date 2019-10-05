import io from 'socket.io-client';

class SocketWrapper { 
    constructor() {
    }

    static joinSession(userId, sessionName, namespace) {
        if(SocketWrapper._socket != undefined) {
            SocketWrapper._socket.disconnect();
        }
        SocketWrapper._socket = io(`${API_HOSTNAME}/${namespace}`, {
            query: {
                userId,
                roomName: sessionName
            }
        });

        SocketWrapper.registerUnregisteredListeners();
    }

    static registerUnregisteredListeners() {

        for(var eventName in SocketWrapper.listeners) {
            SocketWrapper._socket.on(eventName, SocketWrapper.listeners[eventName]);
        }
    }

    get socket() {
        return SocketWrapper._socket;
    }

    static registerListener(eventName, callback) {

        if(!SocketWrapper._socket && !SocketWrapper.listeners) {
            SocketWrapper.listeners = [];
        }

        if(!SocketWrapper._socket)
            SocketWrapper.listeners[eventName] = callback;
        else{
            SocketWrapper._socket.on(eventName, callback);
            SocketWrapper.listeners[eventName] = callback;
        }
    }

    static emitEvent(eventName, data) {
        SocketWrapper._socket.emit(eventName, data);
    }
}

// SocketWrapper._socket = io('http://localhost:3000/');

// SocketWrapper._socket.on('testing component', (msg) => {
//     console.log(msg);
// });

export default SocketWrapper;