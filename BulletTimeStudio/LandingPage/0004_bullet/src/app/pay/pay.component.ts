import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
    tittle:string='';
    price:any;
    number:number=1;
    id:'';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
  ) { }
  
  ngOnInit() {
      this.tittle='子弹时间个人短视频';
      this.price=9.99;
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });
  
  }
  pay(){
    //   alert("前往支付")
      const body = {
        'openid': this.id
        };
        console.log(body);
        this.http
        .post(`${environment.apiServer}wechat_payment/create_wechatpay`, body)
        .subscribe(data => {
        console.log(data) 
        console.log(data['code'])
        console.log(data['result'])
        wx.chooseWXPay({
          timestamp: data['result'].timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data['result'].nonceStr, // 支付签名随机串，不长于 32 位
          package: data['result'].package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
          signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data['result'].paySign, // 支付签名
          success: function (res) {
          // 支付成功后的回调函数
          }
          });
      })
  }
  finish(){
    // alert(123);
    const body = {
      'openid': this.id
      };
    this.http
    .post(`${environment.apiServer}wechat_payment/is_pay`, body)
    .subscribe(data => {
    console.log(data) 
    console.log(data['code'])
    if(data['code']===1){
      this.router.navigate(['/result'],{ queryParams: {id:this.id}});
    }else{
      alert('支付失败，请重新支付');
    }
    });

  }


}