import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver/FileSaver';
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
  isbar:boolean=true;
  is_weixin:boolean=false;
  is_ios:boolean=false;
  page_url:any;
  isgotodownload:boolean=false;
  isgotopc:boolean=false;
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
      this.video_url ='https://siiva.cn-sh2.ufileos.com/0010_' + this.game_id+'.mp4';
      // this.video_url ='http://siiva.ufile.ucloud.com.cn/0010_'+this.game_id;
      console.log(this.video_url);
    });
  //  获取该game_id的点赞量
    this.http
    .get(environment.apiServer+'users/find', { params: { 'game_id': this.game_id,'name': this.uname } })
    .subscribe(data => {
      console.log(data)
      if(data['result']['likes']==0){
         this.love_number=0;
      }else{
        this.love_number=data['result']['likes'];
      }
    });
    // 禁用右键下载功能
    $('#video').bind('contextmenu',function() { return false; });
    this.page_url=window.location.href;
    // 统计视频页访问量
    const body1 = {
      'siteId':'0010',
      'mode':'point'
     };
    this.http
   .post(`${environment.apiServer}datareport/point_page`, body1)
   .subscribe(data => {
   console.log(data) 
   });

  //    var isPC = function ()
  // {
  //   var userAgentInfo = navigator.userAgent.toLowerCase();
  //   var Agents = new Array("android", "iphone", "symbianOS", "windows phone", "ipad", "ipod");
  //   var flag = true;
  //   for (var v = 0; v < Agents.length; v++) {
  //       if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
  //   }
  //   return flag;
  // }

  // if(isPC){
  //   this.isgotopc=true;
  // }

   if(this.detectpc()){
    this.isgotopc=true;
   }

    // 判断是否为微信端
  var ua = navigator.userAgent.toLowerCase();
  var isWeixin = ua.indexOf('micromessenger') != -1;
  if(isWeixin){
    // alert('请前往融e联下载')
    this.isgotodownload=true;
  }

  }

  detectpc() {  
    if( navigator.userAgent.match(/Android/i)  
    || navigator.userAgent.match(/webOS/i)  
    || navigator.userAgent.match(/iPhone/i)  
    || navigator.userAgent.match(/iPad/i)  
    || navigator.userAgent.match(/iPod/i)  
    || navigator.userAgent.match(/BlackBerry/i)  
    || navigator.userAgent.match(/Windows Phone/i)  
    ){  
        return false;  
    }  
    else {  
        return true;  
    }  
}  
cancelShare(){
  this.isShare=false;
  this.isshareimg=false;
}
love(){
  this.islove=true;
  this.love_number++;
  // 统计总点赞量
  const body2 = {
    'siteId':'0010',
    'mode':'like'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body2)
 .subscribe(data => {
 console.log(data) 
 });
// 统计该game_id点赞量
 this.http
 .get(environment.apiServer+'users/give_like', { params: {'game_id': this.game_id } })
 .subscribe(data => {
      console.log(data)
 });


}
share(){
  const body3 = {
    'siteId':'0010',
    'mode':'share'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body3)
 .subscribe(data => {
 console.log(data) 
 });
  this.isShare=true;
  this.isshareimg=true;
}
count_playnumber(){
  /*统计播放量的接口*/
  const body4 = {
    'siteId':'0010',
    'mode':'play'
   };
  this.http
 .post(`${environment.apiServer}datareport/point_page`, body4)
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

textdownload(){
  
  // 判断是否为微信端
  // var ua = navigator.userAgent.toLowerCase();
  // var isWeixin = ua.indexOf('micromessenger') != -1;
 // 判断是否为android端||ios端
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if(isiOS){
     this.is_ios=true;
  }
  if(isAndroid){
      window.open('https://siiva.cn-sh2.ufileos.com/0010_' + this.game_id + '.mp4');
  } 

}
//微信端用户进入融e联下载
gotodownload(){
  this.is_weixin=true;
}
gotopc(){
      const headers = new HttpHeaders({ 'Content-Type': 'video/mp4' });
    return this.http.get(
      'https://siiva.cn-sh2.ufileos.com/0010_' + this.game_id + '.mp4',
      {
        headers: headers,
        responseType: 'blob' //這邊要選 `blob`
      }).toPromise().then((response) => {
        saveAs(response, this.game_id+ '.mp4');
      }).catch(e => {
        console.log('error=' + e);
      });
}

  
  cancel_ios(){
    this.is_ios=false;
  }
  cancel_weixin(){
    this.is_weixin=false;
  }


 

}
