import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  uname = '';
  time = '';
  unumber = '';
  video_url='';
  url='';
  public videoplayer;
  title:string ='';


  constructor(private router: Router, private metaService: Meta,private http: HttpClient) { }

  ngOnInit() {
    // console.log($(window).height());
    // input获取焦点时更新窗口高度
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

  find(){
    
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
          console.log(123);
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
            alert('您不是此次参赛选手！');
          }
        });
  }
}





}
