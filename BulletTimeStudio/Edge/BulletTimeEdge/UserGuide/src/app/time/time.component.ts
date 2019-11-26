import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { setTimeout } from 'core-js/library/web/timers';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { RequestOptions, Headers } from '@angular/http';
// import { WebCamComponent } from 'ack-angular-webcam';
import { trigger, state, style, animate, transition, keyframes, AnimationEvent } from '@angular/animations';
// import { clearTimeout } from 'timers';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
  animations: [
    trigger('signal', [
      state('go', style({
        // transform: 'translateX(-1000px)'
        transform: 'scale(0.5)'
      })),
      state('stop', style({
        // transform: 'translateX(0px)'
        transform: 'scale(1.5)'
      })),
      transition('*=>*', animate('1000ms ease-out'))      //设置动画时间间隔
    ])
  ]
})

@Injectable()
export class TimeComponent implements OnInit {
  text: '';
  time: any;
  isSelfie: boolean = true;
  public webcam;
  public base64;
  options: any;
  canvas: any;
  id: any;
  nickname: any;
  isMp3: boolean = false;
  signal: string = 'stop';
  t: any;
  t1: any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private socket: Socket, private http: HttpClient
  ) {
    this.options = {
      audio: false,
      video: true,
      width: 720,
      height: 1280,
      cameraType: 'back' || 'font'
    };
  }



  ngOnInit() {
    // this.activatedRoute.queryParams.subscribe(params=>{
    // this.id=params['id'];
    // this.nickname=params['nickname'];
    // console.log(this.id);
    // })
    this.sendMessage('123')
    {
      this.socket.emit("join", { 'id': 'local_page' });

    };

    this.getMessage()
      .subscribe(msg => {
        console.log(msg);
        this.id = msg.data.id;
        this.nickname = msg.data.nickname;
        if (msg !== undefined) {
          // this.router.navigate(['/time'],{queryParams:{id:this.id,nickname:this.nickname}});
          var self = this;
          self.isMp3 = true;
          self.time = 10;
          self.t = setInterval(function () {
            self.toggle();
            self.time--;
            if (self.time == 0) {
              self.sendMessage('12')
              {
                console.log(self.id)
                self.socket.emit("cameraCommand", { 'status': 'countdown', 'userId': self.id, 'nickname': self.nickname });
                // self.socket.emit("cameraCommand", {'status': 'countdown'});
              };
            }
            if (self.time == -1) {
              clearInterval(self.t);
              self.isSelfie = false;
              var t3 = setTimeout(function () {
                self.isMp3 = false;
                self.time = '';
                self.isSelfie = true;
              }, 5000)
            }
          }, 1000)
        }
      })


    this.getMessage1()
      .subscribe(msg => {
        console.log(msg);
        this.id = msg.data.id;
        this.nickname = msg.data.nickname;
        if (msg !== undefined) {
          var self = this;
          self.socket.emit("adjust_photo", { 'siteId': '0013'});
        }
      })

    $(window).on('keypress', function (e) {
      // 绑定enter键与开始拍摄按钮
      if (e.keyCode == 13) {
        // alert('你按了Enter键')
        $('#start').trigger('click');
      }
      // 绑定空白键与停止拍摄按钮
      if (e.keyCode == 32) {
        // alert('你按了空白键')
        $('#stop').trigger('click');
      }
    })


    // var self = this;
    // self.isMp3=true;
    // self.time = 10;
    // // 随机生成uid
    // // self.id=self.rand(1,1000)
    // // console.log(self.id); 
    // // 倒计时
    // //#屏蔽
    // self.t = setInterval(function () {
    //   self.toggle();
    //   self.time--;
    //   if (self.time == 0) {
    //     self.sendMessage('12')
    //     {
    //       console.log(self.id)
    //       self.socket.emit("cameraCommand", {'status': 'countdown','userId':self.id,'nickname':self.nickname});
    //       // self.socket.emit("cameraCommand", {'status': 'countdown'});
    //     };
    //   }
    //   if (self.time == -1) {
    //     clearInterval(self.t);
    //     self.isSelfie = false;
    //   }
    // }, 1000)

    //#
    // 用户跳完后页面跳转至end页面
    //#屏蔽
    // var self=this;
    // self.t1=setTimeout(function () {
    //   self.router.navigate(['/end']);
    // }, 18000)
    //#

    //#打开
    // var t = setInterval(function () {
    //   var id = Math.random().toString().substr(2, 10);
    //       self.socket.emit("cameraCommand", {'status': 'countdown','userId':id});
    //       // self.socket.emit("cameraCommand", {'status': 'countdown'});
    // }, 300000)
    //#




  }

  toggle() {
    this.signal = this.signal === 'go' ? 'stop' : 'go';
  }
  sendMessage(msg: string) {
    console.log(msg);
    this.socket.emit("msg", msg);
  }

  // getMessage() {
  //   return this.socket
  //     .fromEvent<any>("msg")
  //     .map(data => data.msg);
  // }


  getMessage() {
    return this.socket
      .fromEvent<any>("countdown")
      .map(data => data);
  }

  getMessage1() {
    return this.socket
      .fromEvent<any>("adjust_photo")
      .map(data => data);
  }




  rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  pause_play() {
    var self = this;
    console.log('停止拍摄')
    clearInterval(self.t);
    clearTimeout(self.t1);
    self.isMp3 = false;
  }
  start_play() {
    console.log('开始拍摄');
    var self = this;
    self.sendMessage('12')
    {
      console.log(self.id)
      self.socket.emit("cameraCommand", { 'status': 'countdown', 'userId': self.id, 'nickname': self.nickname });
    };
    var t3 = setTimeout(function () {
      self.isMp3 = false;
      self.isSelfie = true;
      self.time = '';
    }, 2000)
  }
}