import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../../common/socket.service';

@Component({
  selector: 'ngx-device-add',
  templateUrl: './device-add.component.html',
  styleUrls: ['./device-add.component.scss'],
})
export class DeviceAddComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) {}

  server = environment.apiServer;
  devicelist = [];
  deviceheader: any;
  name: string;
  mac: string;

  async ngOnInit() {
      // tslint:disable-next-line:no-console
      console.log(this.server);
      this.deviceheader = ['Camera Name', 'MAC Address'];
      this.getDeviceList();
  }

  async getDeviceList() {
      const url = `${this.server}/device/get_device_list`;
      const response = await this.http.get(url).toPromise();
      this.devicelist = response['device'];
  }

  async addDevice() {
      const data = { name: this.name, mac: this.mac };
      const url = `${this.server}/device/add_device`;
      const response = await this.http.post(url, data).toPromise();
      this.devicelist = response['device'];
  }

}
