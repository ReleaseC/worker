import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'ngx-management-update',
  templateUrl: './management-update.component.html',
  styleUrls: ['./management-update.component.scss'],
})
export class ManagementUpdateComponent implements OnInit {
  server = environment.apiServer;
  siteSettingArr = [];
  selectType = '';
  siteMsg = '';
  inputSetting = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
  }

  onSelect() {
    this.siteSettingArr = [];
    this.http.get(this.server + 'site/v2/get_site_setting?type=' + this.selectType +
     '&access_token=' + this.cookieService.get( 'CloudAdminToken' ))
    .subscribe(data => {
      if (data['code'] === 0) {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          this.siteSettingArr.push(data['result'][i]);
        }
      }else {
        this.siteMsg = data['description'];
      }
    }, err => {
      this.siteMsg = err.toString();
    });
  }

  onSelectSetting(i) {
    this.inputSetting = JSON.stringify(this.siteSettingArr[i]);
  }

  updateSiteSetting() {
    try {
      if (this.inputSetting) {
        const body = {
          'type': this.selectType,
          'data': JSON.parse(this.inputSetting),
          'access_token': this.cookieService.get( 'CloudAdminToken' ),
        };
        this.http.post(this.server + 'site/v2/update_site_setting', body)
        .subscribe(data => {
          if (data['code'] === 0) {
            this.siteMsg = data['description'];
          }else {
            this.siteMsg = data['description'];
          }
        }, err => {
          this.siteMsg = err.toString();
        });
      } else {
        this.siteMsg = 'Null setting';
      }
    } catch (e) {
      this.siteMsg = e.toString();
    }
  }

}
