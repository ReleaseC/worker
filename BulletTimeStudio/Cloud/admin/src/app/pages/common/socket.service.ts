import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Socket} from 'ng-socket-io';
import {SOCKET_EVENTS, SOCCER_EVENT, BASKETBALL_EVENT} from './socket.interface';
import {environment} from '../../../environments/environment';

@Injectable()
export class SocketService {
  serverIp: string;

  constructor(private socket: Socket) {
  }



  /*
  initEvents() {
      // this.socket.on(BASKETBALL_EVENT.REBOOT_DEVICE_SUCCESS_CLOUD, data => {
      //     console.log("reboot_device_success  >>>>>>>>>>>>>>>> ");
      //     console.log(data)
      // });

      // this.socket.on(BASKETBALL_EVENT.REBOOT_DEVICE_FAIL_CLOUD, data => {
      //     console.log("reboot_device_error >>>>>>>>>>>>>>>");
      //     console.log(data)
      // });

    // this.socket.on('test_chinese', data => {
    //   console.log("test_chinese:", data);
    //   console.log(data)
    // });



    this.socket.on(SOCKET_EVENTS.EVENT_CMD, data => {
      console.log("cmd:", data);

      localStorage['mome_res'] = JSON.stringify(data) || '无响应'
      if (data && data.action == 'post_preview' && data.status == 0 && data.preview) {
        localStorage['mome_res'] = data.preview
      }


      // if (data) {
      //   alert(data)
      // }

    });



  }
  */

  cmdRegister(body) {
    console.log('cmdRegister:', body);
    // 因为在页面中为了每次点击拍摄或者设定能取到cmd回复, 会需要在多个地方注册, 为避免多次回复, 在每次注册前先取消注册
    // this.socket.emit('cmd_unregister', body);
    this.socket.emit('cmd_register', body);
  }

  getStatus(body, cb) {
    this.socket.emit(SOCKET_EVENTS.EVENT_CAMERA_STATUS, body, (data) => {
      cb(data);
    });
  }

  testSoccorSiteMatch(body, cb) {
    console.log('testSoccor');
    this.socket.emit('sites_match', body, (data) => {
      cb(data);
    });
  }

  sendGoal(body, cb) {
    console.log('testSoccor');
    this.socket.emit('goal', body, (data) => {
      cb(data);
    });
  }

  testRemoteShot(body, cb) {
    console.log('testRemoteShot');
    this.socket.emit('remote_shot', body, (data) => {
      cb(data);
    });
  }

  getDeviceInfo() {
    return this.socket
      .fromEvent(SOCCER_EVENT.EVENT_HEARTBEAT).pipe(
        map(data => data));
  }

  getBtDeviceInfo() {
    return this.socket
      .fromEvent(SOCKET_EVENTS.EVENT_CAMERA_STATUS_FROM_EDGE).pipe(
        map(data => data));
  }

  deviceDisconnect() {
    return this.socket
      .fromEvent(SOCCER_EVENT.EVENT_DEVICEOFFLINE).pipe(
        map(data => data));
  }

  rebootDevice(body) {
    this.socket.emit(BASKETBALL_EVENT.REBOOT_DEVICE_CLOUD, body, (data) => {
      console.log(">>>>>>>>>>>>>> REBOOT_DEVICE_CLOUD callback");
      console.log('data:', data);
    });
  }

  updateScale(body) {
    console.log('updateScale');
    this.socket.emit('update_scale_from_cloud_admin', body, (data) => {
      console.log(data)
    });
  }

  getview(body) {
    console.log('getview_socket');
    this.socket.emit('remote_shot', body, (data) => {
      console.log(data)
    });
  }

  // getview2(){
  //     return this.socket
  //         .fromEvent("remote_shot_get_pics")
  //         .map(data => data);
  // }

  receiveView() {
    return this.socket
      .fromEvent("remote_shot_get_pics").pipe(
        map(data => data));
  }


  /* 发送通用cmd */
  DeviceCMDEVENT(body, cb) {
    this.socket.emit(SOCKET_EVENTS.EVENT_CMD, body, (data) => {
      cb(data);
    });
  }

  /* 接收cmd */
  receiveCmd(cb) {
    console.log('等待接收cmd')
    this.socket.on(SOCKET_EVENTS.EVENT_CMD, data => {
       cb(data)
    })
  }





}
