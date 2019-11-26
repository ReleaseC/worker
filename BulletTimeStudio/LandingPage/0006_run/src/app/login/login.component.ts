import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
// import { CookieService } from 'ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  supportedLangs: {display: string; value: string; }[];
  translatedTitle: string;
  translatedDes: string;
  translatedBtn: string;
  server = environment.apiServer;
  uname = '';
  video_url = '';
  url='';
  timestamp='';
  public videoplayer;
  location: string = '';
  code='';
  open_id = '';
  time = '';
  unumber = '';
  game_id='';
  state='';
  siiva='';
  access_token='';

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.code = params['code'];
      this.game_id = params['game_id'];
      this.state = params['state'];
      this.siiva = params['siiva'];
      this.access_token = params['access_token'];
      console.log(this.code);
      console.log(this.game_id);
      console.log(this.state);
      console.log(this.siiva);
    });

    // console.log(game_id);
    /*微信分享页面进入 */
    if(this.state!==undefined && this.game_id!==undefined){
      this.http
      .get(`${environment.apiServer}users/get_video`, { params: { 'game_id': this.game_id } })
      .subscribe(data => {
        // if (data['result'][0]['is_video'] === 2){
          // console.log(22222);
        //   this.uname = data['result'][0]['name'];              /*获取用户名 */
        //   this.unumber = data['result'][0]['game_id'];         /*获取号码牌 */
        //   this.time = data['result'][0]['game_time'];           /*获取参赛者时间成绩 */
        //   $('.web_5').show().siblings().hide(); 
        //  }
        //  if (data['result'][0]['is_video'] === 1){
          console.log(11111);
            this.uname = data['result'][0]['name'];              /*获取用户名 */
            this.unumber = data['result'][0]['game_id'];         /*获取号码牌 */
            this.time = data['result'][0]['game_time'];           /*获取参赛者时间成绩 */
            this.video_url = "http://storage.siiva.cn/2017_1210_jj-marathon/" + data['result'][0]['game_id'] + ".mp4"
            document.title = data['result'][0]['name'] + '的晋江马拉松精彩时刻'
            // $('.web_3').show().siblings().hide();             /*显示获取视频页面 */
            this.router.navigate( ['/result'], { queryParams: {userName:this.uname,game_id:this.unumber,time:this.time}});
        //  }
      });
    }
     /*微信首次进入 */
     if (this.siiva==='wechat') {
      
     }

     /*微博进入 */
    if(this.siiva==='weibo'){
      this.http
      .post(`${environment.apiServer}weibo/weibo_data`, { "access_token":this.access_token })
      .subscribe(data => {
        
      })
        
    }

   
  }

  myvideo(){
    this.router.navigate( ['/search']);
  }
}