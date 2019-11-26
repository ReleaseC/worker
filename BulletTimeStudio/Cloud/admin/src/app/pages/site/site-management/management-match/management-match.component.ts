import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'ngx-management-match',
  templateUrl: './management-match.component.html',
  styleUrls: ['./management-match.component.scss'],
})
export class ManagementMatchComponent implements OnInit {
  server = environment.apiServer;
  access_token = this.cookieService.get('CloudAdminToken');
  siteSettingArr = [];
  accountListArr = [];
  selectAccountIndex = 0;
  selectType = '';
  siteMsg = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
    this.getAccountList();
  }

  getAccountList() {
    this.accountListArr = [];

    this.http.get(this.server + 'account/v2/account_getlists?access_token=' + this.access_token)
    .subscribe(data => {
      if (data['code'] === 0) {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          this.accountListArr.push({
            'account': data['result'][i].account,
            'matchSites': data['result'][i].matchSites,
          });
        }
      }else {
        this.siteMsg = data['description'];
      }
    }, err => {
      this.siteMsg = err.toString();
    });
  }

  checkAccountMatchSites(siteId) {
    const matchSites =
      (this.accountListArr[this.selectAccountIndex].matchSites) ? (this.accountListArr[this.selectAccountIndex].matchSites) : '';
    if (matchSites.length > 0) {
      for (let i = 0; i < matchSites.length; i++) {
        if (matchSites[i].matchSiteName === this.selectType) {
          for (let j = 0; j < matchSites[i].matchSiteLists.length; j++) {
            if (matchSites[i].matchSiteLists[j] === siteId) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  onSelectType() {
    this.siteSettingArr = [];
    this.http.get(this.server + 'site/v2/get_site_setting?type=' + this.selectType +
      '&access_token=' + this.access_token)
    .subscribe(data => {
      if (data['code'] === 0) {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          const checked = this.checkAccountMatchSites(data['result'][i].siteId);
          this.siteSettingArr.push({
            'siteId': data['result'][i].siteId,
            'siteName': (data['result'][i].type) ? data['result'][i].name : data['result'][i].siteName,
            'checked': checked,
          });
        }
      }else {
        this.siteMsg = data['description'];
      }
    }, err => {
      this.siteMsg = err.toString();
    });
  }

  selectSites(i) {
    this.siteSettingArr[i].checked = !this.siteSettingArr[i].checked;
  }

  updateMatchSites() {
    const selectSiteIdArr = [];
    for (let i = 0; i < this.siteSettingArr.length; i++) {
      if (this.siteSettingArr[i].checked) {
        selectSiteIdArr.push(this.siteSettingArr[i].siteId);
      }
    }

    const body = {
      'account': this.accountListArr[this.selectAccountIndex].account,
      'matchSiteName': this.selectType,
      'matchSiteLists': selectSiteIdArr,
      'access_token': this.access_token,
    };

    this.http.post(this.server + 'account/v2/account_matchSites', body)
    .subscribe(data => {
      console.log('data=' + JSON.stringify(data));
      if (data['code'] === 0) {
        this.siteMsg = data['description'];
      }else {
        this.siteMsg = data['description'];
      }
    }, err => {
      this.siteMsg = err.toString();
    });
    this.getAccountList();
  }
}
