import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  ret:string[] = [];
  ret1:string[] = [];
  curr: number = 0;
  video_url:any;
  server = environment.apiServer;
  tasklist: any;
  taskheader: any;
  time: string;
  site: any;
  msg: string;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

 ngOnInit() {
  var self=this;
  self.ret=['http://siiva.cn-sh2.ufileos.com/ucloud/0012_oaRK30SWIl21_dRISCeU5mN2bJ7I_510d4d60657711e896f2592b06d4a949.mp4',
            'http://siiva.cn-sh2.ufileos.com/ucloud/0012_oaRK30SWIl21_dRISCeU5mN2bJ7I_510d4d60657711e896f2592b06d4a949.mp4',
             'http://siiva.cn-sh2.ufileos.com/ucloud/0012_oaRK30SWIl21_dRISCeU5mN2bJ7I_510d4d60657711e896f2592b06d4a949.mp4',
             'http://siiva.cn-sh2.ufileos.com/ucloud/0012_oaRK30SWIl21_dRISCeU5mN2bJ7I_510d4d60657711e896f2592b06d4a949.mp4',
             'http://siiva.cn-sh2.ufileos.com/ucloud/0012_oaRK30SWIl21_dRISCeU5mN2bJ7I_510d4d60657711e896f2592b06d4a949.mp4']
  var t=setTimeout(function(){
    self.msg = '';
    self.time = typeof self.time !== 'undefined' ? self.time.replace(/\-0/g, '-') : new Date().toLocaleDateString().replace(/\//g, '-');
    self.site = typeof self.site !== 'undefined' ? self.site : '0013';
    console.log(self.time)
    self.http
    .get(environment.apiServer+'task/task_list_get/?time='+self.time+'&siteId='+self.site)
    .subscribe(data => {
      console.log(data);
      const r1=JSON.parse(JSON.stringify(data));
      // console.log(r1.length)
      // console.log(r1[0].state)
      // self.ret.splice(0,self.ret.length);
      for (let i = 0; i<r1.length; i++) {
        if(r1[i].state==='complete'){
          // self.ret[i] = "https://siiva.cn-sh2.ufileos.com/ucloud/" + r1[i].task.output.name;
          self.ret.push("https://siiva.cn-sh2.ufileos.com/ucloud/" + r1[i].task.output.name);
        }
      }
      self.ret.reverse();
      console.log(self.ret)
      self.video_url=self.ret[0];
      // console.log(self.video_url)
      var myVideo = document.getElementsByTagName('video')[0]; 
      myVideo.addEventListener('ended', function(){
        var myVideo = document.getElementsByTagName('video')[0];
          self.curr++;
          console.log(self.curr)
          if (self.curr >= 4){
              self.curr = 0; // 播放完了，重新播放
          }
          self.video_url = self.ret[self.curr];
          myVideo.load(); //如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
          myVideo.play();
      });  
    }) 
  },180000)
  // console.log(self.ret)
  self.ret.reverse();
  self.video_url=self.ret[0];
  var myVideo = document.getElementsByTagName('video')[0]; 
  myVideo.addEventListener('ended', function(){
    var myVideo = document.getElementsByTagName('video')[0];
      self.curr++;
      console.log(self.curr)
      if (self.curr >= 4){
          self.curr = 0; // 播放完了，重新播放
      }
      self.video_url = self.ret[self.curr];
      myVideo.load(); //如果短的话，可以加载完成之后再播放，监听 canplaythrough 事件即可
      myVideo.play();
  });  
  }

}
