import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  apiServer = environment.apiServer;
  siteId = '';
  siteArr = [];
  initSiteSetting = -1;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
    this.getSiteDetail();
  }

  getSiteDetail() {
    this.http
        .get(
            this.apiServer + 'site/v2/get_basketAnnoSite' +
            `?accessToken=${this.cookieService.get('AnnoToolToken')}`)
        .subscribe(data => {
          if (data['code'] === 0) {
            const dataLen = Object.keys(data['result']).length;
            for (let i = 0; i < dataLen; i++) {
              this.siteArr.push(data['result'][i]);
            }

            this.initSiteSetting = (() => {
              const siteId = localStorage.getItem('siteId');
              const index = this.getIndexBySiteId(siteId);
              if (index >= 0) {
                this.onSelectSetting(index);
              }
              return index;
            })();
          }
        });
  }

  onSelectSetting(index) {
    this.siteId = this.siteArr[index].siteId;
    localStorage.setItem('siteId', index >= 0 && this.siteId);

    this.http
        .get(
            this.apiServer +
            'site/v2/get_basketAnnoTeamBySiteId?siteId=' + this.siteId)
        .subscribe(data => {
          if (data['code'] === 0) {

          }
        });
  }

  getIndexBySiteId(siteId) {
    for (let i = 0; i < this.siteArr.length; i++) {
      if (this.siteArr[i].siteId === siteId) {
        return i;
      }
    }
    return -1;
  }

}
