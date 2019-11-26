import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { SocketService } from '../../../common/socket.service';

@Component({
  selector: 'ngx-soccer-query-site',
  templateUrl: './soccer-query-site.component.html',
  styleUrls: ['./soccer-query-site.component.scss'],
})
export class SoccerQuerySiteComponent implements OnInit {
  siteListArr = [];
  options = '';

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.selectSite();
  }

  selectSite() {
    const body = {
      type: 'soccer',
    };
    this.http
    .post(environment.apiServer + 'site/get_site_detail', body)
    .subscribe((data) => {
      const dataLen = Object.keys(data['result']).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push(data['result'][i]);
      }
    });
  }
}
