import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  id: '';
  video_url: string = '';
  isLove: boolean = false;
  isPlay: boolean = true;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isshuoming:boolean=false;
  isposter:boolean=true;
  love_number: number = 0;
  i: any;
  value: number = 0;
  is_share: any;
  friend_id: any;
  is_like: any;
  username: any;
  videonames: any;
  videoname: any;
  isplay:any;
  baseUrl: any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
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


    // 判断该链接为分享出去链接
    if (this.is_share === 'siiva') {
         window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0c9caded7e8fc8d&redirect_uri=https%3a%2f%2fbt.siiva.com%2fwechat%2fis_user&response_type=code&scope=snsapi_base&state='+this.id+','+this.videonames+','+this.username+',0,'+'0012&connect_redirect=1#wechat_redirect'
    }
    if(this.isplay==='no'){
      this.router.navigate(['fail']);
    }else{
      if (this.videonames === 'undefined') {
        this.router.navigate(['waiting']);
      } 
    }
    console.log(this.videonames)
    console.log(this.username)

    if (this.love_number === undefined) {
      this.love_number = 0;
    }

    this.video_url = 'https://siiva.cn-sh2.ufileos.com/ucloud/'+this.videonames+'.mp4';
    // this.video_url = 'http://siiva.ufile.ucloud.com.cn/ucloud/'+this.videonames+'.mp4';
    console.log(this.video_url);

    // 判断该friend_id是否已经点赞
    if (this.is_like == 1) {
      this.isLove = true;
    }

   // 统计视频页访问量
   if(this.is_share!=='siiva' && this.isplay!=='no' && this.videonames!=='undefined'){
    const body1 = {
      'siteId': '0012',
      'mode':'point'
    };
    this.http
      .post(`${environment.apiServer}datareport/point_page`, body1)
      .subscribe(data => {
        console.log(data)
      });
  }



    // 禁用右键下载功能
    $('#video').bind('contextmenu', function () { return false; });





  }



  // 点赞功能
  Love() {
    this.isLove = true;
    this.love_number++;
    if (this.friend_id === undefined) {
      this.friend_id = this.id;
    }
    const body = {
      'siteId': '0012',
       'mode':'like'
    };
    // console.log(body);
    this.http
      .post(`${environment.apiServer}datareport/point_page`, body)
      .subscribe(data => {
        console.log(data)
      });

      const body5 = {
        'open_id': this.id,
         'friend_id':this.friend_id,
         'siteId':'0012'
      };
      // console.log(body);
      this.http
        .post(`${environment.apiServer}wechat/get_like`, body5)
        .subscribe(data => {
          console.log(data)
        });
  }
  // 统计视频播放量
  count_play_number(){
  /*统计接口方法*/ 
  const body2 = {
    'siteId': '0012',
     'mode':'play'
  };
  this.http
    .post(`${environment.apiServer}datareport/point_page`, body2)
    .subscribe(data => {
      console.log(data)
    });
    this.isPlay_number=false;
    this.isposter=false;
    var myVideo = document.getElementsByTagName('video')[0];
    if (myVideo.paused) {
      myVideo.play();
      this.isPlay = false;
    } else {
      myVideo.pause();
      this.isPlay = true;
    }
  }
  // 控制video播放与暂停
  playPause() {

    var myVideo = document.getElementsByTagName('video')[0];
    if (myVideo.paused) {
      myVideo.play();
      this.isPlay = false;
    } else {
      myVideo.pause();
      this.isPlay = true;
    }
  }
  // 分享提示
  share() {
    this.isShare = true;
    this.isShareimg = true;
    this.isPlay = false;
    const body3 = {
      'siteId': '0012',
       'mode':'share'
    };
    // console.log(body);
    this.http
      .post(`${environment.apiServer}datareport/point_page`, body3)
      .subscribe(data => {
        console.log(data)
      });
  }
  // 取消分享提示
  cancelShare() {
    this.isShare = false;
    this.isShareimg = false;
  }
  cancelshuoming(){
    this.isshuoming=false;
  }

  download() {
    var ua = navigator.userAgent.toLowerCase();
    var u = navigator.userAgent;
    var is_weixin=ua.indexOf('micromessenger') != -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    // this.router.navigate(['/download']);
    if(is_weixin){
      if(isiOS){
        alert('该ios系统暂不支持下载，请前往安卓系统或电脑端下载')
      }else{
        this.isshuoming=true;
      }
    }else{
    const headers = new HttpHeaders({ 'Content-Type': 'video/mp4' });
    return this.http.get(
      'https://siiva.cn-sh2.ufileos.com/ucloud/'+this.videonames+'.mp4',
      // 'https://bt.siiva.com/wechatTXT/'+this.videonames+'.mp4',
      {
        headers: headers,
        responseType: 'blob' //這邊要選 `blob`
      }).toPromise().then((response) => {
        saveAs(response, this.videonames+ '.mp4');
        const body6 = {
          'siteId': '0012',
           'mode':'download'
        };
        // console.log(body);
        this.http
          .post(`${environment.apiServer}datareport/point_page`, body6)
          .subscribe(data => {
            console.log(data)
          });
      }).catch(e => {
        console.log('error=' + e);
      });
      
  }
}

}