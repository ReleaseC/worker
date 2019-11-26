import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-HK_result',
  templateUrl: './HK_result.component.html',
  styleUrls: ['./HK_result.component.css'],
})
@Injectable()
export class HK_ResultComponent implements OnInit {
  HK_id: '';
  taskId: string = '';
  videourl: string = '';
  isPlay: boolean = true;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isClick: boolean = false;
  isResult: boolean = true;
  isShow: boolean = true;
  ismengban: boolean = true;
  isText:boolean=true;
  i: any;
  value: number = 0;
  is_share: any;
  isplay: any;
  baseUrl: any;
  number: any;
  img_url:any;
  activity_id:any;
  createdAt:any;
  activityName:any;
  author:string='当当老师';
  isshowInfo:boolean=false;
  isshowTaskDelInfo:boolean=false;
  isPay:string='';
  isDemo:string='';
  isFree:boolean=false;
  isshowdownload:boolean=true
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,private shareService: ShareService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.HK_id=params['id']
       this.taskId=params['taskId'];
       this.activity_id=params['activity_id'];
       this.isPay=params['isPay'];
       this.isDemo=params['isDemo'];
       this.is_share=params['is_share'];
       localStorage.setItem('HK_id',this.HK_id)
    });
    // if(this.HK_id!=null){
    //   // console.log('已经有了')
    //   localStorage.setItem('HK_id',this.HK_id)
    // }else{
    //    // 微信静默授权获取用来支付的openid
    //     //  window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx71f94faa986aa53b&redirect_uri=https%3a%2f%2fiva.siiva.com%2fwechat%2fget_payid&response_type=code&scope=snsapi_base&state=0014,'+this.id+','+this.taskId+','+this.activity_id+','+this.isPay+'&connect_redirect=1#wechat_redirect';
    // }
      this.videourl='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.mp4';
      this.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.jpg';

      if(this.isDemo=='true'){   //案例视频进入
         this.isshowdownload=false;
      }else{
        this.isFree = this.isPay=='true'?true:false;
      }

    // 调用微信SDK实现分享和支付
     this.shareService.onWechatSharePay(window.location.href,this.taskId,'1541382417');
  }



  // 统计视频播放量
  count_play_number() {
    this.isText=false;
    const task_play_count = {
      'taskId': this.taskId,
      'mode': 'play'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_play_count)
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


  payTodownload() {
    this.isshowTaskDelInfo=true;
    // window.location.href='https://ui.siiva.com/SiivaPage/#/download?taskId='+this.taskId;
  }
  freeTodownload(){
    window.location.href='https://ui.siiva.com/SiivaPage/#/HK_download?taskId='+this.taskId+'&activity_id='+this.activity_id;
  }


    goback_home(){
      if(this.activity_id=='1541382418'){
        this.router.navigate(['/Local_homepage'],{queryParams:{'id':this.HK_id,'activity_id':this.activity_id}});
      }else{
        this.router.navigate(['/HK_homepage'],{queryParams:{'id':this.HK_id,'activity_id':this.activity_id}});
      } 
    }

    show_info(){
    //  获取该只视频属性
    this.http
    .get(`${environment.apiServer}task/task_info`,{ params: { 'taskId': this.taskId} })
    .subscribe(data => {
      this.activityName=data['activity_name'];
      this.createdAt=data['createdAt'];
    });
      if(this.isshowInfo){
        this.isshowInfo=false;
      }else{
        this.isshowInfo=true;
      }
    }
    cancel_showinfo(){
      this.isshowInfo=false;
    }

  //  //删除该只视频(管理员权限)
  //   task_del(){
  //     this.isshowTaskDelInfo=true;
  //   }

    // 取消支付提醒
    pay_cancel(){
      this.isshowTaskDelInfo=false;
    }
    // 确认支付
    pay_confirm(){
      let that=this;
      const body = {
        'openid':that.HK_id,
        'total_fee':0.01,
        'templates':'',
        'siteId':'0014',
        'taskId':that.taskId,
        'uid':that.HK_id,
        'seller':'智能云影像'
        };
        console.log(body);
        that.http
        .post(`${environment.apiServer}wechat_payment/create_wechatpay`, body)
        .subscribe(data => {
        console.log(data) 
        console.log(data['code'])
        console.log(data['result'])
        let that=this;
        wx.chooseWXPay({
          timestamp: data['result'].timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data['result'].nonceStr, // 支付签名随机串，不长于 32 位
          package: data['result'].package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data['result'].paySign, // 支付签名
          success: function (res) {
          // 支付成功后的回调函数
                const body_order = {
                       'openid':that.HK_id,
                       'orderid':data['result'].orderid
                 }
           that.http
           .post(`${environment.apiServer}wechat_payment/update_pay_state`, body_order)
           .subscribe(data => {
               console.log(data)
               if(data['code']==0){
                   window.location.href='https://ui.siiva.com/SiivaPage/#/HK_download?taskId='+that.taskId+'&activity_id='+that.activity_id;
               }
           })
           }
         });
       })
    }



    // // 确认删除
    // task_del_confirm(){
    //   this.http
    //   .get(`${environment.apiServer}task/del`,{ params: { 'taskId': this.taskId} })
    //   .subscribe(data => {
    //     console.log(data)
    //     if(data['code']==0){
    //       this.router.navigate(['/homepage'],{queryParams:{activity_id:this.activity_id,getScrollTop:2}})
    //     }else{
    //       alert('删除失败')
    //     }
    //   });
    // }


}