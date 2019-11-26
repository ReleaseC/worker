import { Component, OnInit, ViewChild, ElementRef, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
// import { Socket } from 'ng-socket-io';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { setTimeout } from 'core-js/library/web/timers';
// import { saveAs } from 'file-saver/FileSaver';

// import * as $ from 'jquery';
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
@Injectable()
export class ResultComponent implements OnInit {
  id: '';
  taskId: string = '';
  videourl: string = '';
  isLove: boolean = false;
  isnoLove:boolean=true;
  isPlay: boolean = true;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isClick: boolean = false;
  isResult: boolean = true;
  isShow: boolean = true;
  isPay: boolean = false;
  ismengban: boolean = true;
  isText:boolean=true;
  love_number: number = 0;
  i: any;
  value: number = 0;
  is_share: any;
  isplay: any;
  baseUrl: any;
  number: any;

  img_url:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
       this.taskId=params['taskId'];
    
    });
    this.videourl='http://siiva.cn-sh2.ufileos.com/soccer_'+this.taskId+'.mp4';
   this.img_url='http://siiva.ufile.ucloud.com.cn/soccer_'+this.taskId+'.jpg';


    this.http
      .get(`${environment.apiServer}datareport/get_statistics`,{ params: { 'taskId': this.taskId} })
      .subscribe(data => {
        console.log(data)
        if(data['code']==0&&data['result'].length!=0){
        this.love_number=data['result'][0]['like'];
        }
      });
  




  }


  Love() {
    this.isLove = true;
    this.isnoLove=false;
    this.love_number++;
    const task_like_count = {
      'taskId': this.taskId,
      'mode': 'like'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_like_count)
      .subscribe(data => {
        console.log(data)
      });


    // 统计点赞量
    const body = {
      'templateId':'template_1',
      'siteId': '0015',
      'mode': 'like'
    };
    // console.log(body);
    this.http
      .post(`${environment.apiServer}datareport/statistics`, body)
      .subscribe(data => {
        console.log(data)
      });
  }
  // 统计视频播放量
  count_play_number() {
    this.isText=false;
    const body2 = {
      'templateId':'template_1',
      'siteId': '0015',
      'mode': 'play'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, body2)
      .subscribe(data => {
        console.log(data)
      });
    this.isShow = false;
    this.isPlay_number = false;
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
    this.isShow = false;
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
  }
  // 取消分享提示
  cancelShare() {
    this.isShare = false;
    this.isShareimg = false;
  }
  // 判断微信浏览器
  is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') != -1) {
      return true;
    } else {
      return false;
    }
  }

  download() {
    // window.open(this.videourl);
    this.router.navigate(['/download'],{ queryParams: { taskId: this.taskId}})
  }


}