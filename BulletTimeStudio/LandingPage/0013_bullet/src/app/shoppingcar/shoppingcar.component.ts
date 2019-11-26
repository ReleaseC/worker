import { Component, OnInit, ViewChild, ElementRef, trigger,state,style,transition,animate,keyframes} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-shoppingcar',
  templateUrl: './shoppingcar.component.html',
  styleUrls: ['./shoppingcar.component.css']
  // animations:[
  //   trigger('signal',[
  //     state('go',style({
  //       transform:'translateX(0px)'
  //     })),
  //     state('stop',style({
  //       transform:'translateX(10px)'
  //     })),
  //     transition('*=>*',animate('1000ms ease-out'))
  //   ])
  // ]
})
export class ShoppingcarComponent implements OnInit {
    templets:string[] = [];
    istemplet1:boolean=false;
    istemplet2:boolean=false;
    istemplet3:boolean=false;
    istemplet4:boolean=false;
    istemplet5:boolean=false;
    istemplet6:boolean=false;
    templet1_price:number=0;
    templet2_price:number=0;
    templet3_price:number=0;
    templet4_price:number=0;
    templet5_price:number=0;
    templet6_price:number=0;
    templet_price_sum:number=0;
    taskId:any;
    id:any;
    // signal:string='stop';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.templets =  params['templets'];
        this.id =  params['id'];
        this.taskId =  params['taskId'];
        console.log(typeof(this.templets))
        console.log(this.taskId)
        console.log(this.templets+'>>>>>>>>>>>>>>>>')
    });
    var self=this;
    // var t=setInterval(function(){
    //   self.toggle();
    // },1000)
    console.log(this.templets.length)
    var self=this;
    for(var i=0;i<=self.templets.length-1;i++){
        // var templet=this.templets[i]
        // console.log(templet)
        // console.log('this.is'+templet+'=true');
        // if(self.templets[i]==='1.mov'){
        //     self.istemplet1=true;
        //     this.templet1_price=0.1;
        // }
        if(self.templets[i]==='2.mov'){
            self.istemplet2=true;
            this.templet2_price=5;
        }
        if(self.templets[i]==='3.mov'){
            self.istemplet3=true;
            this.templet3_price=5;
        }
        if(self.templets[i]==='4.mov'){
            self.istemplet4=true;
            this.templet4_price=5;
        }
        if(self.templets[i]==='5.mov'){
            self.istemplet5=true;
            this.templet5_price=5;
        }
        if(self.templets[i]==='6.mov'){
            self.istemplet6=true;
            this.templet6_price=5;
        }
    }
    this.templet_price_sum=Number((this.templet1_price+this.templet2_price+this.templet3_price+this.templet4_price+this.templet5_price+this.templet6_price).toFixed(2));
    // 若全部购买则便宜5元
    if(this.templet_price_sum===25){
        this.templet_price_sum=20;
    }

  }
  pay(){
      // alert('支付中')
      console.log(this.templet_price_sum)
      console.log(this.templets)
      const body = {
        'openid': this.id,
        'total_fee':this.templet_price_sum,
        'templates':this.templets,
        'siteId':'0013',
        'taskId':this.taskId
        };
        console.log(body);
        let that=this;
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
        //   alert('支付成功')
        that.router.navigate(['/download']);
          }
          });
      })
  }
  goback(){
    this.router.navigate(['/templet'],{ queryParams: {id:this.id}})
  }
  godownload(){
    this.router.navigate(['/download'])
  }
  // toggle(){
  //   this.signal=this.signal==='go'?'stop':'go';
  // }





}