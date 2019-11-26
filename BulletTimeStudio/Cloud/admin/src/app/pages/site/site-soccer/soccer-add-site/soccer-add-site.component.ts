import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { SocketService } from '../../../common/socket.service';
import { Md5 } from 'ts-md5';

@Component({
  selector: 'ngx-soccer-add-site',
  templateUrl: './soccer-add-site.component.html',
  styleUrls: ['./soccer-add-site.component.scss'],
})
export class SoccerAddSiteComponent implements OnInit {
  addSiteMsg = '';
  addSiteName = '';

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  ngOnInit() {}

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
      this.addSiteMsg = data['description'];
    });
  }

}
