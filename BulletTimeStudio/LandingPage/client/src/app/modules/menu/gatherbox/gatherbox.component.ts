import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import {environment} from '../../../../environments/environment';
import { SocketService } from '../../../shared/socket.service';

import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-gatherbox',
  templateUrl: './gatherbox.component.html',
  styleUrls: ['./gatherbox.component.css']
})
export class GatherboxComponent implements OnInit {
  
  /* 公司过滤 */
  companyList: any;
  selCompany = '全部';
  selCompanyId = '';
  /* 设备列表的活动过滤 */
  activityList: any;
  // selActivity = '全部';
  selActivityId = '';
  
  /*设备状态*/
  DeviceStatusList: any;
  list:Array<object> = [
    {
      name: 'test',
      deviceId: 'dsadasdsad',
      state: 'dsad',
    },
    {
      name: 'test',
      deviceId: 'dsadasdsad',
      state: 'dsad',
    }

  ];
  constructor(private router: Router,
    private http: HttpClient,
    private socketService: SocketService
    ) { }

  ngOnInit() {
    
    /* 给一个浏览器一个固定的值作为device_id */
    var user_id = localStorage['user_id']
    localStorage['browser_device_id'] = localStorage.getItem('browser_device_id') || Date.now()
    this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'], 'user_id': user_id, 'type': 'browser', 'project_id': localStorage['project_id'] })

    this.socketService.receiveCmd((res) => {
      if (res.param && res.param.action == 'heartbeat') {
        // 收到mome_u的状态更新
        let listHasThis = false
        for (let i = 0; i < this.DeviceStatusList.length; i++) {
          if (this.DeviceStatusList[i].device_id == res.deviceId) {
            listHasThis = true
            let temp = this.DeviceStatusList[i]
            temp['app_name'] = res.param.app_name
            temp['app_version'] = res.param.app_version
            temp['device_name'] = res.param.device_name
            temp['free_disk'] = res.param.free_disk
            temp['is_charging'] = res.param.is_charging
            temp['power'] = res.param.power
            temp['temperature'] = res.param.temperature
            // temp['timestamp'] = new Date(res.param.timestamp).getTime()
            temp['timestamp'] = res.param.timestamp
            temp['ttl'] = res.param.ttl
            // temp['device_id'] = res.param.device_id
            this.DeviceStatusList.splice(i, 1, temp);
          }
        }
      }


    })
    this.getDeviceStatus()


    // this.getDeviceStatus()
  }
  
  touchToOption(deviceId){
    console.log(deviceId);
    localStorage['deviceId'] = deviceId;
    this.router.navigateByUrl('menu/devicemanager');
    
  }
  async getDeviceStatus() {
    // this.http.get(environment.apiServer + '/device/list?activity_ids=1541382418,1541732870qz').subscribe((data: any) => {
    // let res = await this.http.get(environment.apiServer + '/device/list?company_id=' + this.selCompanyId + '&activity_id=' + this.selActivityId).toPromise()
    let res = await this.http.get(environment.cloudServer1 + 'activity/mome_ubuntu_status?'+ 'project_id=' + localStorage.getItem('project_id')).toPromise()
    // let res = await this.http.get(environment.cloudServer1 + 'activity/mome_ubuntu_status').toPromise()
    this.DeviceStatusList = res;
    console.log('activitylist:', JSON.parse(localStorage.getItem('activitylist')))
    console.log('DeviceStatusList:', this.DeviceStatusList)

  }
  
  getUpdateDescrip(timestamp) {

    let originalTime = new Date(timestamp)
    var now = (new Date()).getTime();
    if (now - originalTime.getTime() < 65000) {
      return '在线'
    }
    return '离线'
  }
  reboot(device_id) {

    let requestId = localStorage['browser_device_id'] + '_' + Date.now()
    if (confirm("确定重启" + device_id + "?")) {
      console.log('重启device_id:', device_id)
      // let body = { "deviceId": device_id }
      // this.socketService.rebootDevice(body) // 过去borcast重启方式

      // 单个重启
      let singleBody = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": requestId,
        "param": {
          "action": "restart"
        }
      }
      this.socketService.DeviceCMDEVENT(singleBody, (res) => {
        console.log('cmd:' + res);
      })
    }

  }
  
  rebootvnc(device_id) {

    let requestId = localStorage['browser_device_id'] + '_' + Date.now()
    if (confirm("刷新" + device_id + "的vnc?")) {
      console.log('重启vnc, device_id:', device_id)
      // let body = { "deviceId": device_id }
      // this.socketService.rebootDevice(body) // 过去borcast重启方式

      // 单个重启
      let singleBody = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": requestId,
        "param": {
          "action": "restart_frpc"
        }
      }
      this.socketService.DeviceCMDEVENT(singleBody, (res) => {
        console.log('cmd:' + res);
      })
    }

  }
}
