import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'ngx-soccer-match-site',
  templateUrl: './soccer-match-site.component.html',
  styleUrls: ['./soccer-match-site.component.scss'],
})
export class SoccerMatchSiteComponent implements OnInit {
  accountArr = [];
  siteListArr = [];
  siteMatchArr = [];
  regionArr = ['上海', '北京', '廣州', '測試'];
  selectAccount = '';
  selectSiteId = '';
  selectRegion = '';

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    // this.getAccount();
    this.getSiteList();
    this.getAccountMatchSites();
  }

  getAccount() {
    console.log('getAccount()');
    this.http
    .get(environment.apiServer + 'account/get_soccer_account')
    .subscribe((data) => {
      console.log('getAccount data=' + JSON.stringify(data));
      const dataLen = Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        this.accountArr.push({'account': data[i].name})
      }
    });
  }

  getSiteList() {
    const body = {
      type: 'soccer',
    };
    this.http
    .post(environment.apiServer + 'site/get_site_detail', body)
    .subscribe((data) => {
      const dataLen = Object.keys(data['result']).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push({'siteId': data['result'][i].siteId, 'siteName': data['result'][i].siteName})
      }
    });
  }

  getAccountMatchSites() {
    const body = {
      type: 'soccer',
    };
    this.http
    .post(environment.apiServer + 'site/get_site_detail', body)
    .subscribe((data) => {
      // console.log('getAccountMatchSites=' + JSON.stringify(data));
      const dataLen = Object.keys(data['result']).length;
      let temp = {};
      for (let i = 0; i < dataLen; i++) {
        temp = {
          // 'account': data['result'][i].account,
          'siteId': data['result'][i].siteId,
          'siteName': data['result'][i].siteName,
          'region': data['result'][i].region,
        };
        this.siteMatchArr.push(temp);
      }
    });
  }

  showAccount() {
    console.log('selectAccount=' + this.selectAccount);
    console.log('selectSiteId=' + this.selectSiteId);
    console.log('selectRegion=' + this.selectRegion);
  }

  doAccountMatchSite() {
    this.siteMatchArr = [];

    const body = {
      // 'account': this.selectAccount,
      'siteId': this.selectSiteId,
      'region': this.selectRegion,
    };
    console.log('doAccountMatchSite() body=' + JSON.stringify(body));
    this.http
      .post(environment.apiServer + 'site/account_match_sites', body)
      .subscribe((data) => {
        console.log('doAccountMatchSite ret = ' + JSON.stringify(data));
        this.getAccountMatchSites();
      });
  }

}
