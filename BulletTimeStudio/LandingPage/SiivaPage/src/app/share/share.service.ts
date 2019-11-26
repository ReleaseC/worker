import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import{LoggerService}from '../share/logger.service';
@Injectable()
export class ShareService {
  timestamp:any;
  signature:any;
  activityName:any;
  description:any;
  share_img:any;
    constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,private loggerService:LoggerService) { 
    }

// 微信分享朋友圈和好友
onWechatShare(data_url,taskId,activity_id){
  if(taskId==null){
    //分享活动页
    var share_url=data_url.split('?')[0]+'?activity_id='+activity_id;
    // taskId=activity_id;
  }else{
    //分享视频页
    var share_url=data_url.split('?')[0]+'?taskId='+taskId+'&activity_id='+activity_id
  }
  // 获取该活动的title和desc
  this.http
  .get(`${environment.downloadServer}activity_simple`,{ params: { 'activity_id': activity_id} })
  .subscribe(data => {
    this.activityName=data['activity_name'];
    this.description=data['mark'];
    if(data['banner']==''){
      this.share_img='http://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/logo.png';
    }else{
      this.share_img=data['banner'];
    }
    var url=data_url.split("#")[0];
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'SiivaPage'} })
    .subscribe(data => {
    this.timestamp=data['result']['time'];
    this.signature=data['result']['signature'];
    var title=this.activityName;
    var desc=this.description;
    var share_img_url=this.share_img;
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
    let that=this;
    wx.ready(function(){
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: share_url+'&is_share=siiva', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share_img_url, // 分享图标
        type: 'video', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        // 用户确认分享后执行的回调函数
          // 统计分享量
        // const body_share_AppMessage = {
        //   'taskId': taskId,
        //   'mode': 'share'
        // };
        const body_share_AppMessage = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }
        that.http
          .post(`${environment.apiServer}datareport/statistics`, body_share_AppMessage)
          .subscribe(data => {
            that.loggerService.log(data);
          });
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
        });
    });

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link:share_url+'&is_share=siiva',
      imgUrl: share_img_url, // 分享图标
      success:function(){
          // 用户确认分享后执行的回调函数
          // 统计分享量
          // const body_share_Timeline = {
          //   'taskId': taskId,
          //   'mode': 'share'
          // };
          const body_share_Timeline = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }
          that.http
            .post(`${environment.apiServer}datareport/statistics`, body_share_Timeline)
            .subscribe(data => {
              that.loggerService.log(data);
            });      
      },
      cancel:function(){
          // 用户取消分享后执行的回调函数
      }
    });
  });
});
}



// 微信分享朋友圈和好友先获取SDK签名等咨询
 onWechatGetSDK(data_url,taskId,activity_id){
    var url=data_url.split("#")[0];
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'SiivaPage'} })
    .subscribe(data => {
    this.timestamp=data['result']['time'];
    this.signature=data['result']['signature'];
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
  });
}

// 微信分享朋友圈和好友
onMenuShare(data_url,taskId,activity_id){
  if(taskId==null){
    //分享活动页
    var share_url=data_url.split('?')[0]+'?activity_id='+activity_id
  }else{
    //分享视频页
    if(activity_id=='1545000008gx'||'1545000008ll'||'1545000008mm'||'1545000008nn'){  //小小运动馆分享单个视频
      var share_url='https://ui.siiva.com/SiivaPage/#/Single_result?taskId='+taskId+'&activity_id='+activity_id;
    }else{
      var share_url=data_url.split('?')[0]+'?taskId='+taskId+'&activity_id='+activity_id
    }
  }
  // 获取该活动的title和desc
 this.http
 .get(`${environment.downloadServer}activity_simple`,{ params: { 'activity_id': activity_id} })
 .subscribe(data => {
   this.activityName=data['activity_name'];
   this.description=data['mark'];
   if(data['banner']==''){
     this.share_img='http://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/logo.png';
   }else{
     this.share_img=data['banner'];
   }
    let that=this;
    var title=this.activityName;
    var desc=this.description;
    var share_img_url=this.share_img;
 
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: share_url+'&is_share=siiva', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share_img_url, // 分享图标
        type: 'video', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        // 用户确认分享后执行的回调函数
          // 统计分享量
        const body_share_AppMessage = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }
        that.http
          .post(`${environment.apiServer}datareport/statistics`, body_share_AppMessage)
          .subscribe(data => {
            that.loggerService.log(data);
          });
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
    });
   

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link:share_url+'&is_share=siiva',
      imgUrl: share_img_url, // 分享图标
      success:function(){
          // 用户确认分享后执行的回调函数
          // 统计分享量    
          const body_share_Timeline = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }
          that.http
            .post(`${environment.apiServer}datareport/statistics`, body_share_Timeline)
            .subscribe(data => {
              that.loggerService.log(data);
            });      
      },
      cancel:function(){
          // 用户取消分享后执行的回调函数
      }
    });
});
}



onWechatSharePay(data_url,taskId,activity_id){
  // 获取该活动的title和desc
  this.http
  .get(`${environment.downloadServer}activity_simple`,{ params: { 'activity_id': activity_id} })
  .subscribe(data => {
    this.activityName=data['activity_name'];
    this.description=data['mark'];
    if(data['banner']==''){
      this.share_img='http://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/logo.png';
    }else{
      this.share_img=data['banner'];
    }
    var url=data_url.split("#")[0];
    this.http
    .get(environment.apiServer+'wechat/get_jsapi_ticket', { params: { 'url':url,'siteId':'0014'} })
    .subscribe(data => {
    this.timestamp=data['result']['time'];
    this.signature=data['result']['signature'];
    var title=this.activityName;
    var desc=this.description;
    var share_img_url=this.share_img;
    wx.config({
    debug: false, 
    appId:"wx71f94faa986aa53b" ,    //智能云影像appid
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
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: data_url+'&is_share=siiva', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: share_img_url, // 分享图标
        type: 'video', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
        // 用户确认分享后执行的回调函数
          // 统计分享量   
        const body_share_AppMessage = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }    
        that.http
          .post(`${environment.apiServer}datareport/statistics`, body_share_AppMessage)
          .subscribe(data => {
            that.loggerService.log(data);
          });
        },
        cancel: function () {
        // 用户取消分享后执行的回调函数
        }
        });
    });

    wx.onMenuShareTimeline({
      title: title, // 分享标题
      link:data_url+'&is_share=siiva',
      imgUrl: share_img_url, // 分享图标
      success:function(){
          // 用户确认分享后执行的回调函数
          // 统计分享量
          const body_share_Timeline = taskId==null?{'activity_id': activity_id,'mode': 'share' }:{'taskId': taskId,'mode': 'share' }
          that.http
            .post(`${environment.apiServer}datareport/statistics`, body_share_Timeline)
            .subscribe(data => {
              that.loggerService.log(data);
            });      
      },
      cancel:function(){
          // 用户取消分享后执行的回调函数
      }
    });
  });
});
}



// 统计单个活动的ip总人数
count_activity_ip_number(activityId,openid){
  var self=this;
  self.loggerService.log(activityId);
  self.loggerService.log(openid);
  self.http
  .get(`${environment.apiServer}activity/visit`,{ params: { 'activity_id': activityId,'openid':openid} })
  .subscribe(data => {
    self.loggerService.log(data);
  })
}

scan_task(openid,taskId){
  var self=this;
  self.http
  .get(`${environment.downloadServer}activity/scan_task`,{ params: { 'openid':openid,'taskId':taskId} })
  .subscribe(data => {
    self.loggerService.log(data);
  });
}




}
