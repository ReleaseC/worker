
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { SocketService } from '../../../pages/common/socket.service';

@Component({
  selector: 'ngx-site-basketball',
  templateUrl: './site-basketball.component.html',
  styleUrls: ['./site-basketball.component.scss'],
})
export class SiteBasketballComponent implements OnInit {
  originSiteListArr = [];
  siteListArr = [];
  // ToDo: siteNameArr = [];
  options = '';
  // devWitIndexMap = new Map<string, number>();
  devWithApkMap = new Map<string, string>();
  // ToDo: radioValue = '測試';
  checkbox_test = true;
  checkbox_sh = true;
  checkbox_bj = true;
  checkbox_gz = true;
  // ToDo: radioMap = new Map<string, boolean>();
  bindingTable = [];

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.getSiteApkVersion();
    this.socketService
      .getDeviceInfo()
      .subscribe(data => {
        for (let i = 0; i < this.siteListArr.length; i++) {
          const taskId = data['status'].goal || '';
          let delay = data['status'].timestamp
          if (data['status'].timestamp !== undefined) {
            // console.log(new Date().getTime() + ' ' + +data['status'].timestamp)
            delay = (new Date().getTime() - +data['status'].timestamp) / 1000
          }
          if ((this.siteListArr[i].siteId === data['siteId']) &&
            (this.siteListArr[i].deviceId === data['deviceId']) &&
            (this.siteListArr[i].role === this.transVideoName(data['role']))) {
            this.siteListArr[i].power = data['status'].power + '%';
            this.siteListArr[i].powerColor = (parseInt(data['status'].power, 10) < 60) ? 'red' : '#000000';
            this.siteListArr[i].temperature = data['status'].temperature + '°C';
            this.siteListArr[i].tempColor = (parseInt(data['status'].temperature, 10) > 50) ? 'red' : '#000000';
            this.siteListArr[i].charging = data['status'].charging;
            this.siteListArr[i].msg = data['status'].msg;
            this.siteListArr[i].version = data['status'].version;
            this.siteListArr[i].goal = taskId.substr(taskId.length - 6, 6);
            this.siteListArr[i].delay = `${delay}s`;
            this.siteListArr[i].chargingColor = (this.siteListArr[i].charging === true) ? 'green' : '#000000';
            this.siteListArr[i].status = 'online';
            this.siteListArr[i].statusColor = (this.siteListArr[i].status === 'online') ? 'blue' : 'gray';
            const date = new Date();
            this.siteListArr[i].lastUpdate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            this.siteListArr[i].lastUpdateInTime = date.getTime() / 1000;
            break;
          }
        }
      });


    setInterval(() => {
      this.checkDeviceStatus();
    }, 60000);
  }

  checkDeviceStatus() {
    const currentTime: any = new Date().getTime() / 1000;
    let targetTime;
    for (let i = 0; i < this.siteListArr.length; i++) {
      if (this.siteListArr[i].lastUpdate) {
        targetTime = this.siteListArr[i].lastUpdateInTime;
        // If over 3 min. not update, show offline
        if ((currentTime - targetTime) >= 180) {
          this.siteListArr[i].status = 'offline';
          this.siteListArr[i].statusColor = 'red';
        }
      }
    }
  }

  transVideoName(videoName) {
    let retName = videoName;
    switch (videoName) {
      case 'VideoCam_0':
        retName = '半場';
        break;
      case 'VideoCam_1':
        retName = '龍門';
        break;
      case 'VideoCam_2':
        retName = '角落';
        break;
    }
    return retName;
  }

  async getSiteLists() {
    this.siteListArr = [];
    this.originSiteListArr = [];

    const body = {
      type: 'soccer',
    };
    let color = '#FFFFFF';
    let currentSiteListArrIndex = 0;
    this.http
      .post(environment.apiServer + 'site/get_site_detail', body)
      .subscribe((data) => {
        console.log(data)
        const dataLen = Object.keys(data['result']).length;
        let object = {};
        for (let i = 0; i < dataLen; i++) {
          const deviceLen = Object.keys(data['result'][i]['deviceConfig']).length;
          deviceLen > 0 ? color === '#FFFFFF' ? color = 'LightGray' : color = '#FFFFFF' : '';
          // ToDo: this.siteNameArr.push({'region': data['result'][i]['region'], 'siteName': data['result'][i]['siteName']});
          // ToDo: this.radioMap.set(data['result'][i]['siteName'], false);
          for (let j = 0; j < deviceLen; j++) {
            // console.log('apk=' + this.devWithApkMap.get(data['result'][i].siteId + '_' + data['result'][i]['deviceConfig'][j].deviceId));

            let isBinding = false;
            let bindName = '綁定';
            const bindingTableLen = this.bindingTable.length;
            for (let k = 0; k < bindingTableLen; k++) {
              if (this.bindingTable[k].deviceId === data['result'][i]['deviceConfig'][j].deviceId) {
                if (this.bindingTable[k].role === data['result'][i]['deviceConfig'][j].role) {
                  isBinding = true;
                  bindName = '取消綁定';
                } else {
                  bindName = '無法綁定';
                }
              }
            }

            object = {
              'region': data['result'][i].region,
              'siteId': data['result'][i].siteId,
              'deviceId': data['result'][i]['deviceConfig'][j].deviceId,
              'siteName': data['result'][i].siteName,
              'role': this.transVideoName(data['result'][i]['deviceConfig'][j].role),
              'apkVersion': this.devWithApkMap.get(data['result'][i].siteId + '_' + data['result'][i]['deviceConfig'][j].deviceId),
              'power': '',
              'powerColor': '#000000',
              'temperature': '',
              'tempColor': '#000000',
              'charging': '',
              'chargingColor': '#000000',
              'goal': '',
              'status': 'offline',
              'statusColor': 'gray',
              'color': color,
              'isbind': isBinding,
              'bindName': bindName,
              'lastUpdate': '',
              'lastUpdateColor': 'tomato',
              'lastUpdateInTime': '',
            };
            this.siteListArr.push(object);
            this.originSiteListArr.push(object);

            const bodyToRedis = {
              'siteId': data['result'][i].siteId,
              'deviceId': data['result'][i]['deviceConfig'][j].deviceId,
              'role': data['result'][i]['deviceConfig'][j].role,
            };
            this.getHeartBeatByRedis(bodyToRedis, currentSiteListArrIndex);
            // Save siteListArr index to find index of siteListArr directly.
            // this.devWitIndexMap.set(data['result'][i].siteId, this.siteListArr.length - 1)
            currentSiteListArrIndex++;
          }
        }
      });
  }

  getHeartBeatByRedis(body, i) {
    this.http
      .post(environment.apiServer + 'site/get_heartbeat_redis', body)
      .subscribe((ret) => {
        if (ret['result'] !== undefined) {
          this.siteListArr[i].temperature = ret['result'].temperature;
          this.siteListArr[i].power = ret['result'].power;
          this.siteListArr[i].charging = ret['result'].charging;
          this.siteListArr[i].version = ret['result'].version;
          this.siteListArr[i].goal = ret['result'].goal;
          this.siteListArr[i].msg = ret['result'].msg;
          this.siteListArr[i].timestamp = ret['result'].timestamp;
          this.siteListArr[i].lastUpdate = ret['result'].lastUpdate;
        }
      });
  }

  getSiteApkVersion() {
    this.devWithApkMap.clear();

    this.http
      .get(environment.apiServer + 'system/get_apk_version_from_db')
      .subscribe((data) => {
        // console.log(JSON.stringify('getSiteApkVersion=' + JSON.stringify(data)));
        const dataLen = Object.keys(data).length;
        // siteApkLists
        for (let i = 0; i < dataLen; i++) {
          // Save index of apk version to find site of apk version directly.
          // console.log('data[i].siteId=' + data[i].siteId);
          // console.log('data[i].apkVersion=' + data[i].apkVersion);
          // console.log('set='+data[i].siteId + '_' + data[i].deviceId);
          this.devWithApkMap.set(data[i].siteId + '_' + data[i].deviceId, data[i].apkVersion)
        }
        this.getBindingTable();
      });
  }

  getBindingTable() {
    this.bindingTable = [];

    this.http
      .get(environment.apiServer + 'site/get_binding_table')
      .subscribe((data) => {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          this.bindingTable.push(data['result'][i]);
        }
        // console.log('getBindingTable data=' + JSON.stringify(data));
        this.getSiteLists();
      });
  }

  filterTable() {

    this.siteListArr = this.originSiteListArr;

    if (!this.checkbox_test) {
      this.siteListArr = this.siteListArr.filter(((data) => {
        return data.region !== '測試';
      }))
    }
    if (!this.checkbox_sh) {
      this.siteListArr = this.siteListArr.filter(((data) => {
        return data.region !== '上海';
      }))
    }
    if (!this.checkbox_bj) {
      this.siteListArr = this.siteListArr.filter(((data) => {
        return data.region !== '北京';
      }))
    }
    if (!this.checkbox_gz) {
      this.siteListArr = this.siteListArr.filter(((data) => {
        return data.region !== '廣州';
      }))
    }
  }

  async onBind(data) {
    console.log('onBind data=' + JSON.stringify(data));
    const url = environment.apiServer + 'site/set_binding_table';
    const response = await this.http.post(url, data).toPromise();
    console.log(response);
    this.getSiteApkVersion();
  }
}




