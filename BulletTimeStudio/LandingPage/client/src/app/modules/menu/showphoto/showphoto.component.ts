import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'app-showphoto',
    templateUrl: './showphoto.component.html',
    styleUrls: ['./showphoto.component.css']
})
export class ShowphotoComponent implements OnInit {
    qrcode_url:string='';
    taskId:'';
    activity_id:'';
    create_time:'';
    task_url:string='';
    constructor( private activatedRoute: ActivatedRoute,private http: HttpClient ) {}
  

   ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.taskId=params['taskId'];
        this.activity_id=params['activity_id'];
        this.create_time=params['create_time'];
        console.log(this.taskId)
        console.log(this.activity_id)
    }) 
    this.qrcode_url="https://siiva-video.oss-cn-hangzhou.aliyuncs.com/qrcode/"+this.taskId+".png";
    this.task_url="https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/"+this.activity_id+"/"+this.taskId+".jpg"
}

    goback(){

    }


}