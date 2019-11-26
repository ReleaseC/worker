import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';

import {environment} from '../../../../environments/environment';

import * as grpcWeb from 'grpc-web';
import * as DeviceServiceClient from '../grpc/device_grpc_web_pb';
import * as DeviceRequest from '../grpc/device_pb';
import { Router } from '@angular/router';



@Component({
  selector: 'ngx-device-setting',
  templateUrl: './device-setting.component.html',
  styleUrls: ['./device-setting.component.scss'],
})
export class DeviceSettingComponent implements OnInit {

  /*用户过滤*/
  userList = [];
  selPhone: string;
  selUserId: string;

  /*活动过滤*/
  activityList = [];
  selActivity: string;
  selActivityId: string;

  /*设备状态*/
  DeviceStatusList = [];

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {
  }


  ngOnInit() {
    this.getUserList()
    this.getDevice_status()


    // var statusClient = new DeviceServiceClient.statusPromiseClient('http://101.37.151.52:10000', null, null);
    var statusClient = new DeviceServiceClient.statusClient('https://iva.siiva.com/device-status', null, null);
    // var metadata = {'activity_ids': '1541732870qz', 'device_ids': '8840B811'};
    var metadata = {'activity_ids': ['1541732870qz', '1541382418']};
    var myrequest = new DeviceRequest.GetDeviceStatusRequest();
    var call = statusClient.getDeviceStatus(myrequest, metadata, function (err, response) {
      console.log('response:', response);
      if (err) {
        console.log('err:', err);
        console.log('code:', err.code);
        console.log('msg:', err.message);
      } else {
        console.log('response:', response);
      }
    });
    // call.on('status', function (status) {
    //   console.log('status:', status);
    //   console.log('status.code:', status.code);
    //   console.log('status.details:', status.details);
    //   console.log('status.metadata:', status.metadata);
    // });


  }

  /*获取用户列表*/
  async getUserList() {
    this.http.get(environment.apiServerData + '/user/list').subscribe((data: any) => {
      this.userList = data;
      this.userList.unshift({'phone': '全部', 'user_id': ''});
      this.getActivityList()
    })
  }

  /*用户选择 */
  onUserSelected() {
    for (let i = 0; i < this.userList.length; i++) {
      if (this.userList[i].phone === this.selPhone)
        this.selUserId = this.userList[i].user_id
    }
    localStorage['selUserId'] = this.selUserId;
    localStorage['selPhone'] = this.selPhone;
    this.getActivityList();
    this.selActivityId = this.activityList[0].activity_id;
    this.selActivity = this.activityList[0].activity_name;
  }

  /* 获取活动列表*/
  async getActivityList() {
    this.http.get(environment.apiServerData + '/activity/list?user_id=' + this.selUserId).subscribe((data: any) => {
      this.activityList = data;
      console.log(this.activityList)
      this.activityList.unshift({'activity_name': '全部', 'activity_id': ''});
      this.getDevice_status()
    })
  }

  /*活动选择*/
  onActivitySelected() {
    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_name === this.selActivity)
        this.selActivityId = this.activityList[i].activity_id
    }
    localStorage['selActivityId'] = this.selActivityId;
    localStorage['selActivity'] = this.selActivity;
    this.getDevice_status();
  }

  getDevice_status() {
    this.http.get(environment.apiServerData + '/device/list?activity_ids=1541382418,1541732870qz').subscribe((data: any) => {
      // console.log(data)
      this.DeviceStatusList = data;
      console.log(this.DeviceStatusList)
    })
  }

  // goSetting (device_id) {
  //   this.router.navigate(['device-setting'],{queryParams:{device_id:device_id}});
  // }

  reboot(device_id) {

    console.log('device_id:', device_id)

    this.http.get(environment.apiServer + '/device/cmd?cmd=重启&device_id='+device_id).subscribe((data: any) => {
      console.log('data:', data)
    })

  }

  /*时间戳转化日期格式*/
  add0(m) {
    return m < 10 ? '0' + m : m
  }

  format(shijianchuo) {
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  }


}


