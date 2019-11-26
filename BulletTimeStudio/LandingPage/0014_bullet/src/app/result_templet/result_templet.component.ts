import { Component, OnInit, ViewChild, ElementRef, trigger,state,style,transition,animate,keyframes} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-result_templet',
  templateUrl: './result_templet.component.html',
  styleUrls: ['./result_templet.component.css'],
  animations:[
    trigger('signal',[
      state('go',style({
        transform:'translateX(0px)'
      })),
      state('stop',style({
        transform:'translateX(10px)'
      })),
      transition('*=>*',animate('1000ms ease-out'))
    ])
  ]
})
@Injectable()
export class Result_templetComponent implements OnInit {
  isShow: boolean = true;
  isPay: boolean = false;
  isPlay: boolean = true;
  love_number: number = 0;
  videonames: any;
  video_url:any;
  id: '';
  isLove: boolean = false;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isClick: boolean = false;
  isResult: boolean = true;
  ismengban:boolean=true;
  is_download:boolean=false;
  i: any;
  value: number = 0;
  is_share: any;
  friend_id: any;
  is_like: any;
  username: any;
  videoname: any;
  isplay:any;
  baseUrl: any;
  signal:string='stop';
  Ticket:any;
  // isShuiyin:boolean=true;
  templets_pay:string[] = [];
  template_number:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
        this.videonames = params['videonames'];
        this.id = params['id'];
        this.templets_pay=params['templets_pay'];
        this.template_number=params['template_number'];
        this.Ticket=params['Ticket'];
        console.log(this.templets_pay)
    });
  // 判断为包票用户
    if(this.Ticket==='true'){
      this.is_download=true;
    }else{
        for(var i=0;i<=this.templets_pay.length-1;i++){
          if(this.templets_pay[i]==='2.mov' && this.template_number==2){
            // this.isShuiyin=false;
            this.is_download=true;
          }
          if(this.templets_pay[i]==='3.mov'&& this.template_number==3){
            // this.isShuiyin=false;
            this.is_download=true;
          }
          if(this.templets_pay[i]==='4.mov'&& this.template_number==4){
            // this.isShuiyin=false;
            this.is_download=true;
          }
          if(this.templets_pay[i]==='5.mov'&& this.template_number==5){
            // this.isShuiyin=false;
            this.is_download=true;
          }
      }
    }

    this.video_url = 'https://siiva.cn-sh2.ufileos.com/ucloud/'+this.videonames+'.mp4';
    console.log(this.video_url);

// 统计多模板页面访问量
      console.log('template_'+this.template_number);
    const body_visit = {
      'templateId':'template_'+this.template_number,
      'siteId': '0014',
      'mode': 'visit'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, body_visit)
      .subscribe(data => {
        console.log(data)
      });

      //  获取该只视频的点赞量
    this.http
    .get(`${environment.apiServer}datareport/get_statistics`,{ params: { 'taskId': this.videonames} })
    .subscribe(data => {
      console.log(data)
      if(data['code']==0&&data['result'].length!=0){
      this.love_number=data['result'][0]['like'];
      }
    });
  
    var self=this;
    var t=setInterval(function(){
      self.toggle();
    },1000)


  }

  Love() {
    this.isLove = true;
    this.love_number++;
    // if (this.friend_id === undefined) {
    //   this.friend_id = this.id;
    // }

    const task_like_count = {
      'taskId': this.videonames,
      'mode': 'like'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_like_count)
      .subscribe(data => {
        console.log(data)
      });


    // // 统计多模板页面点赞量
    // const body_like = {
    //   'templateId':'template_'+this.template_number,
    //   'siteId': '0014',
    //    'mode':'like'
    // };
    // this.http
    //   .post(`${environment.apiServer}datareport/statistics`, body_like)
    //   .subscribe(data => {
    //     console.log(data)
    //   });

      // const body5 = {
      //   'open_id': this.id,
      //    'friend_id':this.friend_id,
      //    'siteId':'0009'
      // };
      // // console.log(body);
      // this.http
      //   .post(`${environment.apiServer}wechat/get_like`, body5)
      //   .subscribe(data => {
      //     console.log(data)
      //   });
  }

  count_play_number(){
// 统计多模板视频播放量
  const body_play = {
    'templateId':'template_'+this.template_number,
    'siteId': '0014',
     'mode':'play'
  };
  this.http
    .post(`${environment.apiServer}datareport/statistics`, body_play)
    .subscribe(data => {
      console.log(data)
    });
    this.isShow = false;
    this.isPlay_number=false;
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
    // const body3 = {
    //   'siteId': '0009',
    //    'mode':'share'
    // };
    // // console.log(body);
    // this.http
    //   .post(`${environment.apiServer}datareport/point_page`, body3)
    //   .subscribe(data => {
    //     console.log(data)
    //   });
  }
  // 取消分享提示
  cancelShare() {
    this.isShare = false;
    this.isShareimg = false;
  }
  // 判断微信浏览器

  goback(){
    this.router.navigate(['/templet'],{queryParams:{id:this.id,Ticket:this.Ticket}})
  }
  toggle(){
    this.signal=this.signal==='go'?'stop':'go';
  }
  download(){
    this.router.navigate(['/download'],{queryParams:{id:this.id}})
  }


}