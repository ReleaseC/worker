import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
declare var require: any;

@Component({
  selector: 'ngx-management-setting',
  templateUrl: './management-setting.component.html',
  styleUrls: ['./management-setting.component.scss'],
})
export class ManagementSettingComponent implements OnInit {
  server = environment.apiServer;
  selectType = '';
  referenceSetting = '';
  inputSetting: any;
  siteMsg = '';
  uuid = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
    this.refreshUUID();
  }

  refreshUUID() {
    const uuidv1 = require('uuid/v1');
    this.uuid = uuidv1().replace(/-/g, '');
  }

  onSelect() {
    console.log('select=' + this.selectType);
    this.inputSetting = '';
    this.siteMsg = '';
    switch (this.selectType) {
      case 'BT':
        console.log('case BT');
        this.referenceSetting = `
          {
            "siteId" : "0014",
            "name" : "hellokitty",
            "type" : "BT-1",
            "param" : {
              "text" : "",
              "background" : "path/to/bgFile/in/ucloud",
              "fps" : "30",
              "mask" : "greenscreen",
              "color" : "green",
              "similarity" : "0.17",
              "blend" : "0.1",
              "framerate" : "5",
              "loop" : "0",
              "type" : "more"
            },
            "output" : {
              "name" : "",
              "path" : "ucloud",
              "format" : {
              "width" : 1080,
              "height" : 1920
              }
            },
            "accessToken" : "7a7edbb0790d11e8b8ec335648b170b1",
            "expireTime" : "1532587943147",
            "template" : {
              "path" : "ufile/siiva",
              "type" : "mp4",
              "templates" : [ "0012_1", "0012_2", "0012_3", "0012_4", "0012_5", "0012_6" ],
              "name" : {
                "0012_1" : "黑色模板",
                "0012_2" : "星空",
                "0012_3" : "黑色模板",
                "0013_4" : "星空",
                "0013_5" : "黑色模板",
                "0013_6" : "黑色模板"
              },
              "price" : {
                "0013_1" : "0.01",
                "0013_2" : "0.01",
                "0013_3" : "0.01",
                "0013_4" : "0.01",
                "0013_5" : "0.01"
              }
            },
            "deviceConfig" : {
              "camera" : [
                { "name" : "sh_xiaoyi-1", "mac" : "04:E6:76:2F:77:9C" },
                { "name" : "sh_xiaoyi-2", "mac" : "04:E6:76:12:84:DA" },
                { "name" : "sh_xiaoyi-3", "mac" : "04:E6:76:00:9A:62" },
                { "name" : "sh_xiaoyi-4", "mac" : "04:E6:76:10:44:BC" },
                { "name" : "sh_xiaoyi-5", "mac" : "04:E6:76:24:36:05" },
                { "name" : "sh_xiaoyi-6", "mac" : "04:E6:76:45:95:58" },
                { "name" : "sh_xiaoyi-7", "mac" : "04:E6:76:11:37:0D" },
                { "name" : "sh_xiaoyi-8", "mac" : "04:E6:76:05:39:93" },
                { "name" : "sh_xiaoyi-9", "mac" : "04:E6:76:10:1E:F4" },
                { "name" : "sh_xiaoyi-10", "mac" : "04:E6:76:28:09:92" },
                { "name" : "sh_xiaoyi-11", "mac" : "04:E6:76:13:CC:7D" },
                { "name" : "sh_xiaoyi-12", "mac" : "04:E6:76:40:C5:9F" },
                { "name" : "sh_xiaoyi-13", "mac" : "04:E6:76:08:3E:83" },
                { "name" : "sh_xiaoyi-14", "mac" : "04:E6:76:09:BD:A9" },
                { "name" : "sh_xiaoyi-15", "mac" : "04:E6:76:2B:C6:88" },
                { "name" : "sh_xiaoyi-16", "mac" : "04:E6:76:04:9C:DE" },
                { "name" : "sh_xiaoyi-17", "mac" : "04:E6:76:52:E6:F3" },
                { "name" : "sh_xiaoyi-018", "mac" : "04:E6:76:23:13:86" },
                { "name" : "sh_xiaoyi-019", "mac" : "04:E6:76:46:52:ED" },
                { "name" : "sh_xiaoyi-020", "mac" : "04:E6:76:51:3B:EE" },
                { "name" : "sh_xiaoyi-021", "mac" : "04:E6:76:01:69:5C" },
                { "name" : "sh_xiaoyi-022", "mac" : "04:E6:76:49:EF:C8" },
                { "name" : "sh_xiaoyi-023", "mac" : "04:E6:76:13:6B:1C" },
                { "name" : "sh_xiaoyi-024", "mac" : "04:E6:76:4C:B4:82" },
                { "name" : "sh_xiaoyi-025", "mac" : "04:E6:76:46:61:E7" }
              ]
            },
            "sparedeviceConfig" : {
              "camera" : [
                { "name" : "beiyong_xiaoyi_1", "mac" : "04:E6:76:35:B8:F8" }
              ]
            },
            "source" : {  },
            "wechatPaymentConfig" : {
              "appid" : "wx71f94faa986aa53b",
              "mchid" : "1502192181",
              "partnerKey" : "D0A3F589989F8C38226A177A2BF6BB83",
              "pfx" : "",
              "notify_url" : "https://bt.siiva.com/wechat_payment/notify_wechatpay",
              "spbill_create_ip" : "106.75.216.70"
            }
          }
        `;
        break;
      case 'Soccer':
        console.log('case BT');
        this.referenceSetting = `
          {
            "deviceConfig" : [],
            "siteId" : "",
            "siteName" : "soccer_test",
            "siteType" : "SOCCOR",
            "region" : "測試"
          }
        `;
        break;
      case 'Basketball':
        console.log('case Basketball');
        this.referenceSetting = `
          {
            "deviceConfig" : [],
            "siteId" : "",
            "siteName" : "basket_test",
            "siteType" : "BASKETBALL",
            "region" : "測試"
          }
        `;
        break;
      default:
        console.log('case default');
        this.referenceSetting = '';
        break;
    }
  }

  postSiteSetting() {
    if (this.inputSetting) {
      console.log('this.inputSetting=' + this.inputSetting);
      const body = {
        'type': this.selectType,
        'data': JSON.parse(this.inputSetting),
        'access_token': this.cookieService.get( 'CloudAdminToken' ),
      };
      this.http.post(this.server + 'site/v2/post_site_setting', body)
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
  }
}
