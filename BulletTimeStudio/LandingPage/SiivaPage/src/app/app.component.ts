import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../environments/environment';
import {Title} from '@angular/platform-browser';
import{LoggerService}from './share/logger.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  activity_id:any;
  activityName:any;
  constructor(private activatedRoute: ActivatedRoute,private router: Router,private http: HttpClient, public title: Title,private loggerService:LoggerService) {}
 ngOnInit() {
     this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.activity_id=params['activity_id'];
      this.loggerService.log(this.activity_id);
      if(this.activity_id==undefined){
        this.title.setTitle('MoMe');
      }else{
        if(this.activity_id=='1541382417'){   //游龙活动ID  标题为“智能云影像”
          this.title.setTitle('智能云影像');
        }else{
          this.http
          .get(`${environment.downloadServer}activity_simple`,{ params: { 'activity_id': this.activity_id} })
          .subscribe(data => {
            this.loggerService.log(data);
            this.activityName=data['activity_name'];
            // 设定活动名为title
            this.title.setTitle(this.activityName);
            
          })
        }
    }
    });
  }
}
