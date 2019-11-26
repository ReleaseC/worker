import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ShareService}from '../share/share.service';

@Component({
  selector: 'app-Single_result',
  templateUrl: './Single_result.component.html',
  styleUrls: ['./Single_result.component.css'],
})
@Injectable()
export class Single_ResultComponent implements OnInit {

  taskId: string = '';
  videourl: string = '';
  isPlay: boolean = true;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isShow: boolean = true;
  ismengban: boolean = true;
  isText:boolean=true;
  value: number = 0;
  is_share: any;
  isplay: any;
  number: any;
  img_url:any;
  activity_id:any;
  isshowlogo:boolean=true;
  id:'';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,private shareService: ShareService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
       this.taskId=params['taskId'];
       this.id=params['id'];
       this.activity_id=params['activity_id'];
       this.is_share=params['is_share'];
    });
    if(this.id==undefined||this.is_share=='siiva'){
      window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0c9caded7e8fc8d&redirect_uri=https%3a%2f%2fiva.siiva.com%2fwechat%2fget_payid&response_type=code&scope=snsapi_base&state=SiivaPage,Single_result,'+this.taskId+','+this.activity_id+'&connect_redirect=1#wechat_redirect';
    }else{
      localStorage.setItem('id',this.id)
    }

      this.videourl='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.mp4';
      this.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.jpg';

    //  分享微信朋友圈和好友自定义内容
     this.shareService.onWechatShare(window.location.href,this.taskId,this.activity_id);
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
  GoParter(){
    this.http 
      .get(`${environment.apiServer}activity/flow`,{ params: { 'openid': this.id,'activity_id':this.activity_id} })
      .subscribe(data => {
        console.log(data)
        if(data['code']==0){
        }
      });
       // 跳转到客户链接
      window.location.href='http://camp.thelittlegym.com.cn/order_mome'
    }


  download() {
    window.location.href='https://ui.siiva.com/SiivaPage/#/download?taskId='+this.taskId;
  }










}