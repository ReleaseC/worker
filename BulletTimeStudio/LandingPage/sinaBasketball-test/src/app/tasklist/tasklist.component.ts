import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatTableDataSource } from '@angular/material';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {

  constructor(private http: HttpClient) { }
  @ViewChild('filter') filter: ElementRef;
  server = environment.apiServer;
  limit: number;
  time: string;
  taskNumber = 0;
  taskDataSource = new MatTableDataSource();
  updateTime: string;
  sitelist = [];
  searchName = '';
  searchState = '';
  region = ['soccer_test', '淺水灣,番茄,2361,麵包樹', '觀音堂,四德', '球聖,龍燁'];
  checkArray = [false, false, false, false];
  hasRefresh = true;
  timeInterval: any;
  refreshTime = 60;


  async ngOnInit() {
    const url = `${this.server}site/get_site_detail`;
    const body = {
      type: 'soccer',
    };
    const response = await this.http.post(url, body).toPromise();
    console.log(response)
    this.sitelist = response['result'];
    this.getTasklist(100);
    this.updateTime = new Date().toLocaleTimeString().replace(/\//g, '-');
    this.refreshSwitch();
  }

  async getTasklist(limit: number) {
    this.limit = limit;
    this.time = this.time ? this.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
    const url = `${this.server}task/task_list_get/?time=${this.time}&limit=${limit}&sort=true`;
    const response: any = await this.http.get(url).toPromise();
    console.log(response)
    // response.forEach(task => {
    //   task['siteName'] = this.sitelist.find(site => site.siteId === task.task.siteId)['siteName'];
    // });
    // this.taskDataSource.data = response;
  }

  refreshSwitch() {
    if (this.hasRefresh) {
      this.timeInterval  = setInterval(() => {
        this.getTasklist(this.limit);
        this.updateTime = new Date().toLocaleTimeString().replace(/\//g, '-');
      }, this.refreshTime * 1000);
    } else {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
      }
    }
  }

  async checkVideo(data) {
    const url = `${this.server}task/get_task_file_lists`;
    const response: any = await this.http.post(url, data.task).toPromise();
    if (response['result'].length > 0) {
      const fileNameList = response['result'].split('\n');
      let msg = '';
      fileNameList.pop();
      fileNameList.forEach((file, index) => {
        switch (file.split('_')[3]) {
          case '0':
            msg += `半場: \n${file}\n`;
            break;
          case '1':
            msg += `龍門: \n${file}\n`;
            break;
          case '2':
            msg += `角落: \n${file}`;
            break;
          default:
            break;
        }
      });
      alert(msg);
    } else {
      alert('no file');
    }
  }

  async updateTask(data) {
    const fileNameUrl = `${this.server}task/get_task_file_lists`;
    const fileNameRes: any = await this.http.post(fileNameUrl, data.task).toPromise();
    const fileNameList = fileNameRes['result'].split('\n');
    fileNameList.pop();
    const update = {
      taskId: data.task.taskId,
      fileName1: fileNameList[0],
      fileName2: fileNameList[1],
      fileName3: fileNameList[2],
      state: 'data.ready',
      type: 'soccer',
    };
    const url = `${this.server}task/task_update`;
    const response: any = await this.http.post(url, update).toPromise();
    this.manualRefresh();
  }

  async cancelTask(data) {
    const url = `${this.server}task/task_cancel`;
    const update = {
      task_id: data.task.taskId,
      msg: 'cancel task',
    };
    const response: any = await this.http.post(url, update).toPromise();
    this.manualRefresh();
  }

  async manualRefresh() {
    await this.getTasklist(this.limit);
    this.updateTime = new Date().toLocaleTimeString().replace(/\//g, '-');
  }

  applyFilter(filterValue: string, key: string) {
    key === 'siteName' ? this.searchName = filterValue.trim() : this.searchState = filterValue.trim();
    this.taskDataSource.filterPredicate = (data) => {
      if (this.searchName.length > 0 && this.searchState.length > 0) {
        return this.searchName.split(',').some(filter => data['siteName'].includes(filter)) && data['state'].includes(this.searchState);
      }
      if (this.searchName.length > 0 && this.searchState.length === 0) {
        return this.searchName.split(',').some(filter => data['siteName'].includes(filter));
      }
      if (this.searchName.length === 0 && this.searchState.length > 0) {
        return data['state'].includes(this.searchState);
      }
    };
    this.taskDataSource.filter = this.searchName.length > 0 ? this.searchName : this.searchState;
  }

  checkFilter() {
    let filterValue = '';
    this.region.forEach((filter, index) => {
      if (this.checkArray[index]) {
        filterValue = `${filterValue},${filter}`;
      }
    });
    filterValue = filterValue.substring(1);
    this.applyFilter(filterValue, 'siteName');
  }
}
