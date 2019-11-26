import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { environment } from '../environments/environment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,private router: Router,private http: HttpClient) {}
  id:''; 
  video_url:string='';
  timestamp:any;
  signature:any;
  flag:any;
  videonames:any;
  videoname:any;
  username:any;
  share:any;
  page_url:any;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params['id'];
      this.videonames = params['videonames'];
      this.username = params['name'];
      // this.share = params['share'];
      console.log(this.id);
      console.log(this.videonames+'?????????????????????????????')
    });
    this.page_url=window.location.href;
            


    var url=window.location.href.split("#")[0];
    console.log(url)
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0013'} })
    .subscribe(data => {
      var user_id = this.id;
      var videonames=this.videonames;
      var username=this.username;
      var share_url=this.page_url;
      this.timestamp=data['result']['time'];
      this.signature=data['result']['signature'];
      console.log(this.timestamp);
      console.log(this.signature);
      wx.config({
        debug: false, 
        appId:"wxb0c9caded7e8fc8d" ,    //之炜新生活appid
        timestamp: this.timestamp, 
        nonceStr: 'siiva123456', 
        signature: this.signature,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','chooseWXPay'], // 功能列表，我们要使用JS-SDK的什么功能
        success:function(res){
            console.log('config success');
        },
        fail:function(res){
            console.log('config fail');
        }
    });

    
      wx.ready(function(){
        console.log('wx.ready');
        //console.log(this.id+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        wx.onMenuShareTimeline({
            title: '世界港口小镇', // 分享标题
            link:share_url+'&is_share=siiva',
            imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0013.png", // 分享图标
            success:function(){
                // 用户确认分享后执行的回调函数
            
            },
            cancel:function(){
                // 用户取消分享后执行的回调函数
            }
        });
        console.log(this.id+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log(data)
        wx.onMenuShareAppMessage({
          title: '世界港口小镇', // 分享标题
          desc: '快来看看我的"时光子弹"视频，为我点赞哦', // 分享描述
          link: share_url+'&is_share=siiva', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0013.png", // 分享图标
          type: 'video', // 分享类型,music、video或link，不填默认为link
          dataUrl: 'http://siiva.cn-sh2.ufileos.com/ucloud/'+videonames+'.mp4', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          // 用户确认分享后执行的回调函数
          },
          cancel: function () {
          // 用户取消分享后执行的回调函数
          }
          });
      });
    });
  }


  
}
