import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {SOCKET_EVENTS } from './socket.interface';


@Injectable()
export class SocketService {


  constructor(private socket: Socket) {
  }



  cmdRegister(body) {

    // 因为在页面中为了每次点击拍摄或者设定能取到cmd回复, 会需要在多个地方注册, 为避免多次回复, 在每次注册前先取消注册
    // this.socket.emit('cmd_unregister', body);
    this.socket.emit('cmd_register', body);
  }

  /* 发送通用cmd */
  DeviceCMDEVENT(body, cb) {
    this.socket.emit(SOCKET_EVENTS.EVENT_CMD, body, (data) => {
      cb(data);
    });
  }

  /* 接收cmd */
  receiveCmd(cb) {

    this.socket.removeAllListeners(SOCKET_EVENTS.EVENT_CMD)
    this.socket.on(SOCKET_EVENTS.EVENT_CMD, data => {
       cb(data)
    })
  }





}
