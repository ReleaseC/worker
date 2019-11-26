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
  video_url:string='';
  timestamp:any;
  signature:any;
  flag:any;
  isbar1:boolean=false;
  isbar2:boolean=false;
  isbar3:boolean=false;
  isbar4:boolean=false;
  videonames:any;
  videoname:any;
  username:any;
  share:any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params['id'];
      this.videonames = params['videonames'];
      this.username = params['name'];
      // this.share = params['share'];
      console.log(this.id);
      console.log(this.videonames+'?????????????????????????????')
    });
    //  if(this.share==1){
    //    console.log('统计成功>>>>>>>>>>>>>>>>>>')
    //  const body5 = {
    //               'siteId': '0007',
    //                'mode':'share'
    //             };
    //             this.http
    //               .post(`${environment.apiServer}datareport/point_page`, body5)
    //               .subscribe(data => {
    //                 console.log(data)
    //               });
    //  }
            


    var url=window.location.href.split("#")[0];
    console.log(url)
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0007'} })
    .subscribe(data => {
      var user_id = this.id;
      var videonames=this.videonames;
      var username=this.username;
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
            title: '2018武胜乡村马拉松"时光子弹"', // 分享标题
            link:"https://bt.siiva.com/0007/#/result?id="+user_id+'&videonames='+videonames+'&name='+username+'&is_share=siiva',
            imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0007.png", // 分享图标
            success:function(){
                // 用户确认分享后执行的回调函数
                // alert('分享成功');
                // window.location.href="https://bt.siiva.com/0007/#/result?id="+user_id+'&videonames='+videonames+'&name='+username+'&share=1'
                // const body5 = {
                //   'siteId': '0007',
                //    'mode':'share'
                // };
                // var self=this;
                // self.http
                //   .post(`${environment.apiServer}datareport/point_page`, body5)
                //   .subscribe(data => {
                //     console.log(data)
                //   });
            
            },
            cancel:function(){
                // 用户取消分享后执行的回调函数
            }
        });
        console.log(this.id+'<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        console.log(data)
        wx.onMenuShareAppMessage({
          title: '2018武胜乡村马拉松"时光子弹"', // 分享标题
          desc: '快来看看我的武胜乡村马拉松"时光子弹"视频，为我点赞哦', // 分享描述
          link: "https://bt.siiva.com/0007/#/result?id="+user_id+'&videonames='+videonames+'&name='+username+'&is_share=siiva', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: "http://siiva.ufile.ucloud.com.cn/wechat_0007.png", // 分享图标
          type: 'video', // 分享类型,music、video或link，不填默认为link
          dataUrl: 'http://siiva.cn-sh2.ufileos.com/ucloud/'+videonames+'.mp4', // 如果type是music或video，则要提供数据链接，默认为空
          success: function () {
          // 用户确认分享后执行的回调函数
            //  alert('分享成功')
            console.log('分享成功////////////')
            // const body6 = {
            //   'siteId': '0007',
            //    'mode':'share'
            // };
            // // console.log(body);
            // var self=this;
            // self.http
            //   .post(`${environment.apiServer}datareport/point_page`, body6)
            //   .subscribe(data => {
            //     console.log(data)
            //   });
          },
          cancel: function () {
          // 用户取消分享后执行的回调函数
          }
          });
      });
    });
  }


  
}