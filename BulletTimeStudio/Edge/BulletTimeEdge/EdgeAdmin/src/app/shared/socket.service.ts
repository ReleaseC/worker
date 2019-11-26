import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { SOCKET_EVENTS } from './socket.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class SocketService {

    socket: any;
    serverIp: string;

    constructor() {
    }

    getStatus(cb) {
        this.socket.emit(SOCKET_EVENTS.EVENT_CAMERA_STATUS, (data) => {
            cb(data);
        });
    }

    connect(cb) {
        // this.socket = io.connect(`http://${environment.edgeServer}:3001`);
        this.socket = io.connect(`${environment.apiServer}`);
        this.socket.on(SOCKET_EVENTS.EVENT_CONNECT, () => {
            cb(`connect to ${environment.apiServer} success`);
        });
    }

    getTasksStatus(send_data, cb) {
        this.socket.emit(SOCKET_EVENTS.EVENT_TASKS_STATUS, send_data, (data) => {
            cb(data);
        });
    }
}
