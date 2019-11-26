import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';

import {CookieService} from 'ngx-cookie-service';
import {SOCKET_EVENTS} from '../../../common/socket.interface';
import {Socket} from 'ng-socket-io';

@Component({
  selector: 'ngx-basketball-manage-site',
  templateUrl: './basketball-manage-site.component.html',
  styleUrls: ['./basketball-manage-site.component.scss'],
})
export class BasketballManageSiteComponent implements OnInit {
  server = environment.apiServer;
  siteList: any;
  tableHead = [];
  deviceHead = [];

  constructor(private http: HttpClient, private cookieService: CookieService, private socket: Socket) {
  }


// @ts-ignore
  // @ts-ignore
  ngOnInit() {
    this.getSiteList();
    this.setTableHead();
    this.setDeviceHead();
  }

  getSiteList() {

    // const token = this.cookieService.get('CloudAdminToken');
    // const account = this.cookieService.get( 'CloudAdminUser');
    // console.log(token+account)

    // const body = {
    //   'type': 'soccor',
    // }
    // const url = environment.apiServer + `site/v2/get_site_setting?type=soccer`;
    // const res: any = await
    // this.http.get(url).toPromise();
    // console.log(res)


    // this.http
    // .get(environment.apiServer + 'site/get_site_lists')
    // .subscribe(data => {
    // this.siteList = data;
    // console.log(this.siteList);
    // })
    // let body = {

    // }
    // this.http
    // .post(environment.apiServer + 'site/get_site_names', body)
    // .subscribe(data => {})

  }

  setTableHead() {
    this.tableHead = ['siteId', '球门', 'deviceConfig', '_v', '_id'];
  }

  setDeviceHead() {
    if (this.siteList) {
      this.deviceHead
    }

  }

  startWork(body, cb) {

    this.socket.emit(SOCKET_EVENTS.START_RECORDING, '12345', (data) => {
      cb(data);
    });
  }

  stopWork(body, cb) {
    this.socket.emit(SOCKET_EVENTS.STOP_RECORDING, '12345', (data) => {
      cb(data);
    });
  }


}
