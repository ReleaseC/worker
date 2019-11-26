import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  video_url:string; 
  uname:string='';
  game_id:'';
  server = environment.apiServer;
  time:string='';
  isShare:boolean=false;
  isshareimg:boolean=false;
  islove:boolean=false;
  love_number:number=0;
  share_number:number=0;
  isPlay_number:boolean=true;
  isPlay:boolean=true;
  isbar:boolean=true;
    constructor(
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient, 
    private metaService: Meta
  ) { }

  ngOnInit() {
    // Queryparams
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.game_id =  params['id'];
      this.uname =  params['userName'];
      this.time =  params['time'];
      console.log(this.game_id);
      console.log(this.uname);
      console.log(this.time);
      // this.video_url ='https://siiva.cn-sh2.ufileos.com/' + this.game_id + ".mp4"
      this.video_url='https://siiva.cn-sh2.ufileos.com/0008_'+this.game_id+".mp4";
      console.log(this.video_url);
    });
    // 禁用右键下载功能
    $('#video').bind('contextmenu',function() { return false; });


    // 统计视频页访问量
    const body1 = {
       'siteId':'0008',
       'mode':'point'
      };
     this.http
    .post(`${environment.apiServer}datareport/point_page`, body1)
    .subscribe(data => {
    console.log(data) 
    });
  }


cancelShare(){
  this.isShare=false;
  this.isshareimg=false;
}
love(){
  this.islove=true;
  this.love_number++;
  const body2 = {
    'siteId':'0008',
    'mode':'like'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body2)
 .subscribe(data => {
 console.log(data) 
 });
}
share(){
  this.isShare=true;
  this.isshareimg=true;
  const body3 = {
    'siteId':'0008',
    'mode':'share'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body3)
 .subscribe(data => {
 console.log(data) 
 });
}
count_playnumber(){
  /*统计播放量的接口*/
  const body3 = {
    'siteId':'0008',
    'mode':'play'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body3)
 .subscribe(data => {
 console.log(data) 
 });
  this.isPlay_number=false;
  this.isbar=false;
  var myVideo=document.getElementsByTagName('video')[0];
  if(myVideo.paused){
    myVideo.play();
    this.isPlay=false;
  }else{
    myVideo.pause();
    this.isPlay=true;
  }
}
// 控制video的播放与暂停
playPause(){
  var myVideo=document.getElementsByTagName('video')[0];
  if(myVideo.paused){
    myVideo.play();
    this.isPlay=false;
  }else{
    myVideo.pause();
    this.isPlay=true;
  }
}

}
