import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { SocketService } from '../../common/socket.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'ngx-site-soccer',
  templateUrl: './site-soccer.component.html',
  styleUrls: ['./site-soccer.component.scss'],
})
export class SiteSoccerComponent implements OnInit {
  siteListArr = [];
  selSite = '';
  siteDetail = {};
  options = '';
  addSiteMsg = '';
  addSiteNewParamArr = [];
  addSitePreview = '';

  addSiteName = '';

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  ngOnInit() {

    // this.http
    // .get(environment.apiServer + 'site/get_site_lists')
    // .subscribe(data => {
    //   const dataLen = Object.keys(data).length;
    //   for (let i = 0; i < dataLen; i++) {
    //     this.siteListArr.push({siteId: data[i].siteId, name: data[i].name});
    //   }
    //   // console.log('siteListArr=' + this.siteListArr);
    // });
  }

  selectSiteOption(option) {
    switch (option) {
      case 'querySite':
        // this.selectQuerySite();
        this.selectSite();
        break;
      case 'addSite':
        this.selectAddSite();
        break;
      case 'updateSite':
        this.selectUpdateSite();
        break;
      default:
        break;
    }
  }

  selectQuerySite() {
    this.options = 'querySite';
    this.siteListArr = [];
    const body = {
      type: 'soccer',
    };
    this.http
    .post(environment.apiServer + 'site/get_site_names', body)
    .subscribe(data => {
      console.log('selectQuerySite data=' + JSON.stringify(data));
      const dataLen = Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push(data[i]);
      }
      console.log('siteListArr=' + this.siteListArr);
    });
  }

  selectSite() {
    this.options = 'querySite';
    const body = {
      type: 'soccer',
    };
    this.http
    .post(environment.apiServer + 'site/get_site_detail', body)
    .subscribe((data) => {
      console.log(JSON.stringify(data));
      // ToDo:
      // this.siteDetail = data;

      // if (this.options === 'updateSite') {
      //   this.updateSiteElement(this.siteDetail);
      // }
      const dataLen = Object.keys(data['result']).length;
      console.log('dataLen=' + dataLen);
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push(data['result'][i]);
      }
      console.log('siteListArr=' + JSON.stringify(this.siteListArr));
    });
  }

  selectAddSite() {
    this.options = 'addSite';
    this.addSiteMsg = '';
  }

  addSite() {
    if (this.addSiteName === '') {
      this.addSiteMsg = 'Need site name';
      return;
    }

    const body = {
      siteName: this.addSiteName,
      type: 'soccer',
    };

    this.addSiteMsg = '';
    this.http
    .post(environment.apiServer + 'site/add_site', body)
    .subscribe((data) => {
      console.log(JSON.stringify(data));
      this.addSiteMsg = data['description'];
    });
  }

  selectUpdateSite() {
    this.options = 'updateSite';
    this.siteListArr = [];
    this.http
    .get(environment.apiServer + 'site/get_site_lists')
    .subscribe(data => {
      console.log('length=' + Object.keys(data).length);
      const dataLen = Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push({siteId: data[i].siteId, name: data[i].name});
      }
    });
  } // End updateSite

  updateSiteElement(data) {
    const element_id = document.getElementById('updateSiteId');
    (<HTMLInputElement>element_id).value = (data.siteId) ? data.siteId : '';

    const element_name = document.getElementById('updateSiteName');
    (<HTMLInputElement>element_name).value = (data.name) ? data.name : '';

    const element_type = document.getElementById('updateSiteType');
    (<HTMLInputElement>element_type).value = (data.type) ? data.type : '';
  }

  updateSite() {
    this.addSiteMsg = '';
    const tmp_detail: any = this.siteDetail;

    const element_id = document.getElementById('updateSiteId');
    let element_id_string = '';
    if (element_id != null) {
      element_id_string = (<HTMLInputElement>element_id).value;
    } else {
      return;
    }

    const element_name = document.getElementById('updateSiteName');
    let element_name_string = '';
    if (element_name != null) {
      element_name_string = (<HTMLInputElement>element_name).value;
    } else {
      return;
    }

    const element_type = document.getElementById('updateSiteType');
    let element_type_string = '';
    if (element_type != null) {
      element_type_string = (<HTMLInputElement>element_type).value;
    } else {
      return;
    }

    if (element_id_string === '') {
      this.addSiteMsg = 'Need site ID';
      return;
    }
    if (element_name_string === '') {
      this.addSiteMsg = 'Need name';
      return;
    }
    if (element_type_string === '') {
      this.addSiteMsg = 'Need type';
      return;
    }

    const body = {
      siteId: element_id_string,
      name: element_name_string,
      type: element_type_string,
      param: tmp_detail.param,
      source: tmp_detail.source,
      output: tmp_detail.output,
      workerId: tmp_detail.workerId,
    };
    this.addSiteMsg = '';
    this.http
    .post(environment.apiServer + 'site/update_site', body)
    .subscribe(data => {
      this.addSiteMsg = data + '';
    });
  }

  addNewParam() {
    this.addSiteNewParamArr.push({param: ''});
  }

  showCurrentParam() {
    const element_id = document.getElementById('addSiteId');
    let element_id_string = '';
    if (element_id != null) {
      element_id_string = (<HTMLInputElement>element_id).value;
    }
    console.log('element_id_string=' + element_id_string);

    const element_name = document.getElementById('addSiteName');
    let element_name_string = '';
    if (element_name != null) {
      element_name_string = (<HTMLInputElement>element_name).value;
    }
    console.log('element_name_string=' + element_name_string);

    const element_type = document.getElementById('addSiteType');
    let element_type_string = '';
    if (element_type != null) {
      element_type_string = (<HTMLInputElement>element_type).value;
    }
    console.log('element_type_string=' + element_type_string);

    const current = {
      siteId: element_id_string,
      name: element_name_string,
      type: element_type_string,
      param: {
      },
      source: {
      },
      output: {
      },
      workerId: '',
    };
    this.addSitePreview = JSON.stringify(current);
    console.log('addSitePreview=' + this.addSitePreview);
  }

  // ToDo: only for soccer test, would be deleted soon
  soccer_test() {
    console.log('soccer_test');
    // 1. soccer login with account and password
    let body = {};
    let ret = {};
    body = {
      account: 'soccer_test',
      password: Md5.hashStr('siiva0901'),
    };
    this.http
    .post(environment.apiServer + 'account/soccerLogin', body)
    .subscribe((data1) => {
      ret = data1;
      console.log('soccerLogin ret = ' + JSON.stringify(ret));
      // 2. get site list
      body = {
        account: 'soccer_test_3',
        accessToken: ret['access_token'],
      };
      ret = this.http.post(environment.apiServer + 'site/get_site_lists', body)
      .subscribe((data2) => {
        ret = data2;
        console.log('get_site_lists ret = ' + JSON.stringify(ret));
        // 3. login server by using socket
        this.socketService.testSoccorSiteMatch({siteId: ret[0].siteId}, (data3) => {
          console.log('testSoccorLogin=' + data3);
          // 4. test goal socket event
          // this.socketService.testSoccorGoal({siteId: ret[0].siteId, taskId: 'test', goalTime: '123456'}, (data4) => {
          //   console.log('testSoccorGoal=' + data4);
          // });
          // 5. test remote shot
          this.socketService.testRemoteShot({siteId: ret[0].siteId, siteIndex: '0'}, (data) => {
            console.log('testRemoteShot=' + data);
          });
        });
      });
    });

    // this.socketService.testSoccor('goal', (data) => {
    //   console.log(data);
    // });
  }

}
