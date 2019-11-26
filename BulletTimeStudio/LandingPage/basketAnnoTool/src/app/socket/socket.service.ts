import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SOCKET_EVENTS } from './socket.interface';
// import 'rxjs/add/operator/map';
import { LoggerService } from '../loggerservice/logger.service';

@Injectable()
export class SocketService {
    serverIp: string;

    constructor(
      private socket: Socket,
      private logger: LoggerService
      ) {
    }

    // ---------------------------------------- listen

    listenFrameAvailbale() {
      return this.socket
        .fromEvent(SOCKET_EVENTS.EVENT_FRAME_AVAILABLE)
        .map(data => data);
    }

    listenGoalComplete() {
      return this.socket
        .fromEvent(SOCKET_EVENTS.EVENT_GOAL_COMPLETE)
        .map(data => data);
    }

    listenDetectReplyComplete() {
      return this.socket
        .fromEvent(SOCKET_EVENTS.EVENT_DETECT_REPLY)
        .map(data => data);
    }

    listenDetectDetailComplete() {
      return this.socket
        .fromEvent(SOCKET_EVENTS.EVENT_DETECT_DETAIL)
        .map(data => data);
    }

    reConnect() {
      this.socket.disconnect();
      this.socket.connect();
      return;
    }

    // ---------------------------------------- emit

    requestFrameBySiteId(data) {
      this.logger.info('Emit SOCKET_EVENTS.EVENT_REQUEST_FRAME');
      this.socket.emit(SOCKET_EVENTS.EVENT_REQUEST_FRAME, data);
    }

    sendGoalEvent(data) {
      this.logger.info('Emit SOCKET_EVENTS.EVENT_GOAL');
      // this.socket.emit(SOCKET_EVENTS.EVENT_GOAL, data);
    }

    // startRecording(data) {
    //     this.logger.info(`Emit SOCKET_EVENTS.START_RECORDING`);
    //     this.socket.emit(SOCKET_EVENTS.EVENT_START_RECORDING, data);
    // }
}
