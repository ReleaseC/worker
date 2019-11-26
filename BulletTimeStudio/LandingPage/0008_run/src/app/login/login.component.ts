import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public videoplayer;
  title:string ='';
  is_reservate:any;
  isreserve:boolean=false;
  issearch:boolean=true;
  openid:'';
  uname:'';
  unumber:'';
  time:'';
  wechat:'';
  game_id:'';
  game_time:'';
  name:'';
  is_video:any;
  timestamp:any;
  constructor( private activatedRoute: ActivatedRoute, 
    private http: HttpClient, 
    private metaService: Meta,private router: Router) { }

  ngOnInit() {

    this.timestamp=new Date().getTime();
    console.log(this.timestamp)
    if(this.timestamp>1525068000000){          //判断北京时间2018/4/30 14:00:00之后只能查找视频，不能预约
      this.issearch=false;
      this.isreserve=true;
    }
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.is_reservate =  params['is_reservate'];
      this.openid =  params['openid'];
      this.wechat =  params['wechat'];
      this.game_id =  params['game_id'];
      this.game_time =  params['game_time'];
      this.name =  params['name'];
      this.is_video =  params['is_video'];
    });
    if(this.is_reservate == 1){                                 // 已经预约用户
       if(this.timestamp<1525068000000){
        this.router.navigate(['/reserve']);                     //视频发放前 已预约用户统一进入预约成功页面
       }else{ 
        if(this.is_video==0){                                   
        this.router.navigate(['/fail']);                         // 视频发送后 已经预约用户但视频还未产出 进入视频等待页面
        }else{                                                   // 已经预约用户并且视频已经产出 进入视频结果页面
          this.router.navigate(['/result'], { queryParams: {userName: this.name,id:this.game_id,time:this.game_time}})
        }
      } 
    }
    
    
    
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    if(isAndroid){
      var myInput1 = (<HTMLInputElement>document.getElementById("username"));
      var myInput2=(<HTMLInputElement>document.getElementById("number"))
      myInput1.addEventListener('focus',function(){
        // $('.register').css('top','0px');
        $('.register').animate({'top':'0px'});
      })
      myInput2.addEventListener('focus',function(){
        // $('.register').css('top','0px');
        $('.register').animate({'top':'0px'});
      })
      myInput1.addEventListener('blur',function(){
        // $('.register').css('top','33%');
        $('.register').animate({'top':'33%'});
      })
      myInput2.addEventListener('blur',function(){
        // $('.register').css('top','33%');
        $('.register').animate({'top':'33%'});
      })
    }
  


  }

  reserve(){
        let number = '';
        let username = '';
        number = (<HTMLInputElement>document.getElementById("number")).value;
        username = (<HTMLInputElement>document.getElementById("username")).value;
        if(number==''||username==''){
          if(number==''){
            alert('请输入您的号码牌')
          }
          if(username==''){
            alert('请输入您的姓名')
          }
        }else{
        const body={
          'siteId':'0008',
          'game_id':number,
          'name':username,
          'openid':this.openid,
          'wechat':JSON.parse(this.wechat)
        }
        this.http
        .post(environment.apiServer+'users/add_user', body)
        .subscribe(data => {
          console.log(data);
          if(data['code']===1){
            this.router.navigate(['reserve']);
          }else{
            alert('您的输入有误，请重新输入')
          }
        });
      }
  }
  search(){
    let number = '';
    let username = '';
    number = (<HTMLInputElement>document.getElementById("number")).value;
    username = (<HTMLInputElement>document.getElementById("username")).value;
    if(number==''||username==''){
      if(number==''){
        alert('请输入您的号码牌')
      }
      if(username==''){
        alert('请输入您的姓名')
      }
    }else{
    this.http
    .get(environment.apiServer+'users/find', { params: { 'name': username, 'game_id': number } })
    .subscribe(data => {
      // console.log(123);
      if (data['code'] === 1) {
        if (data['result']['is_video'] === 0) {
          this.router.navigate(['/fail']);               /*显示视频未成功页面 */
        } 
        if (data['result']['is_video'] === 1){
          this.uname = data['result']['name'];              /*获取用户名 */
          this.unumber = data['result']['game_id'];         /*获取号码牌 */
          this.time = data['result']['game_time'];           /*获取参赛者时间成绩 */
          this.router.navigate(
            ['/result'], { queryParams: {userName: this.uname,id:this.unumber,time:this.time}}
          );                                                    /*显示获取视频页面 */
        }
      } else {
        alert('您的输入是否有误，请重新输入');
      }
    });
  }
}




}
