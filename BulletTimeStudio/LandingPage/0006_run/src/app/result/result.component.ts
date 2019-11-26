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
  isPlay_number:boolean=true;
  isPlay:boolean=true;
  love_number:number=0;
  share_number:number=0;


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
      this.video_url ='https://siiva.cn-sh2.ufileos.com/0006_' + this.game_id;
      // this.video_url ='http://siiva.ufile.ucloud.com.cn/0006_'+this.game_id;
      console.log(this.video_url);
    });
    // 禁用右键下载功能
    $('#video').bind('contextmenu',function() { return false; });


    // 统计视频页访问量
    const body1 = {
      'url':'https://bt.siiva.com/0006/#/result',
      'urlnumber':1,
      'sharenumber':0
      };
     this.http
    .post(`${environment.apiServer}wechat/create_number`, body1)
    .subscribe(data => {
    console.log(data) 
    });
    //  this.uname='赵政';
    //  this.time='1:43:43';
  }


cancelShare(){
  this.isShare=false;
  this.isshareimg=false;
}
love(){
  this.islove=true;
  this.love_number++;
  const body = {
    'open_id': 'jidong10s',
    'friend_id': 'jindong10s'
  };
  // console.log(body);
  this.http
    .post(`${environment.apiServer}wechat/get_like`, body)
    .subscribe(data => {
      console.log(data)
    });
}
share(){
  const body2 = {
    'url':'https://bt.siiva.com/0006/#/result',
    'urlnumber':0,
    'sharenumber':1
    };
   this.http
  .post(`${environment.apiServer}wechat/create_number`, body2)
  .subscribe(data => {
  console.log(data) 
  });
  this.isShare=true;
  this.isshareimg=true;
}
count_playnumber(){
  /*统计播放量的接口*/ 
  this.isPlay_number=false;
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
