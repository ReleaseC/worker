import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  connecntMap = new Map<string, number>();
  siteListArr = [];
  selectedDate = '';
  total = 0;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    const body = {
      type: 'soccer',
    };
    this.http
      .post(environment.apiServer + 'site/get_site_detail', body)
      .subscribe((data) => {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          // console.log('name=' + data['result'][i].siteName);
          // console.log('siteId=' + data['result'][i].siteId);
          this.connecntMap.set(data['result'][i].siteId, 0);
          this.siteListArr.push({'siteName': data['result'][i].siteName, 'siteId': data['result'][i].siteId});
        }
      });
  }

  clearData() {
    this.connecntMap.clear();
    this.total = 0;
    for (let i = 0; i < this.siteListArr.length; i++) {
      this.connecntMap.set(this.siteListArr[i].siteId, 0);
    }
  }

  async getTaskNumber() {
    this.clearData();

    const url = `${environment.apiServer}task/task_list_get/?time=${this.selectedDate}&state=complete&sort=true`;
    const response: any = await this.http.get(url).toPromise();
    response.forEach(data => {
      if (this.connecntMap.has(data.task.siteId)) {
        const tmp = this.connecntMap.get(data.task.siteId);
        this.connecntMap.set(data.task.siteId, tmp + 1);
      }
    });

    for (let i = 0; i < this.siteListArr.length; i++) {
      if (this.connecntMap.has(this.siteListArr[i].siteId)) {
        this.siteListArr[i].videoNum = this.connecntMap.get(this.siteListArr[i].siteId);
        this.total += this.siteListArr[i].videoNum;
      }
    }
  }

}
