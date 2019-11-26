import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css'],
})
export class PayComponent implements OnInit {
  HK_id: '';
  taskId:'';
  img_url:any;
  video_ID:any;
  activity_id:string='';
  total_fee:number=0.01;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,private shareService: ShareService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.HK_id=params['id'];
      this.taskId=params['taskId'];
      this.activity_id=params['activity_id'];
      if(this.HK_id==undefined){
        // 微信静默授权获取用来支付的openid
       window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx71f94faa986aa53b&redirect_uri=https%3a%2f%2fiva.siiva.com%2fwechat%2fget_payid&response_type=code&scope=snsapi_base&state=0014,pay,'+this.taskId+','+this.activity_id+'&connect_redirect=1#wechat_redirect';
     }else{
      if(this.taskId.indexOf("_")==-1){     //兼容环游世界小汽车
        this.video_ID=this.taskId.substring(this.taskId.length-6);
      }else{
        this.video_ID=this.taskId.split('_')[1].substring(this.taskId.split('_')[1].length-6);
      }
        this.img_url="https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_"+this.taskId+".jpg";
        this.shareService.onWechatSharePay(window.location.href,this.taskId,'1541382417');
        var self=this;
        setTimeout(()=>{
          self.shareService.scan_task(self.HK_id,self.taskId)
        },1000)
   }
   switch(this.activity_id)
   {
     case "1541732870qz":
       this.total_fee=0.01;  //环游世界小汽车单价
       break;
     case "1541382418":
       this.total_fee=0.01; //凯蒂猫之家单价
       break;
     default:
       this.total_fee=0.01;
   }
    });
  }





    // 确认支付
    pay_confirm(){
      let that=this;
      // that.click(event);
      const body = {
        'openid':that.HK_id,
        'total_fee':that.total_fee,
        'templates':'',
        'siteId':'0014',
        'taskId':that.taskId,
        'uid':that.HK_id,
        'seller':'智能云影像',
        'activity_id':that.activity_id
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
           window.location.href='https://ui.siiva.com/SiivaPage/#/scancode';
           }
         });
       })
    }
    click(e){
      e.style.opacity=0.5;
      setTimeout(()=>{
        e.style.opacity=1;
      },100)
    }






}
