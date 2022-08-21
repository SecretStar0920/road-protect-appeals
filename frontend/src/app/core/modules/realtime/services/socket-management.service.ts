import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    socketId: string;

    constructor(private socket: Socket) {
        this.connect();
    }

    connect() {
        this.onConnection();
        this.socket.connect();
    }

    disconnect() {
        this.socket.disconnect(true);
    }

    onConnection() {
        this.socket.fromEvent('connect').subscribe(result => {
            console.debug('Socket connected: ', this.socket.ioSocket.id);
            sessionStorage.setItem('io', this.socket.ioSocket.id);
            this.socketId = this.socket.ioSocket.id;
        });
    }
}
