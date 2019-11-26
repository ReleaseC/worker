import { Injectable } from '@angular/core';
import { SOCKET_EVENTS } from './socket.interface';
import { Socket } from 'ngx-socket-io';
// import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';

@Injectable()
export class SocketService {
    serverIp: string;

    constructor(private socket: Socket) {
    }

    listenVideoProcess() {
        return this.socket
          .fromEvent(SOCKET_EVENTS.EVENT_VIDEO_PROCESS)
          .map(data => data);
    }

    listenVideoAvailbale() {
        return this.socket
          .fromEvent(SOCKET_EVENTS.EVENT_VIDEO_AVAILABLE)
          .map(data => data);
    }

    sendVideoAvailbale(data) {
        console.log('Emit SOCKET_EVENTS.EVENT_VIDEO_AVAILABLE');
        this.socket.emit(SOCKET_EVENTS.EVENT_VIDEO_AVAILABLE, data);
    }

}
