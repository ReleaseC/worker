import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'ngx-bullettime-manage-site',
  templateUrl: './bullettime-manage-site.component.html',
  styleUrls: ['./bullettime-manage-site.component.scss'],
})
export class BullettimeManageSiteComponent implements OnInit {
  server = environment.apiServer;
  reponseSiteId = '';
  reponseUpdateTime = '';
  reponsePhotoTime = '';
  reponseDeviceStatus = [];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.checkDeviceStatus();
    setInterval(() => {
      this.checkDeviceStatus();
    }, 30000);
  }

  async checkDeviceStatus() {
    const url = `${this.server}/device/get_device_status/?siteId=0013`;
    const response: any = await this.http.get(url).toPromise();
    console.log('response = ' + JSON.stringify(response));
    if (response.device.result.length) {
      this.reponseSiteId = response.device.result[0].siteId;
      this.reponseUpdateTime = response.device.result[0].status.updateTime;
      this.reponsePhotoTime = response.device.result[0].status.photoTime;
      const deviceStatus = response.device.result[0].status.data;
      const deviceStatusLen = deviceStatus.length;
      let object = {};
      let color = '#FFFFFF';
      this.reponseDeviceStatus = [];
      for (let i = 0; i < deviceStatusLen; i++) {
        // console.log('deviceStatus[' + i + ']=' + JSON.stringify(deviceStatus[i]));
        object = {
          'color': (deviceStatusLen > 0) ? ((color === '#FFFFFF') ? color = 'LightGray' : color = '#FFFFFF') : '',
          'index': deviceStatus[i].index,
          'name': deviceStatus[i].name,
          'ip': deviceStatus[i].ip,
          'battery': deviceStatus[i].battery,
          'batteryColor': (deviceStatus[i].battery > 60) ? 'blue' : 'red',
          'photo': deviceStatus[i].photo,
          'photoColor': (deviceStatus[i].photo) ? 'blue' : 'red',
          'isalive': deviceStatus[i].isalive,
          'isaliveColor': (deviceStatus[i].isalive) ? 'blue' : 'red',
          'mac': deviceStatus[i].mac,
        };
        this.reponseDeviceStatus.push(object);
      }
    }
  }

}
