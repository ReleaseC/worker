import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from "@angular/platform-browser";
import {SocketService} from "../common/socket.service";

@Component({
  selector: 'ngx-fileServer',
  templateUrl: './fileServer.component.html',
  styleUrls: ['./fileServer.component.scss'],
})
export class FileServerComponent implements OnInit {
  serverList = [];

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) {
  }



  ngOnInit() {

    this.getServerList()
    setInterval(() => {
      this.getServerList()
    }, 60000);

  }

  /*获取用户列表*/
  async getServerList() {
    this.http.get(environment.apiServer + '/activity/file_server_status').subscribe((data: any) => {
      this.serverList = data;
      console.log('data:', JSON.stringify(data))
    })
  }


  async delServer(server) {

    if (confirm("确定忽略?")) {
      let res = await this.http.get(`${environment.apiServer}/activity/del_server_status?deviceId=${server.device_id}`).toPromise()
      if (res['code'] === 0) {
        const delIndex = this.serverList.indexOf(server);
        if (delIndex >= 0) {
          this.serverList.splice(delIndex, 1)
        }
      }
    }

  }

  async updataDeviceVersion(device_id) {

    console.log('升级:', device_id)
    if (confirm("确定升级" + device_id + "?")) {
      let body = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": "",
        "param": {
          "action": "upgrade"
        }
      }
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })
    }
  }

  reboot(device_id) {

    if (confirm("确定重启" + device_id + "?")) {
      console.log('重启device_id:', device_id)
      // 单个重启
      let singleBody = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": "",
        "param": {
          "action": "restart"
        }
      }
      this.socketService.DeviceCMDEVENT(singleBody, (res) => {
        console.log('cmd:' + res);
      })
    }

  }

  checkOnline(updateTime) {

    let update = new Date(updateTime)
    let interval = Date.now() - update.getTime()
    return interval / 1000 < 300 ? '在线' : '离线'

  }


}


