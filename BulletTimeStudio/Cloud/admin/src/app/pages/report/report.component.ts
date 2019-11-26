import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  siteListArr = [];
  selSite = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http
    .get(environment.apiServer + 'site/get_site_lists')
    .subscribe(data => {
      const dataLen = Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push({siteId: data[i].siteId, name: data[i].name});
      }
      // console.log('siteListArr=' + this.siteListArr);
    });
  }

  selectSite() {
    console.log('selSite=' + this.selSite);
  }

}
