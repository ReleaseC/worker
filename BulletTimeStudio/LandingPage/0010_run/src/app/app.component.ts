import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
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
  timestamp:any;
  signature:any;
  game_id:'';
  uname:'';
  time:'';
  share_url:any;
    ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.game_id =  params['id'];
      this.uname =  params['userName'];
      this.time =  params['time'];
      console.log(this.game_id);
      console.log(this.uname);
      console.log(this.time);
    });
    var page_url=window.location.href;
    var url=window.location.href.split("#")[0];
    var url1=window.location.href.split("?")[0];
    console.log(page_url)
    console.log(url)
    console.log(url1)
    if(url1=='https://bt.siiva.com/0010/#/result'){
      this.share_url=page_url+'&is_share=siiva';
    }else{
      this.share_url=url1;
    }
  console.log(url)
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url': url,'siteId':'0010'} })
    .subscribe(data => {
      var user_id = this.id;
      var uname=this.uname;
      var time=this.time;
      var share_page_url=this.share_url;
      this.timestamp=data['result']['time'];
      this.signature=data['result']['signature'];
      console.log(this.timestamp);
      console.log(this.signature);
      wx.config({
        debug: false, 
        appId: "wxb0c9caded7e8fc8d",  
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
            title: '2018大连国际马拉松赛终点10秒', // 分享标题
            link:share_page_url,
            imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0010.png", // 分享图标
            success:function(){
                // 用户确认分享后执行的回调函数
                // alert('分享成功');    
            },
            cancel:function(){
                // 用户取消分享后执行的回调函数
            }
        });
        console.log(this.id+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log(data)
        wx.onMenuShareAppMessage({
          title: '2018大连国际马拉松赛终点10秒', // 分享标题
          desc: '快来看看我的大连国际马拉松终点10秒视频，为我加油吧~', // 分享描述
          link: share_page_url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0010.png", // 分享图标
          type: 'video', // 分享类型,music、video或link，不填默认为link
          dataUrl: 'https://siiva.cn-sh2.ufileos.com/0010_'+user_id+'.mp4', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          // 用户确认分享后执行的回调函数
            //  alert('分享成功')
          },
          cancel: function () {
          // 用户取消分享后执行的回调函数
          }
          });
      });
    });
  }

}








