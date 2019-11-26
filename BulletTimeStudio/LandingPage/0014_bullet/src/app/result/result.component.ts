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
  animations: [
    trigger('signal', [
      state('go', style({
        transform: 'translateX(0px)'
      })),
      state('stop', style({
        transform: 'translateX(10px)'
      })),
      transition('*=>*', animate('1000ms ease-out'))
    ])
  ]
})
@Injectable()
export class ResultComponent implements OnInit {
  id: '';
  video_url: string = '';
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
  love_number: number = 0;
  i: any;
  value: number = 0;
  is_share: any;
  friend_id: any;
  is_like: any;
  username: any;
  videonames: any;
  videoname: any;
  isplay: any;
  baseUrl: any;
  signal: string = 'stop';
  number: any;
  Ticket:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.is_share = params['is_share'];
      this.friend_id = params['friend_id'];
      this.is_like = params['is_like'];
      // this.love_number = params['number'];
      this.id = params['id'];
      this.username = params['name'];
      this.videonames = params['videonames'];
      this.isplay = params['is_play'];
      this.Ticket=params['isTicket'];
      // this.number = params['videonumber'];
      console.log(this.videonames);
      console.log(this.id);
      console.log(this.is_share);
      console.log(this.friend_id);
      console.log(this.is_like);
      // console.log(this.love_number);
      console.log(this.username);
      console.log(typeof this.Ticket);
    });

    // if(this.Ticket==='true'){
    //   const body_order = {
    //     'siteId': '0014',
    //     'openId': this.id,
    //     'taskId':this.videonames.split('_')[this.videonames.split('_').length - 1]
    //   };
    //   this.http
    //     .post(`${environment.apiServer}wechat_payment/create_ticket_order`, body_order)
    //     .subscribe(data => {
    //       console.log(data)
    //     });
    // }

    // 判断该链接为分享出去链接
    if (this.is_share === 'siiva') {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx71f94faa986aa53b&redirect_uri=https%3a%2f%2fbt.siiva.com%2fwechat%2fis_user&response_type=code&scope=snsapi_base&state=' + this.id + ',' + this.videonames + ',' + this.username + ',0,' + '0014&connect_redirect=1#wechat_redirect';
    }
    if (this.isplay === 'no') {
      this.router.navigate(['fail']);
    } else {
      // if (this.videonames === 'undefined'||(this.number%6)==1||(this.number%6)==2||(this.number%6)==3||(this.number%6)==4||(this.number%6)==5) {
      if (this.videonames === 'undefined') {
        this.router.navigate(['waiting']);
      }
    }


    if (this.videonames !== 'undefined') {
      this.video_url = 'https://siiva.cn-sh2.ufileos.com/ucloud/0012_1_0014_' + this.id + '_' + this.videonames.split('_')[this.videonames.split('_').length - 1] + '.mp4';
      // this.video_url = 'http://siiva.ufile.ucloud.com.cn/ucloud/'+this.videonames+'.mp4';
      console.log(this.video_url);
    }

    //  获取该只视频的点赞量
    this.http
    .get(`${environment.apiServer}datareport/get_statistics`,{ params: { 'taskId': this.videonames} })
    .subscribe(data => {
      console.log(data)
      if(data['code']==0&&data['result'].length!=0){
      this.love_number=data['result'][0]['like'];
      }
    });

    // // 判断该friend_id是否已经点赞
    // if (this.is_like == 1) {
    //   this.isLove = true;
    // }

    // 统计视频页访问量
    if (this.is_share !== 'siiva' && this.isplay !== 'no' && this.videonames !== 'undefined') {
      const body1 = {
        'templateId':'template_1',
        'siteId': '0014',
        'mode': 'visit'
      };
      this.http
        .post(`${environment.apiServer}datareport/statistics`, body1)
        .subscribe(data => {
          console.log(data)
        });
    }

    // var self = this;
    // var t = setInterval(function () {
    //   self.toggle();
    // }, 1000)

  }

  // isSixMutiple(number){
  //   var isTen=number%6;
  //     if(isTen==0){
  //       return true;
  //     }else{
  //     return false;
  //     }
  //   }

  // 点赞功能
  Love() {
    this.isLove = true;
    this.isnoLove=false;
    this.love_number++;
    if (this.friend_id === undefined) {
      this.friend_id = this.id;
    }
    const task_like_count = {
      'taskId': this.videonames,
      'mode': 'like'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_like_count)
      .subscribe(data => {
        console.log(data)
      });
    // // 统计点赞量
    // const body = {
    //   'templateId':'template_1',
    //   'siteId': '0014',
    //   'mode': 'like'
    // };
    // // console.log(body);
    // this.http
    //   .post(`${environment.apiServer}datareport/statistics`, body)
    //   .subscribe(data => {
    //     console.log(data)
    //   });

    // const body5 = {
    //   'open_id': this.id,
    //   'friend_id': this.friend_id,
    //   'siteId': '0014'
    // };
    // // console.log(body);
    // this.http
    //   .post(`${environment.apiServer}wechat/get_like`, body5)
    //   .subscribe(data => {
    //     console.log(data)
    //   });
  }
  // 统计视频播放量
  count_play_number() {
    const body2 = {
      'templateId':'template_1',
      'siteId': '0014',
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
  // // 判断微信浏览器
  // is_weixn() {
  //   var ua = navigator.userAgent.toLowerCase();
  //   if (ua.indexOf('micromessenger') != -1) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  goback() {
    this.router.navigate(['/templet'], { queryParams: { id: this.id, videonames: this.videonames,Ticket:this.Ticket } });
  }
  // toggle() {
  //   this.signal = this.signal === 'go' ? 'stop' : 'go';
  // }
  download() {
    this.router.navigate(['/download'],{ queryParams: { id: this.id}})
  }


}