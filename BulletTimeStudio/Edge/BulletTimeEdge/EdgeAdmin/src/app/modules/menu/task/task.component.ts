import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../shared/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  taskListArr = [];
  siteListArr = [];
  selSite = '';

  constructor(
    private socketService: SocketService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getSiteList();
    // setInterval(() => {
    //   this.getTasksStatus();
    // }, 10000);
  }

  getSiteList() {
    this.http
    .get(environment.cloudServer + 'site/get_site_lists')
    .subscribe(data => {
      const dataLen = Object.keys(data).length;
      for (let i = 0; i < dataLen; i++) {
        this.siteListArr.push({siteId: data[i].siteId, name: data[i].name});
      }
      console.log('siteListArr=' + this.siteListArr);
    });
  }

  getTasksStatus() {
    console.log('selSite=' + this.selSite);
    this.taskListArr = [];
    this.socketService.getTasksStatus(this.selSite, (data) => {
      console.log('getTasksStatus data = ' + JSON.stringify(data));
      const len = Object.keys(data).length;
      for (let i = 0; i < len; i++) {
        this.taskListArr.push(data[i]);
      }
    });
  }

  refreshSite() {
    this.getTasksStatus();
  }
}
