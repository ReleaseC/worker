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
  taskId:string='';
  timestamp:any;
  signature:any;
  flag:any;
  videonames:any;
  videoname:any;
  username:any;
  share:any;
  page_url:any;
  share_url:any;
  async ngOnInit() {
     this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.taskId=params['taskId'];
      console.log(this.taskId+">>>>>>>>>>>>>>>>>>");
      if(this.taskId==undefined){
        console.log('分享视频列表页')
        this.page_url=window.location.href;
        console.log(this.page_url);
        var url=window.location.href.split("#")[0];
        this.http
        .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0013'} })
        .subscribe(data => {
          var share_url=this.page_url;
          var taskId=this.taskId;
          this.timestamp=data['result']['time'];
          this.signature=data['result']['signature'];
          console.log(this.timestamp);
          console.log(this.signature);
          wx.config({
            debug: false, 
            appId:"wxb0c9caded7e8fc8d" ,    //之炜新生活appid
            // appId:"wx71f94faa986aa53b", 
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
    
        let that=this;
          wx.ready(function(){
            console.log('wx.ready');
            wx.onMenuShareTimeline({
                title: '乐刻炫跑时刻', // 分享标题
                link:share_url,
                imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0016.png", // 分享图标
                success:function(){  
                   // 统计分享量
                const body_share = {
                  'templateId':'template_1',
                  'siteId': '0015',
                  'mode': 'share'
                };
                that.http
                  .post(`${environment.apiServer}datareport/statistics`, body_share)
                  .subscribe(data => {
                    console.log(data)
                  }); 
                },
                cancel:function(){
                    // 用户取消分享后执行的回调函数
                }
            });
            console.log(this.id+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
            console.log(data)
            wx.onMenuShareAppMessage({
              title: '乐刻炫跑马拉松', // 分享标题
              desc: '跑出真我，跑出范儿', // 分享描述
              link: share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0016.png", // 分享图标
              type: 'video', // 分享类型,music、video或link，不填默认为link
              dataUrl: "https://siiva.cn-sh2.ufileos.com/soccer_"+taskId+".mp4", // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                 // 统计分享量
                 const body_share = {
                  'templateId':'template_1',
                  'siteId': '0015',
                  'mode': 'share'
                };
                that.http
                  .post(`${environment.apiServer}datareport/statistics`, body_share)
                  .subscribe(data => {
                    console.log(data)
                  });
              },
              cancel: function () {
              // 用户取消分享后执行的回调函数
              }
              });
          });
        });
      }else{
        console.log('分享视频结果页')
        this.page_url=window.location.href;
        console.log(this.page_url);
        var url=window.location.href.split("#")[0];
        this.http
        .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0013'} })
        .subscribe(data => {
          var share_url=this.page_url;
          var taskId=this.taskId;
          this.timestamp=data['result']['time'];
          this.signature=data['result']['signature'];
          console.log(this.timestamp);
          console.log(this.signature);
          wx.config({
            debug: false, 
            appId:"wxb0c9caded7e8fc8d" ,    //之炜新生活appid
            // appId:"wx71f94faa986aa53b", 
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
    
        let that=this;
          wx.ready(function(){
            console.log('wx.ready');
            //console.log(this.id+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            // let self=this;
            wx.onMenuShareTimeline({
                title: '乐刻炫跑时刻', // 分享标题
                link:share_url,
                imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0016.png", // 分享图标
                success:function(){   
                },
                cancel:function(){
                    // 用户取消分享后执行的回调函数
                }
            });
            console.log(data)
            wx.onMenuShareAppMessage({
              title: '乐刻炫跑马拉松', // 分享标题
              desc: '跑出真我，跑出范儿', // 分享描述
              link: share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0016.png", // 分享图标
              type: 'video', // 分享类型,music、video或link，不填默认为link
              dataUrl: "https://siiva.cn-sh2.ufileos.com/soccer_"+taskId+".mp4", // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
              },
              cancel: function () {
              // 用户取消分享后执行的回调函数
              }
              });
          });
        });
      } 
    });
    // this.page_url=window.location.href;

    // var url=window.location.href.split("#")[0];
    // console.log(this.page_url)
    // this.http
    // .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0013'} })
    // .subscribe(data => {
    //   var share_url=this.page_url;
    //   var taskId=this.taskId;
    //   this.timestamp=data['result']['time'];
    //   this.signature=data['result']['signature'];
    //   console.log(this.timestamp);
    //   console.log(this.signature);
    //   wx.config({
    //     debug: false, 
    //     appId:"wxb0c9caded7e8fc8d" ,    //之炜新生活appid
    //     // appId:"wx71f94faa986aa53b", 
    //     timestamp: this.timestamp, 
    //     nonceStr: 'siiva123456', 
    //     signature: this.signature,
    //     jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','chooseWXPay'], // 功能列表，我们要使用JS-SDK的什么功能
    //     success:function(res){
    //         console.log('config success');
    //     },
    //     fail:function(res){
    //         console.log('config fail');
    //     }
    // });

    // let that=this;
    //   wx.ready(function(){
    //     console.log('wx.ready');
    //     //console.log(this.id+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    //     // let self=this;
    //     wx.onMenuShareTimeline({
    //         title: '乐刻炫跑时刻', // 分享标题
    //         link:share_url,
    //         imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0015.png", // 分享图标
    //         success:function(){   
    //         },
    //         cancel:function(){
    //             // 用户取消分享后执行的回调函数
    //         }
    //     });
    //     console.log(this.id+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    //     console.log(data)
    //     wx.onMenuShareAppMessage({
    //       title: '乐刻炫跑马拉松', // 分享标题
    //       desc: '跑出真我，跑出范儿', // 分享描述
    //       link: share_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //       imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0015.png", // 分享图标
    //       type: 'video', // 分享类型,music、video或link，不填默认为link
    //       dataUrl: "https://siiva.cn-sh2.ufileos.com/soccer_"+taskId+".mp4", // 如果type是music或video，则要提供数据链接，默认为空
    //       success: function () {
    //       },
    //       cancel: function () {
    //       // 用户取消分享后执行的回调函数
    //       }
    //       });
    //   });
    // });

  }
  
}
