import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { setTimeout } from 'core-js/library/web/timers';
import { saveAs } from 'file-saver/FileSaver';

import * as $ from 'jquery';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
@Injectable()
export class ResultComponent implements OnInit {
  @ViewChild('myCanvas') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  id:'';
  video_url:string='';
  isLove:boolean=false;
  isPlay:boolean=true;
  isShare:boolean=false;
  isClick:boolean=false;
  isResult:boolean=true;
  isShow:boolean=true;
  isPay:boolean=false;
  love_number:number=0;
  i:any;
  value: number = 0;
  is_share:any;
  friend_id:any;
  is_like:any;
  username:any;
  baseUrl:any;
  videonames:any;
  isplay:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
  ) { }

  ngOnInit() {
  
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.is_share = params['is_share'];
      this.friend_id = params['friend_id'];
      this.is_like = params['is_like'];
      this.love_number = params['number'];
      this.id = params['id'];
      this.username = params['name'];
      this.videonames = params['videonames'];
      this.isplay = params['is_play'];
      console.log(this.videonames)
    console.log(this.id);
    console.log(this.is_share);
    console.log(this.friend_id);
    console.log(this.is_like);
    console.log(this.love_number);
    console.log(this.username)
    });
    // 判断该链接为分享出去的链接
    if(this.is_share==='siiva'){
      // console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0c9caded7e8fc8d&redirect_uri=https%3a%2f%2fbt.siiva.com%2fwechat%2fis_user&response_type=code&scope=snsapi_base&state='+this.id+'&connect_redirect=1#wechat_redirect')
      window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbf59726268c9d7d0&redirect_uri=https%3a%2f%2fbt.siiva.com%2fwechat%2fis_user&response_type=code&scope=snsapi_base&state='+this.id+','+this.videonames+','+this.username+','+'0004&connect_redirect=1#wechat_redirect';
    }
    if(this.isplay==='no'){
      this.router.navigate(['fail']);
    }else{
      if (this.videonames === 'undefined') {
        this.router.navigate(['waiting']);
      } 
    }
    this.video_url = 'http://siiva.cn-sh2.ufileos.com/ucloud/' + this.videonames + '.mp4';
    console.log(this.video_url);
    if (this.love_number === undefined) {
      this.love_number = 0;
    }


// 判断该friend_id是否已经点赞
    if(this.is_like==1){
      this.isLove=true;
    }

    // 统计视频页访问量
     const body1 = {
      'url':'https://bt.siiva.com/0004/#/result',
      'urlnumber':1,
      'sharenumber':0
      };
     this.http
    .post(`${environment.apiServer}wechat/create_number`, body1)
    .subscribe(data => {
    console.log(data) 
    });



    // 禁用右键下载功能
    $('#video').bind('contextmenu',function() { return false; });

    
    // 判断当前是否为微信端，下载功能需要引导user进入其他浏览器下载
    // if (this.is_weixn()) { 
    //   alert('点击右上角从其它浏览器进入下载')
    // } 

    // 判断是否付费成功
    // const body = {
    //   'openid': this.id
    //   };
    // this.http
    // .post(`${environment.apiServer}wechat_payment/is_pay`, body)
    // .subscribe(data => {
    // console.log(data) 
    // console.log(data['code'])
    // if(data['code']===1){
    //   this.isPay=false;
    //   this.isClick=false;
    // }
    // });
  
  }
  // 进入支付页面
// goPay(){
//   this.router.navigate(['/pay'],{ queryParams: {id:this.id}});
//   }
 

// 点赞功能
Love(){
  this.isLove=true;
  this.love_number++;
  if(this.friend_id===undefined){
    this.friend_id=this.id;
  }
  const body = {
    'open_id': this.id,
    'friend_id':this.friend_id
    };
    // console.log(body);
  this.http
  .post(`${environment.apiServer}wechat/get_like`, body)
  .subscribe(data => {
  console.log(data) 
  });
}
// 控制video播放与暂停
playPause(){
  this.isShow=false;
  var myVideo=document.getElementsByTagName('video')[0];
  if(myVideo.paused){
    myVideo.play();
    this.isPlay=false;
  }else{
    myVideo.pause();
    this.isPlay=true;
  }
}
  // 分享提示
  share() {
    this.isShare = true;
    this.isPlay = false;
    const body2 = {
      'url':'https://bt.siiva.com/0004/#/result',
      'urlnumber':0,
      'sharenumber':1
      };
     this.http
    .post(`${environment.apiServer}wechat/create_number`, body2)
    .subscribe(data => {
    console.log(data) 
    });

  }
  // 取消分享提示
  cancelShare() {
    this.isShare = false;
  }
  // 判断微信浏览器
  is_weixn(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf('micromessenger') != -1) {
        return true;
    } else {
        return false;
    }
}

testDownload() {
  if (this.is_weixn()) { 
      alert('点击右上角从其它浏览器进入下载');
    } 
  const headers = new HttpHeaders({ 'Content-Type': 'video/mp4' });
  return this.http.get(
    'https://siiva.cn-sh2.ufileos.com/' + this.id + '.mp4',
    {
      headers: headers,
      responseType: 'blob' //這邊要選 `blob`
    }).toPromise().then((response) => {
      saveAs(response, this.id + '.mp4');
    }).catch(e => {
      console.log('error=' + e);
    });
}

}